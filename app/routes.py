import hashlib
import json
import os
import yaml
from flask import Blueprint, render_template, request, abort, current_app, session, redirect, url_for, flash
from datetime import datetime
from functools import wraps

from app.markdown_utils import convert_markdown, create_markdown_parser

from app.papers_loader import (
    build_genealogy_viz_payload,
    build_regime_viz_payload,
    discover_runs,
    get_run,
    merge_run_viz_overlay,
    resolve_paper_filepath,
)
from app.notes_loader import (
    filter_notes_by_query,
    filter_notes_by_thread,
    get_thread_columns,
    hydrate_note_content,
    load_notes,
    related_notes_in_thread,
)
from app.notes_threads import build_thread_counts
from app.tooling.methods_finder import load_catalog as load_methods_finder_catalog
from app.endorsements_loader import load_endorsements
from app.mail import MailConfigError, MailDeliveryError, send_contact_email
from app.papers_db import (
    init_reviews_db,
    submit_review,
    get_paper_reviews,
    get_paper_ratings,
    get_all_ratings,
)

blog_bp = Blueprint('blog', __name__)

# Define the directory containing blog post markdown files
POSTS_DIR = os.path.join(os.path.dirname(__file__), 'blog', 'posts')
PROJECTS_DIR = os.path.join(os.path.dirname(__file__), 'projects')

PROJECT_SERVICES = {
    'product': {
        'label': 'Product',
        'title': 'Product research & audits',
        'color': 'hatch-ecommerce',
    },
    'development': {
        'label': 'Development',
        'title': 'Prototyping & development',
        'color': 'hatch-ux',
    },
    'pipelines': {
        'label': 'Pipelines',
        'title': 'AI & data pipelines',
        'color': 'hatch-ai',
    },
    'knowledge': {
        'label': 'Knowledge',
        'title': 'Knowledge systems',
        'color': 'hatch-libraries',
    },
}
PROJECT_SERVICE_SLUGS = frozenset(PROJECT_SERVICES.keys())


@blog_bp.context_processor
def inject_project_services():
    return {'project_services': PROJECT_SERVICES}


LEGACY_PROJECT_SLUGS = {
    'project__bookshelf': 'bookshelf',
    'project__flowws': 'flowws',
    'project__impossible-papers': 'impossible-papers',
    'project__deepocr': 'deepOCR',
    'project__monsieur': 'monsieur',
    'site__libreria-rotondi': 'libreria-rotondi',
    'tooling__benchmark-qa': 'qa-tool',
    'data__scidata-hub': 'scidata-hub',
}
PAPERS_DIR = os.path.join(os.path.dirname(__file__), 'data', 'fingerprints')
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')
VITRIOL_DIR = os.path.join(os.path.dirname(__file__), 'blog', 'vitriol')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'hello@caria.so')


def _valid_email(value):
    if not value or len(value) > 254 or '@' not in value:
        return False
    local, _, domain = value.partition('@')
    return bool(local and domain and '.' in domain)


def _build_contact_body(form_type, name, email, company, service, budget, message):
    lines = [
        f'New {form_type} from caria.so',
        '',
        f'Name: {name}',
        f'Email: {email}',
    ]
    if company:
        lines.append(f'Affiliation / company: {company}')
    if service:
        lines.append(f'Subject / domain: {service}')
    if budget and budget != 'ip-analysis':
        lines.append(f'Budget: {budget}')
    lines.extend(['', 'Message:', message, ''])
    return '\n'.join(lines)


def _contact_redirect(fallback=None):
    return redirect(request.referrer or fallback or url_for('blog.index'))


def parse_date(date_str):
    """Parse date string into datetime object."""
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except (ValueError, TypeError):
        return datetime.min


def normalize_tags(raw):
    """YAML `tags:` with no value is None — always return a list."""
    if raw is None:
        return []
    if isinstance(raw, list):
        return raw
    if isinstance(raw, str) and raw.strip():
        return [raw.strip()]
    return []


def normalize_services(raw):
    """Normalize project `service` / `services` frontmatter to valid service slugs."""
    if raw is None:
        return []
    items = raw if isinstance(raw, list) else [raw]
    services = []
    for item in items:
        if not item:
            continue
        slug = str(item).strip().lower().replace(' ', '_').replace('-', '_')
        if slug in PROJECT_SERVICE_SLUGS and slug not in services:
            services.append(slug)
    return services


def filter_projects_by_service(projects, service_slug):
    if not service_slug or service_slug not in PROJECT_SERVICE_SLUGS:
        return projects
    return [p for p in projects if service_slug in p.get('services', [])]


