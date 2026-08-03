"""Thread registry and grouping for notes — no NLP here."""

import os

import yaml

THREADS_PATH = os.path.join(os.path.dirname(__file__), 'blog', 'threads.yaml')
INBOX_SLUG = 'inbox'


def load_thread_registry():
    """Return ordered thread definitions from threads.yaml."""
    if not os.path.isfile(THREADS_PATH):
        return _default_registry()
    with open(THREADS_PATH, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f) or {}
    threads = data.get('threads') or []
    return sorted(threads, key=lambda t: t.get('order', 50))


def get_thread(registry, slug):
    """Lookup thread meta; unknown slugs map to inbox."""
    for thread in registry:
        if thread.get('slug') == slug:
            return thread
    return get_fallback_thread(registry)


def get_fallback_thread(registry):
    """Return the thread marked fallback, else inbox stub."""
    for thread in registry:
        if thread.get('fallback'):
            return thread
    return {'slug': INBOX_SLUG, 'title': 'Inbox', 'color': 'hatch-neutral', 'order': 99}


def parse_manual_thread(meta):
    """Explicit thread from frontmatter; None if absent or blank."""
    raw = meta.get('thread')
    if raw is None:
        return None
    value = str(raw).strip()
    return value or None


def parse_keywords(meta):
    """Manual keywords from frontmatter."""
    raw = meta.get('keywords') or []
    if isinstance(raw, str):
        raw = [part.strip() for part in raw.split(',')]
    keywords = []
    for item in raw:
        if not item:
            continue
        word = str(item).strip().lower()
        if word and word not in keywords:
            keywords.append(word)
    return keywords


def normalize_thread_slug(slug, registry):
    """Map a manual/auto slug to a registered thread, else inbox."""
    if not slug:
        return get_fallback_thread(registry)['slug']

    for thread in registry:
        if thread.get('slug') == slug:
            return thread['slug']

    lowered = str(slug).strip().lower()
    slugish = lowered.replace(' ', '-').replace('_', '-')

    for thread in registry:
        if thread.get('slug', '').lower() == slugish:
            return thread['slug']

    for thread in registry:
        if str(thread.get('title', '')).strip().lower() == lowered:
            return thread['slug']

    return get_fallback_thread(registry)['slug']


def build_thread_counts(posts, registry):
    """Count notes per registered thread slug (unknown → inbox)."""
    inbox = get_fallback_thread(registry)['slug']
    counts = {t['slug']: 0 for t in registry}
    for post in posts:
        slug = normalize_thread_slug(post.get('thread'), registry)
        counts[slug] = counts.get(slug, 0) + 1
    return counts


def thread_sort_key(post):
    """Order notes inside a column: thread_order then date."""
    order = post.get('thread_order')
    if order is not None:
        try:
            return (0, int(order))
        except (TypeError, ValueError):
            pass
    date = post.get('parsed_date')
    if date:
        return (1, -date.timestamp())
    return (2, post.get('title', ''))


def sort_thread_posts(posts):
    return sorted(posts, key=thread_sort_key)


def group_posts_by_thread(posts, registry):
    """Build column payloads for the board — every registered thread appears."""
    buckets = {t['slug']: [] for t in registry}
    inbox = get_fallback_thread(registry)['slug']

    for post in posts:
        slug = normalize_thread_slug(post.get('thread'), registry)
        buckets.get(slug, buckets[inbox]).append(post)

    columns = []
    for thread in registry:
        slug = thread['slug']
        thread_posts = sort_thread_posts(buckets.get(slug, []))
        columns.append({
            **thread,
            'posts': thread_posts,
            'count': len(thread_posts),
            'suggested_count': sum(1 for p in thread_posts if p.get('thread_source') != 'manual'),
        })
    return columns


def _default_registry():
    return [
        {'slug': INBOX_SLUG, 'title': 'Inbox', 'color': 'hatch-neutral', 'order': 99, 'fallback': True},
    ]
