"""Load and enrich blog notes with thread placement."""

import os
import re

import yaml

from app.content_blocks import normalize_sections_document
from app.markdown_utils import (
    convert_markdown,
    create_markdown_parser,
    extract_footnote_defs,
    strip_footnote_block,
)
from app.media import normalize_static_url

POST_SECTION_MARKER = re.compile(r'<!--\s*post-section:\s*([\w-]+)\s*-->', re.IGNORECASE)
from app.notes_nlp import (
    build_thread_centroids,
    extract_entities,
    merge_terms,
    note_plain_text,
    suggest_thread,
)
from app.notes_threads import (
    THREADS_PATH,
    get_fallback_thread,
    get_thread,
    group_posts_by_thread,
    load_thread_registry,
    normalize_thread_slug,
    parse_keywords,
    parse_manual_thread,
    sort_thread_posts,
)

POSTS_DIR = os.path.join(os.path.dirname(__file__), 'blog', 'posts')

_NOTES_CACHE = {
    'posts_mtime': None,
    'threads_mtime': None,
    'notes': None,
    'registry': None,
}


def _file_mtime(path):
    try:
        return os.path.getmtime(path)
    except OSError:
        return 0


def _posts_dir_mtime(posts_dir):
    if not os.path.isdir(posts_dir):
        return 0
    mtimes = []
    for name in os.listdir(posts_dir):
        if name.endswith('.md'):
            mtimes.append(_file_mtime(os.path.join(posts_dir, name)))
    return max(mtimes) if mtimes else 0


def _cache_valid(posts_dir):
    posts_mtime = _posts_dir_mtime(posts_dir)
    threads_mtime = _file_mtime(THREADS_PATH)
    return (
        _NOTES_CACHE['notes'] is not None
        and _NOTES_CACHE['posts_mtime'] == posts_mtime
        and _NOTES_CACHE['threads_mtime'] == threads_mtime
    )


def _store_cache(posts_dir, notes, registry):
    _NOTES_CACHE['posts_mtime'] = _posts_dir_mtime(posts_dir)
    _NOTES_CACHE['threads_mtime'] = _file_mtime(THREADS_PATH)
    _NOTES_CACHE['notes'] = notes
    _NOTES_CACHE['registry'] = registry


def resolve_note_filepath(posts_dir, slug):
    direct = os.path.join(posts_dir, f'{slug}.md')
    if os.path.isfile(direct):
        return direct
    if not os.path.isdir(posts_dir):
        return None
    target = f'{slug}.md'.lower()
    for name in os.listdir(posts_dir):
        if name.lower() == target:
            return os.path.join(posts_dir, name)
    return None


def parse_note_file(filepath):
    """Read a note once — frontmatter meta + raw markdown body."""
    if not filepath or not os.path.isfile(filepath):
        return {}, ''

    try:
        with open(filepath, 'r', encoding='utf-8') as handle:
            content = handle.read()
    except OSError:
        return {}, ''

    if not content.startswith('---'):
        return {}, content

    try:
        _, front_matter, body = content.split('---', 2)
        meta = yaml.safe_load(front_matter) or {}
        return meta, body
    except (ValueError, yaml.YAMLError):
        return {}, content


def _normalize_tags(raw):
    if raw is None:
        return []
    if isinstance(raw, list):
        return raw
    if isinstance(raw, str) and raw.strip():
        return [raw.strip()]
    return []


def _summary_from_meta(meta, filepath, raw_text):
    filename = os.path.basename(filepath)
    return {
        'slug': meta.get('slug') or filename[:-3],
        'title': meta.get('title', 'Untitled'),
        'author': meta.get('author', 'Unknown'),
        'date': meta.get('date', ''),
        'tags': _normalize_tags(meta.get('tags')),
        'summary': meta.get('summary', ''),
        'image': meta.get('image', ''),
        'content': '',
        'raw_text': raw_text,
        'last_modified': _file_mtime(filepath),
    }