def parse_markdown_file(filepath, md):
    """Parse a markdown file and return the content and metadata."""
    md.reset()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        meta = {}
        html_content = ""

        if content.startswith('---'):
            try:
                _, front_matter, markdown_content = content.split('---', 2)
                meta = yaml.safe_load(front_matter) or {}
                html_content = convert_markdown(markdown_content, md)
            except (yaml.YAMLError, ValueError) as e:
                current_app.logger.error(f"Error parsing {filepath}: {str(e)}")
                html_content = convert_markdown(content, md)
        else:
            html_content = convert_markdown(content, md)

        return html_content, meta
    except Exception as e:
        current_app.logger.error(f"Error processing {filepath}: {str(e)}")
        return "", {}


def get_tag_colors(tags):
    """Generate consistent colors for tags that won't change between sessions."""
    color_palette = [
        "#D33F49", "#3E92CC", "#2EC4B6", "#FF9F1C", "#845EC2",
        "#4D8B31", "#FF6B6B", "#4A6C6F", "#F9C80E", "#5C415D"
    ]

    # Create a fixed mapping based on tag name
    tag_colors = {}
    for tag in tags:
        # Sum the character codes in the tag name
        char_sum = sum(ord(c) for c in tag)
        # Use this to deterministically select a color
        index = char_sum % len(color_palette)
        tag_colors[tag] = color_palette[index]

    return tag_colors


def _build_tag_counts(posts):
    """Count posts per tag for archive sidebar filters."""
    counts = {}
    for post in posts:
        for tag in post.get('tags', []):
            counts[tag] = counts.get(tag, 0) + 1
    return counts


def get_posts_by_slugs(directory, slugs):
    """Load specific posts by their slugs from the given directory."""
    if not slugs:
        return []
    
    all_posts = load_posts(directory)
    selected_posts = []
    
    for slug in slugs:
        post = next((p for p in all_posts if p['slug'] == slug), None)
        if post:
            selected_posts.append(post)
    
    return selected_posts

def get_featured_posts(directory, featured_slugs=None, count=4):
    """Get featured posts by slugs, or latest posts if no slugs provided."""
    if featured_slugs:
        return get_posts_by_slugs(directory, featured_slugs)
    else:
        return load_posts(directory)[:count]

def _iter_markdown_files(directory, recursive=False):
    """Yield markdown file paths; projects load recursively from subfolders."""
    if not os.path.isdir(directory):
        return
    if recursive:
        for dirpath, _, filenames in os.walk(directory):
            for filename in filenames:
                if filename.endswith('.md'):
                    yield os.path.join(dirpath, filename)
        return
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            yield os.path.join(directory, filename)


def _static_asset_exists(url):
    if not url or not str(url).startswith('/static/'):
        return False
    rel = str(url)[len('/static/'):]
    return os.path.isfile(os.path.join(STATIC_DIR, rel))


def _resolve_project_cover(project):
    """Return first cover URL that exists on disk."""
    for key in ('desktop_cover', 'image', 'mobile_cover'):
        url = project.get(key, '')
        if _static_asset_exists(url):
            return url
    return ''


_DEV_COMMIT_MSGS = [
    'fix: guard against empty response body',
    'refactor: split config into modules',
    'feat: add retry with exponential backoff',
    'chore: bump dependencies',
    'fix: race condition in worker pool',
    'test: cover pagination edge cases',
    'docs: clarify env var setup',
    'perf: cache hot path lookups',
    'fix: off-by-one in batch iterator',
    'refactor: extract shared validation',
]


def _build_git_commits(projects, limit=7):
    """Commits for the projects hero git-graph viz."""
    lane_pattern = [0, 1, 1, 0, 0, 1, 0]
    commits = []
    for i, project in enumerate(projects[:limit]):
        slug = project.get('slug', '')
        commits.append({
            'hash': hashlib.sha1(slug.encode('utf-8')).hexdigest()[:7],
            'msg': _DEV_COMMIT_MSGS[i % len(_DEV_COMMIT_MSGS)],
            'slug': slug,
            'accent': project.get('accent') or 'hatch-neutral',
            'status': project.get('status') or '',
            'lane': lane_pattern[i % len(lane_pattern)],
        })
    return commits


