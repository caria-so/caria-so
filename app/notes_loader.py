"""Load and enrich blog notes with thread placement."""

import os

import yaml

from app.markdown_utils import convert_markdown, create_markdown_parser
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


def hydrate_note_content(note, posts_dir=POSTS_DIR):
    """Attach rendered HTML for a single note (post detail only)."""
    if not note or note.get('content'):
        return note

    filepath = resolve_note_filepath(posts_dir, note.get('slug', ''))
    if not filepath:
        return note

    _, raw_text = parse_note_file(filepath)
    if not raw_text:
        return note

    md = create_markdown_parser()

    note = dict(note)
    note['content'] = convert_markdown(raw_text, md)
    note['toc'] = getattr(md, 'toc', '')
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