def attach_terms(post, meta, *, use_nlp):
    post = dict(post)
    post['keywords'] = parse_keywords(meta)
    if use_nlp:
        post['entities'] = extract_entities(note_plain_text(post))
    else:
        post['entities'] = []
    post['terms'] = merge_terms(post['keywords'], post['entities'])
    return post


def resolve_thread(post, meta, registry, centroids):
    """Manual frontmatter → spaCy + keywords centroid match → inbox."""
    manual = parse_manual_thread(meta)
    if manual:
        return manual, 'manual', 1.0

    terms = post.get('terms') or []
    inbox = get_fallback_thread(registry)['slug']
    slug, score = suggest_thread(terms, registry, centroids, inbox_slug=inbox)
    source = 'computed' if slug != inbox else 'inbox'
    return slug, source, score


def attach_thread_fields(post, meta, registry, centroids):
    post = dict(post)
    post['thread_order'] = meta.get('thread_order')
    thread_slug, source, confidence = resolve_thread(post, meta, registry, centroids)
    thread_slug = normalize_thread_slug(thread_slug, registry)
    thread_meta = get_thread(registry, thread_slug)
    post['thread'] = thread_slug
    post['thread_source'] = source
    post['thread_confidence'] = confidence
    post['thread_title'] = thread_meta.get('title', thread_slug)
    post['thread_color'] = thread_meta.get('color', 'hatch-neutral')
    return post


def _preview_manual_threads(prepared, registry):
    preview = []
    for item in prepared:
        post = item['post']
        meta = item['meta']
        manual = parse_manual_thread(meta)
        row = {**post, 'terms': item.get('terms') or item['entities']}
        if manual:
            row['thread'] = manual
            row['thread_source'] = 'manual'
        preview.append(row)
    return build_thread_centroids(preview, registry)


def _iter_note_files(posts_dir):
    if not os.path.isdir(posts_dir):
        return
    for name in sorted(os.listdir(posts_dir)):
        if name.endswith('.md'):
            yield os.path.join(posts_dir, name)


def _build_notes_index(posts_dir, parse_date_fn=None):
    registry = load_thread_registry()

    prepared = []
    for filepath in _iter_note_files(posts_dir):
        meta, raw_text = parse_note_file(filepath)
        post = _summary_from_meta(meta, filepath, raw_text)
        use_nlp = not parse_manual_thread(meta)
        enriched = attach_terms(post, meta, use_nlp=use_nlp)
        prepared.append({
            'post': enriched,
            'meta': meta,
            'terms': enriched['terms'],
            'entities': enriched['entities'],
        })

    needs_computed = any(not parse_manual_thread(item['meta']) for item in prepared)
    centroids = _preview_manual_threads(prepared, registry) if needs_computed else {}

    notes = []
    for item in prepared:
        note = attach_thread_fields(item['post'], item['meta'], registry, centroids)
        if parse_date_fn and note.get('date'):
            note['parsed_date'] = parse_date_fn(note['date'])
        notes.append(note)

    return notes, registry


def load_notes(posts_dir=POSTS_DIR, parse_date_fn=None):
    """Load note summaries for archive/listing. Cached until posts or threads change."""
    if _cache_valid(posts_dir):
        return _NOTES_CACHE['notes'], _NOTES_CACHE['registry']

    notes, registry = _build_notes_index(posts_dir, parse_date_fn)
    _store_cache(posts_dir, notes, registry)
    return notes, registry


def _sections_include_methodology(sections):
    return any(s.get('type') == 'methodology' for s in (sections or []))


def _html_with_footnotes(segment, defs, md):
    source = segment if not defs else f"{segment.rstrip()}\n\n{defs}"
    return convert_markdown(source, md)