def load_posts(directory):
    """Load and parse posts from the given directory with caching. Returns list of posts sorted by date."""
    posts = []
    if not os.path.exists(directory):
        os.makedirs(directory)
        return posts

    md = create_markdown_parser()

    recursive = directory == PROJECTS_DIR

    for filepath in _iter_markdown_files(directory, recursive=recursive):
        html_content, meta = parse_markdown_file(filepath, md)
        filename = os.path.basename(filepath)

        post = {
            'slug': meta.get('slug') or filename[:-3],
            'content': html_content,
            'title': meta.get('title', 'Untitled'),
            'author': meta.get('author', 'Unknown'),
            'date': meta.get('date', ''),
            'tags': normalize_tags(meta.get('tags')),
            'summary': meta.get('summary', ''),
            'image': meta.get('image', ''),
            'toc': getattr(md, 'toc', ''),
            'last_modified': datetime.fromtimestamp(os.path.getmtime(filepath))
        }

        if directory == PROJECTS_DIR:
            post.update({
                'description': meta.get('description', post.get('summary', '')),
                'image': meta.get('image', ''),
                'github_link': meta.get('github_link', ''),
                'live_link': meta.get('live_link', ''),
                'technologies': meta.get('technologies', []),
                'status': meta.get('status', 'Completed'),
                'date': meta.get('date', ''),
                'client': meta.get('client', ''),
                'role': meta.get('role', ''),
                'accent': meta.get('accent', ''),
                'pattern': meta.get('pattern', ''),
                'desktop_cover': meta.get('desktop_cover', ''),
                'mobile_cover': meta.get('mobile_cover', ''),
                'hover_video': meta.get('hover_video', '') or (
                    meta.get('video_cover', '') if str(meta.get('video_cover', '')).endswith('.mp4') else ''
                ),
                'hover_video_device': meta.get('hover_video_device', meta.get('video_device', '')),
                'sections': meta.get('sections', []),
                'related_posts': meta.get('related_posts', []),
                'services': normalize_services(meta.get('services') or meta.get('service')),
                'body': html_content,
            })

            if not post['summary'] and post.get('description'):
                post['summary'] = post['description']

            post['cover_url'] = _resolve_project_cover(post)
            post['cover_desktop'] = post.get('desktop_cover', '') if _static_asset_exists(post.get('desktop_cover', '')) else ''
            post['cover_mobile'] = post.get('mobile_cover', '') if _static_asset_exists(post.get('mobile_cover', '')) else ''
            post['demo_link'] = post.get('demo_link', post.get('live_link', ''))

        posts.append(post)

    posts.sort(key=lambda post: parse_date(post['date']), reverse=True)
    return posts


def _normalize_paper_domain(domain_str):
    """Take the first segment of a slash-separated domain string."""
    if not domain_str:
        return 'general'
    return domain_str.split('/')[0].strip().lower().replace(' ', '_')


def _load_fingerprint_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def _paper_summary(data):
    hypothesis = data.get('hypothesis', {})
    seed = data.get('seed', {})
    if isinstance(hypothesis, dict):
        text = hypothesis.get('core_thesis') or data.get('hypothesis_text') or seed.get('hypothesis') or ''
    elif isinstance(hypothesis, str):
        text = hypothesis
    else:
        text = data.get('hypothesis_text') or seed.get('hypothesis') or ''
    return text[:500].strip()


def _paper_title(data, slug):
    seed = data.get('seed', {})
    hypothesis = data.get('hypothesis', {})
    if isinstance(hypothesis, dict):
        title = (seed.get('title') or hypothesis.get('title') or '').strip()
    else:
        title = (seed.get('title') or '').strip()
    if not title and isinstance(data.get('hypothesis'), str):
        raw = data['hypothesis'].strip()
        title = raw[:140] + ('…' if len(raw) > 140 else '')
    return title or slug


def _paper_listing_fields(data, slug, filepath):
    """Metadata for cards and headers — no full fingerprint payload."""
    meta = data.get('_meta', {})
    seed = data.get('seed', {})
    hypothesis = data.get('hypothesis', {})
    claims = data.get('claims', {}).get('final') or data.get('final_claims', [])
    refs = data.get('literature', {}).get('references', [])

    title = _paper_title(data, slug)
    if isinstance(hypothesis, dict):
        domain_raw = seed.get('domain') or hypothesis.get('target_domain') or ''
    else:
        domain_raw = seed.get('domain') or ''
    completed = meta.get('completed_at', '')

    return {
        'slug': slug,
        'title': title,
        'domain': _normalize_paper_domain(domain_raw),
        'date': completed[:10] if completed else '',
        'summary': _paper_summary(data),
        'status': meta.get('verdict') or meta.get('status') or 'draft',
        'run_id': meta.get('run_id') or data.get('run_id', ''),
        'verdict': meta.get('verdict', ''),
        'tags': (seed.get('keywords') or [])[:6],
        'claim_count': len(claims),
        'literature_count': len(refs),
        'last_modified': datetime.fromtimestamp(os.path.getmtime(filepath)),
    }


def _summarize_pipeline(pipeline):
    """Collapse pipeline log into per-loop step summaries."""
    loops = {}
    for event in pipeline or []:
        if event.get('event') != 'node_end':
            continue
        state = event.get('state') or {}
        loop = state.get('loop_count', 0)
        loops.setdefault(loop, []).append({
            'node': event.get('node'),
            'ts': event.get('ts'),
            'elapsed_s': event.get('elapsed_s'),
            'claims_active': state.get('claims_active'),
            'references': state.get('references'),
            'simulations': state.get('simulation_results'),
            'verdict': state.get('verdict'),
            'status': state.get('status'),
        })
    return [{'loop': loop, 'steps': steps} for loop, steps in sorted(loops.items())]


def _regime_diversity_report(data):
    """Slim regime_diversity block for paper_report.js."""
    rd = data.get('regime_diversity') or {}
    if not rd:
        return None

    emb = rd.get('embedding_distance') or {}
    struct = rd.get('structural_distance') or {}
    summary = rd.get('summary') or {}
    elements = []
    for el in (rd.get('elements') or [])[:12]:
        elements.append({
            'element': (el.get('element') or '')[:140],
            'novelty_level': el.get('novelty_level', ''),
            'prior_art': (el.get('prior_art') or [])[:2],
        })

    return {
        'summary': summary,
        'embedding': {
            'thesis_distance': emb.get('thesis_distance'),
            'thesis_similarity': emb.get('thesis_similarity'),
            'claim_avg_similarity': emb.get('claim_avg_similarity'),
            'residual_distance_to_centroid': emb.get('residual_distance_to_centroid'),
        },
        'structural_distance_score': struct.get('distance_score'),
        'new_variables_count': len(struct.get('new_variables') or []),
        'elements': elements,
        'residual_hypothesis': (rd.get('residual_hypothesis') or '')[:400],
    }


def _build_report_mock(data):
    """Quick mock report sections — best-effort from whatever the fingerprint has."""
    meta = data.get('_meta', {})
    seed = data.get('seed', {})
    hypothesis = data.get('hypothesis', {})
    interpreted = data.get('interpreted_findings') or {}
    claims_raw = data.get('claims', {}).get('final') or data.get('final_claims', [])

    status_by_claim = {}
    if isinstance(interpreted, dict):
        for item in interpreted.get('claim_interpretations', []):
            status_by_claim[item.get('claim_id')] = item.get('evidence_status')

    claims_brief = []
    for claim in claims_raw:
        stmt = claim.get('statement', '')
        claims_brief.append({
            'id': claim.get('id'),
            'type': claim.get('type', 'derived'),
            'statement': stmt[:280] + ('…' if len(stmt) > 280 else ''),
            'status': status_by_claim.get(claim.get('id'), claim.get('status') or 'unknown'),
        })

    simulations = []
    for sim in data.get('simulation_results', []):
        simulations.append({
            'simulation_id': sim.get('simulation_id'),
            'gap_id': sim.get('gap_id'),
            'verdict': sim.get('verdict'),
            'supports_hypothesis': sim.get('supports_hypothesis'),
            'interpretation': (sim.get('interpretation') or '')[:400],
            'primary_result': sim.get('primary_result'),
            'dataset_used': sim.get('dataset_used'),
        })

    regime = []
    if isinstance(interpreted, dict):
        for row in interpreted.get('regime_distances', []):
            label = row.get('label', '')
            regime.append({
                'label': label,
                'similarity': row.get('similarity_to_centroid'),
                'distance': row.get('distance_to_centroid'),
                'is_claim': label.startswith('c') and label[1:].isdigit(),
                'nearest': (row.get('nearest_papers') or [])[:2],
            })

    review = data.get('review_summary') or {}
    if isinstance(review, dict):
        review = {
            'overall_verdict': review.get('overall_verdict'),
            'what_survived': review.get('what_survived', [])[:4],
            'what_died': review.get('what_died', [])[:4],
            'summary': (review.get('summary') or '')[:600],
        }

    seed_text = ''
    if isinstance(hypothesis, dict):
        seed_text = hypothesis.get('core_thesis') or seed.get('hypothesis') or ''
    elif isinstance(hypothesis, str):
        seed_text = hypothesis
    else:
        seed_text = seed.get('hypothesis') or data.get('hypothesis_text') or ''

    return {
        'seed_id': meta.get('seed_id') or data.get('seed_id') or seed.get('id'),
        'seed_text': seed_text.strip()[:1200],
        'scope': hypothesis.get('scope', '') if isinstance(hypothesis, dict) else '',
        'loops_completed': meta.get('loops_completed', data.get('loops_completed', 0)),
        'pipeline_loops': _summarize_pipeline(data.get('pipeline', [])),
        'gradient_history': (data.get('harnesses') or {}).get('gradient_history', []),
        'claims': claims_brief,
        'regime_distances': regime,
        'simulations': simulations,
        'review_summary': review,
        'interpreted_direction': interpreted.get('evidential_direction') if isinstance(interpreted, dict) else None,
        'has_genealogy': bool(data.get('concept_genealogy')),
        'regime_diversity': _regime_diversity_report(data),
        'references_count': meta.get('references_count') or data.get('references_count') or len(
            (data.get('literature') or {}).get('references', [])
        ),
    }