def _build_content_chunks(raw_text, sections_by_id):
    """Split markdown on <!-- post-section: id --> and interleave structured blocks."""
    body, defs = extract_footnote_defs(raw_text)
    md = create_markdown_parser()
    chunks = []
    last = 0
    for match in POST_SECTION_MARKER.finditer(body):
        if match.start() > last:
            segment = body[last:match.start()]
            if segment.strip():
                chunks.append({
                    'type': 'html',
                    'html': _html_with_footnotes(segment, defs, md),
                })
        section_id = match.group(1)
        section = sections_by_id.get(section_id)
        if section:
            chunks.append({'type': 'section', 'section': section})
        last = match.end()
    if last < len(body):
        segment = body[last:]
        if segment.strip():
            chunks.append({
                'type': 'html',
                'html': _html_with_footnotes(segment, defs, md),
            })

    if defs:
        html_indexes = [i for i, chunk in enumerate(chunks) if chunk['type'] == 'html']
        if not chunks or chunks[-1]['type'] != 'html':
            chunks.append({'type': 'html', 'html': convert_markdown(defs, md)})
            html_indexes.append(len(chunks) - 1)
        for i in html_indexes[:-1]:
            chunks[i]['html'] = strip_footnote_block(chunks[i]['html'])
    return chunks


def hydrate_note_content(note, posts_dir=POSTS_DIR):
    """Attach rendered HTML and optional structured sections (post detail only)."""
    if not note:
        return note

    filepath = resolve_note_filepath(posts_dir, note.get('slug', ''))
    if not filepath:
        return note

    meta, raw_text = parse_note_file(filepath)
    note = dict(note)

    sections = meta.get('sections') or []
    if sections:
        normalize_sections_document({'sections': sections})
    sections_by_id = {s['id']: s for s in sections if s.get('id')}
    leading_sections = [s for s in sections if not s.get('id')]
    use_inline = bool(sections_by_id and POST_SECTION_MARKER.search(raw_text))

    if raw_text.strip() and not note.get('content'):
        md = create_markdown_parser()
        if use_inline:
            note['content_chunks'] = _build_content_chunks(raw_text, sections_by_id)
            body_for_toc = POST_SECTION_MARKER.sub('\n\n', raw_text)
            convert_markdown(body_for_toc, md)
            note['toc'] = getattr(md, 'toc', '')
        else:
            note['content'] = convert_markdown(raw_text, md)
            note['toc'] = getattr(md, 'toc', '')

    if sections:
        note['sections'] = leading_sections if use_inline else sections
        note['related_post_slugs'] = meta.get('related_posts') or []
        if meta.get('technologies'):
            note['technologies'] = meta.get('technologies')
        if meta.get('accent'):
            note['accent'] = meta.get('accent')
        note['has_methodology'] = (
            _sections_include_methodology(leading_sections)
            or _sections_include_methodology(sections_by_id.values())
        )

    if meta.get('image'):
        note['image'] = normalize_static_url(meta.get('image'))

    return note


def filter_notes_by_query(notes, query):
    if not query:
        return notes
    q = query.lower()
    return [
        n for n in notes
        if q in n.get('title', '').lower()
        or q in n.get('summary', '').lower()
        or q in n.get('content', '').lower()
        or q in n.get('raw_text', '').lower()
        or any(q in kw for kw in n.get('keywords', []))
        or any(q in term for term in n.get('terms', []))
    ]


def filter_notes_by_thread(notes, thread_slug):
    if not thread_slug:
        return notes
    key = thread_slug.lower()
    return [n for n in notes if n.get('thread', '').lower() == key]


def get_thread_columns(notes, registry):
    return group_posts_by_thread(notes, registry)


def related_notes_in_thread(note, all_notes, limit=3):
    thread = note.get('thread')
    if not thread:
        return []
    siblings = [
        n for n in all_notes
        if n.get('slug') != note.get('slug') and n.get('thread') == thread
    ]
    return sort_thread_posts(siblings)[:limit]