def _fingerprint_viz_payload(data, run_path=None, iteration_fn=None):
    """Slim subset for client-side visualization (concept_genealogy.js)."""
    return build_genealogy_viz_payload(data, run_path, iteration_fn)


def _paper_from_fingerprint(data, slug, filepath, run_path=None, iteration_fn=None, iteration_count=None):
    """Build paper dict from loaded fingerprint JSON."""
    paper = _paper_listing_fields(data, slug, filepath)
    if run_path:
        paper['run_path'] = run_path
        paper['iteration'] = iteration_fn
        if iteration_count is not None:
            paper['iteration_count'] = iteration_count
    return paper


def load_papers(include_fingerprint=False):
    """Load fingerprint JSON files — flat files plus latest iteration per run folder."""
    papers = []
    seen_slugs = set()

    if not os.path.exists(PAPERS_DIR):
        os.makedirs(PAPERS_DIR)
        return papers

    for filename in os.listdir(PAPERS_DIR):
        if not filename.endswith('.json'):
            continue

        filepath = os.path.join(PAPERS_DIR, filename)
        slug = filename[:-5]

        try:
            data = _load_fingerprint_file(filepath)
            paper = _paper_from_fingerprint(data, slug, filepath)
            if include_fingerprint:
                paper['fingerprint'] = _fingerprint_viz_payload(data)
                paper['scope'] = (data.get('hypothesis') or {}).get('scope', '')
            papers.append(paper)
            seen_slugs.add(slug)
        except (json.JSONDecodeError, OSError) as e:
            current_app.logger.error(f"Error loading paper {filepath}: {e}")

    for run in discover_runs():
        if run['path'] in seen_slugs:
            continue
        latest = run['iterations'][-1]
        filepath = os.path.join(PAPERS_DIR, run['path'].replace('/', os.sep), latest['filename'])
        try:
            data = _load_fingerprint_file(filepath)
            paper = _paper_from_fingerprint(
                data,
                run['path'],
                filepath,
                run_path=run['path'],
                iteration_fn=latest['filename'],
                iteration_count=len(run['iterations']),
            )
            if include_fingerprint:
                paper['fingerprint'] = _fingerprint_viz_payload(
                    data, run_path=run['path'], iteration_fn=latest['filename']
                )
                paper['scope'] = (data.get('hypothesis') or {}).get('scope', '')
            papers.append(paper)
            seen_slugs.add(run['path'])
        except (json.JSONDecodeError, OSError) as e:
            current_app.logger.error(f"Error loading run paper {filepath}: {e}")

    papers.sort(key=lambda paper: parse_date(paper['date']), reverse=True)
    return papers


def load_paper(slug, iteration_fn=None):
    """Load a single paper by slug or run path, with viz payload attached."""
    resolved = resolve_paper_filepath(slug, iteration_fn)
    if not resolved:
        return None

    filepath, slug, run_path, iteration = resolved

    try:
        data = _load_fingerprint_file(filepath)
        if run_path:
            data = merge_run_viz_overlay(data, run_path, iteration)
        run = get_run(run_path) if run_path else None
        paper = _paper_from_fingerprint(
            data,
            slug,
            filepath,
            run_path=run_path,
            iteration_fn=iteration,
            iteration_count=len(run['iterations']) if run else None,
        )
        paper['fingerprint'] = _fingerprint_viz_payload(data, run_path, iteration)
        paper['report'] = _build_report_mock(data)
        paper['scope'] = paper['report'].get('scope') or ''
        if run:
            paper['iterations'] = run['iterations']
        if not paper.get('literature_count') and paper['report'].get('references_count'):
            paper['literature_count'] = paper['report']['references_count']
        return paper
    except (json.JSONDecodeError, OSError) as e:
        current_app.logger.error(f"Error loading paper {filepath}: {e}")
        return None


@blog_bp.route('/')
def index():
    """Landing page with recent posts and projects"""
    # Define featured content - you can customize these lists
    featured_post_slugs = [
        'vibe__conscious_vibe',
        'vibe__embracing_the_vibe', 
        'vibe__vibe_coding_toolkit',
        'ux__basics_of_good_product_list'
    ]
    
    featured_project_slugs = [
        'libreria-rotondi',
        'flowws',
        'bookshelf',
        'impossible-papers',
    ]
    
    # Get featured posts and projects (falls back to latest if slugs don't exist)
    posts = get_featured_posts(POSTS_DIR, featured_post_slugs, 4)
    projects = get_featured_posts(PROJECTS_DIR, featured_project_slugs, 4)
    
    # Get all tags for consistent coloring
    all_tags = sorted(set(tag for post in (posts + projects) for tag in post.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)
    
    return render_template('index.html', 
                         recent_posts=posts, 
                         recent_projects=projects,
                         tag_colors=tag_colors,
                         endorsements=load_endorsements())


@blog_bp.route('/archive')
def archive_index():
    """Notes board — threads with aggregated cards; optional search."""
    query = request.args.get('q', '').strip().lower()
    all_notes, registry = load_notes(POSTS_DIR, parse_date_fn=parse_date)
    notes = filter_notes_by_query(all_notes, query)
    columns = get_thread_columns(notes, registry)
    all_tags = sorted(set(tag for note in all_notes for tag in note.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template(
        'blog.html',
        view='board',
        columns=columns,
        registry=registry,
        posts=notes,
        tags=all_tags,
        tag_colors=tag_colors,
        thread_counts=build_thread_counts(all_notes, registry),
        total_count=len(all_notes),
        current_thread='',
        query=query,
    )


@blog_bp.route('/archive/thread/<thread_slug>')
def thread_detail(thread_slug):
    """Single thread column — horizontal note list."""
    query = request.args.get('q', '').strip().lower()
    all_notes, registry = load_notes(POSTS_DIR, parse_date_fn=parse_date)
    notes = filter_notes_by_thread(all_notes, thread_slug)
    notes = filter_notes_by_query(notes, query)
    thread_meta = next((t for t in registry if t['slug'] == thread_slug), None)
    if not thread_meta:
        abort(404, description='Thread not found')

    all_tags = sorted(set(tag for note in all_notes for tag in note.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template(
        'blog.html',
        view='thread',
        columns=[],
        registry=registry,
        posts=notes,
        thread_meta=thread_meta,
        tags=all_tags,
        tag_colors=tag_colors,
        thread_counts=build_thread_counts(all_notes, registry),
        total_count=len(all_notes),
        current_thread=thread_slug,
        query=query,
    )


@blog_bp.route('/blog')
def blog_redirect():
    """Legacy URL — redirect to archive."""
    return redirect(url_for('blog.archive_index', **request.args), code=301)


@blog_bp.route('/post/<slug>')
def post_detail(slug):
    """Individual note page."""
    notes, registry = load_notes(POSTS_DIR, parse_date_fn=parse_date)
    post = next((note for note in notes if note['slug'] == slug), None)

    if not post:
        abort(404, description="Post not found")

    post = hydrate_note_content(post, POSTS_DIR)

    related_posts = related_notes_in_thread(post, notes, limit=3)
    all_tags = sorted(set(tag for n in notes for tag in n.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template(
        'post.html',
        post=post,
        related_posts=related_posts,
        tag_colors=tag_colors,
        is_vitriol=False,
    )


@blog_bp.route('/tag/<tag>')
def tag_posts(tag):
    """Legacy tag URL — search notes by tag keyword."""
    return redirect(url_for('blog.archive_index', q=tag.lower()), code=301)



CV_PDF = 'assets/pdf/cv/federico_caria_cv.pdf'


def _cv_download_context():
    """Return CV download URL if the PDF exists under static/assets/pdf/."""
    cv_path = os.path.join(current_app.root_path, 'static', CV_PDF)
    available = os.path.isfile(cv_path)
    return {
        'cv_available': available,
        'cv_url': url_for('static', filename=CV_PDF) if available else None,
    }


@blog_bp.route('/methods')
def methods_finder():
    """Method Finder — filterable research & design methods toolkit."""
    catalog = load_methods_finder_catalog()
    return render_template('tooling/methods_finder.html', catalog=catalog)


@blog_bp.route('/about')
def about():
    """About page — profile, endorsements, contact CTA."""
    return render_template(
        'about.html',
        endorsements=load_endorsements(),
        **_cv_download_context(),
    )


@blog_bp.route('/experience')
def experience():
    """Legacy URL — redirects to /about."""
    return redirect(url_for('blog.about'))


@blog_bp.route('/projects')
def projects():
    """Projects page — all projects; service filtering is client-side."""
    projects = load_posts(PROJECTS_DIR)

    for project in projects:
        # Ensure slug is available
        if 'slug' not in project:
            project['slug'] = project.get(
                'title', '').lower().replace(' ', '-')

        # Set default values for optional fields if not present
        project['summary'] = project.get(
            'summary', project.get('description', ''))
        project['technologies'] = project.get('technologies', [])
        project['image'] = project.get('image', '')
        project['live_link'] = project.get('live_link', project.get('demo_link', ''))
        project['github_link'] = project.get('github_link', '')

    # Get all tags for consistent coloring
    all_tags = sorted(
        set(tag for project in projects for tag in project.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)
    git_commits = _build_git_commits(projects)

    return render_template(
        'projects.html',
        projects=projects,
        all_projects_count=len(projects),
        tag_colors=tag_colors,
        git_commits=git_commits,
    )


@blog_bp.route('/project/<slug>')
def project_detail(slug):
    """Individual project page with structured sections."""
    if slug in LEGACY_PROJECT_SLUGS:
        return redirect(url_for('blog.project_detail', slug=LEGACY_PROJECT_SLUGS[slug]), code=301)

    projects = load_posts(PROJECTS_DIR)
    project = next((p for p in projects if p['slug'] == slug), None)

    if not project:
        abort(404, description="Project not found")

    # Resolve related posts — frontmatter stores slugs as a list of strings
    if project.get('related_posts') and isinstance(project['related_posts'][0], str):
        all_posts = load_posts(POSTS_DIR)
        project['related_posts'] = [
            p for slug_ref in project['related_posts']
            for p in all_posts
            if p['slug'] == slug_ref
        ]

    # Get all tags for consistent coloring
    all_tags = sorted(set(tag for p in projects for tag in p.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template(
        'project_detail.html',
        project=project,
        tag_colors=tag_colors,
    )


@blog_bp.route('/vitriol', methods=['GET', 'POST'])
def vitriol():
    """Secret area requiring an acronym solution to access a list of posts"""
    correct_solution = "visita interiora terrae rectificando invenies occultum lapidem"

    if request.method == 'POST':
        solution = request.form.get('solution', '').lower().strip()

        if solution == correct_solution:
            session['vitriol_solved'] = True
            vitriol_posts = load_posts(VITRIOL_DIR)

            # Generate tag colors
            all_tags = sorted(
                set(tag for post in vitriol_posts for tag in post.get('tags', [])))
            tag_colors = get_tag_colors(all_tags)

            return render_template('vitriol.html', posts=vitriol_posts, solved=True,
                                   tags=all_tags, tag_colors=tag_colors)
        else:
            return render_template('vitriol.html', error="Incorrect solution. Try again.", solved=False)

    if session.get('vitriol_solved'):
        vitriol_posts = load_posts(VITRIOL_DIR)

        # Generate tag colors
        all_tags = sorted(
            set(tag for post in vitriol_posts for tag in post.get('tags', [])))
        tag_colors = get_tag_colors(all_tags)

        return render_template('vitriol.html', posts=vitriol_posts, solved=True,
                               tags=all_tags, tag_colors=tag_colors)

    return render_template('vitriol.html', solved=False)


@blog_bp.route('/vitriol/<slug>')
def vitriol_post(slug):
    """Show individual vitriol post"""
    if not session.get('vitriol_solved'):
        return redirect(url_for('blog.vitriol'))

    posts = load_posts(VITRIOL_DIR)
    post = next((post for post in posts if post['slug'] == slug), None)

    if not post:
        abort(404, description="Post not found")

    related_posts = sorted(
        (other_post for other_post in posts if other_post['slug'] != slug and set(
            other_post['tags']) & set(post['tags'])),
        key=lambda p: len(set(p['tags']) & set(post['tags'])),
        reverse=True
    )[:3]

    # Generate tag colors for all posts to ensure consistency
    all_tags = sorted(set(tag for p in posts for tag in p.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template('post.html', post=post, related_posts=related_posts,
                           tag_colors=tag_colors, is_vitriol=True)


@blog_bp.route('/how-i-work')
def how_i_work():
    """How I Work page"""
    return render_template('how-i-work.html')


@blog_bp.route('/impossible-papers')
def impossible_papers():
    """Impossible Papers — system overview and analysis requests."""
    return render_template('impossible_papers.html')


@blog_bp.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions — sends notification to CONTACT_EMAIL."""
    fallback = request.referrer or url_for('blog.index')

    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        company = request.form.get('company', '').strip()
        service = request.form.get('service', '').strip()
        budget = request.form.get('budget', '').strip()
        message = request.form.get('message', '').strip()

        if not email or not message:
            flash('Please add your email and a message.', 'error')
            return _contact_redirect(fallback)

        if not _valid_email(email):
            flash('Please enter a valid email address.', 'error')
            return _contact_redirect(fallback)

        if len(message) > 10000:
            flash('Message is too long. Please keep it under 10,000 characters.', 'error')
            return _contact_redirect(fallback)

        if not name:
            name = 'Anonymous'

        recipient = current_app.config.get('CONTACT_EMAIL', CONTACT_EMAIL)
        form_type = 'Impossible Papers request' if budget == 'ip-analysis' else 'contact form submission'
        subject = f'[caria.so] {service or "General inquiry"} — {name}'

        send_contact_email(
            to=recipient,
            reply_to=email,
            subject=subject,
            body=_build_contact_body(form_type, name, email, company, service, budget, message),
        )

        current_app.logger.info('Contact email sent for %s (%s)', name, email)
        flash('Thank you for your message! I\'ll get back to you within 24 hours.', 'success')
        return _contact_redirect(fallback)

    except MailConfigError as exc:
        current_app.logger.error('Contact form misconfigured: %s', exc)
        flash(
            f'Sorry, the contact form is not configured yet. Email me directly at {CONTACT_EMAIL}.',
            'error',
        )
        return _contact_redirect(fallback)
    except MailDeliveryError as exc:
        current_app.logger.error('Contact email delivery failed: %s', exc)
        flash(
            f'Sorry, there was an error sending your message. Please try again or email me directly at {CONTACT_EMAIL}.',
            'error',
        )
        return _contact_redirect(fallback)
    except Exception as exc:
        current_app.logger.error('Error processing contact form: %s', exc)
        flash(
            f'Sorry, there was an error sending your message. Please try again or email me directly at {CONTACT_EMAIL}.',
            'error',
        )
        return _contact_redirect(fallback)

# ── Papers listing ──────────────────────────────────────

def papers_enabled(view):
    """404 the fingerprint-backed pages unless ENABLE_PAPERS is set."""
    @wraps(view)
    def wrapper(*args, **kwargs):
        if not current_app.config.get('ENABLE_PAPERS'):
            abort(404)
        return view(*args, **kwargs)
    return wrapper


@blog_bp.route('/papers')
@papers_enabled
def papers_index():
    """All findings with aggregate ratings."""
    papers = load_papers()
    paper_runs = discover_runs()
    all_ratings = get_all_ratings()

    for paper in papers:
        paper['ratings'] = all_ratings.get(paper['slug'], {
            'count': 0, 'novelty': None, 'rigor': None, 'significance': None
        })

    all_tags = sorted(set(t for p in papers for t in p.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template('papers.html',
                           papers=papers,
                           paper_runs=paper_runs,
                           tag_colors=tag_colors)


# ── Regime diversity (iteration radar) ──────────────────

@blog_bp.route('/regime-diversity')
@papers_enabled
def regime_diversity():
    """Compare parent vs child fingerprint in a run folder."""
    run_path = request.args.get('run', 'neurosciences/neurorehab_run')
    parent_fn = request.args.get('parent')
    child_fn = request.args.get('child')

    payload = build_regime_viz_payload(run_path, parent_fn, child_fn)
    if not payload:
        abort(404, description="Run or fingerprint pair not found")

    return render_template(
        'regime_diversity.html',
        run=payload['run'],
        parent=payload['parent'],
        child=payload['child'],
        radar=payload['radar'],
    )


# ── Paper detail ────────────────────────────────────────

@blog_bp.route('/papers/<path:slug>')
@papers_enabled
def paper_detail(slug):
    """Single finding with fingerprint viz, reviews, and review form."""
    iteration = request.args.get('iteration')
    paper = load_paper(slug, iteration_fn=iteration)
    if not paper:
        abort(404, description="Paper not found")

    paper['ratings'] = get_paper_ratings(slug)
    paper['reviews'] = get_paper_reviews(slug)

    all_tags = sorted(set(tag for p in load_papers() for tag in p.get('tags', [])))
    tag_colors = get_tag_colors(all_tags)

    return render_template('paper_detail.html',
                           paper=paper,
                           tag_colors=tag_colors)


# ── Submit review ───────────────────────────────────────

@blog_bp.route('/papers/<path:slug>/review', methods=['POST'])
@papers_enabled
def submit_paper_review(slug):
    """Handle review form submission."""
    try:
        novelty = int(request.form.get('novelty', 0))
        rigor = int(request.form.get('rigor', 0))
        significance = int(request.form.get('significance', 0))

        # Validate range
        if not all(1 <= v <= 7 for v in [novelty, rigor, significance]):
            flash('Ratings must be between 1 and 7.', 'error')
            return redirect(url_for('blog.paper_detail', slug=slug))

        comment = request.form.get('comment', '')
        email = request.form.get('email', '')
        affiliation = request.form.get('affiliation', '')
        ip_address = request.remote_addr or '0.0.0.0'

        success = submit_review(
            paper_slug=slug,
            novelty=novelty,
            rigor=rigor,
            significance=significance,
            comment=comment,
            email=email,
            affiliation=affiliation,
            ip_address=ip_address
        )

        if success:
            flash('Review submitted. Thank you.', 'success')
        else:
            flash('One review per paper per day.', 'error')

    except (ValueError, TypeError):
        flash('Invalid input.', 'error')

    return redirect(url_for('blog.paper_detail', slug=slug))