"""spaCy NER + lightweight thread suggestion. Optional — degrades without the model."""

from __future__ import annotations

import logging
import os
import re

# BLAS + Flask reloader on macOS can abort (libblis) — keep single-threaded.
os.environ.setdefault('OMP_NUM_THREADS', '1')
os.environ.setdefault('MKL_NUM_THREADS', '1')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')
os.environ.setdefault('VECLIB_MAXIMUM_THREADS', '1')
os.environ.setdefault('NUMEXPR_NUM_THREADS', '1')
os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')

logger = logging.getLogger(__name__)

_NLP = None
_NLP_TRIED = False
_NLP_DISABLED = False

ENTITY_LABELS = frozenset({
    'PERSON', 'ORG', 'GPE', 'PRODUCT', 'WORK_OF_ART', 'EVENT', 'LAW', 'LANGUAGE',
    'NORP', 'FAC',
})

STOPWORDS = frozenset({
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once',
})


def get_nlp():
    """Lazy-load NER-only pipeline; return None if spaCy/model unavailable."""
    global _NLP, _NLP_TRIED, _NLP_DISABLED
    if _NLP_DISABLED or (_NLP_TRIED and _NLP is None):
        return None
    if _NLP is not None:
        return _NLP

    _NLP_TRIED = True
    try:
        import spacy
        # NER only — lighter and avoids parser/lemmatizer BLAS churn on reload.
        _NLP = spacy.load(
            'en_core_web_sm',
            disable=['parser', 'lemmatizer', 'attribute_ruler'],
        )
    except Exception as exc:
        logger.warning('spaCy unavailable, using token fallback: %s', exc)
        _NLP = None
        _NLP_DISABLED = True
    return _NLP


def strip_markdown(text):
    """Rough plain-text pass for NLP input."""
    if not text:
        return ''
    text = re.sub(r'```[\s\S]*?```', ' ', text)
    text = re.sub(r'`[^`]+`', ' ', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'[#*_>~-]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def note_plain_text(post):
    """Text bundle used for entity extraction."""
    parts = [
        post.get('title', ''),
        post.get('summary', ''),
        strip_markdown(post.get('raw_text', '')),
    ]
    return ' '.join(p for p in parts if p).strip()


def _normalize_token(token):
    return token.strip().lower()


def extract_entities(text, max_terms=40):
    """Named entities from spaCy; token fallback if model missing or errors."""
    if not text:
        return []

    nlp = get_nlp()
    if nlp is None:
        return _fallback_tokens(text, max_terms)

    try:
        doc = nlp(text[:120_000])
    except Exception as exc:
        logger.warning('spaCy inference failed, using token fallback: %s', exc)
        return _fallback_tokens(text, max_terms)

    terms = []
    for ent in doc.ents:
        if ent.label_ in ENTITY_LABELS:
            lemma = _normalize_token(ent.text)
            if lemma and len(lemma) > 2 and lemma not in STOPWORDS:
                terms.append(lemma)

    return _dedupe(terms, max_terms) if terms else _fallback_tokens(text, max_terms)


def _fallback_tokens(text, max_terms):
    tokens = re.findall(r'[a-zA-Z]{4,}', text.lower())
    filtered = [t for t in tokens if t not in STOPWORDS]
    return _dedupe(filtered, max_terms)


def _dedupe(items, limit):
    seen = set()
    out = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
        if len(out) >= limit:
            break
    return out


def merge_terms(manual_keywords, computed_entities, max_terms=50):
    """Manual frontmatter keywords + spaCy terms, manual first."""
    merged = []
    seen = set()
    for item in (manual_keywords or []) + (computed_entities or []):
        token = _normalize_token(str(item))
        if not token or token in STOPWORDS or token in seen:
            continue
        seen.add(token)
        merged.append(token)
        if len(merged) >= max_terms:
            break
    return merged


def build_thread_centroids(posts, registry):
    """Aggregate term sets from manually threaded notes per column."""
    centroids = {t['slug']: set() for t in registry}
    for post in posts:
        if post.get('thread_source') != 'manual':
            continue
        slug = post.get('thread')
        if slug in centroids:
            centroids[slug].update(post.get('terms') or post.get('entities') or [])
    return centroids


def _thread_signal_terms(thread):
    """Extra match tokens from thread title + slug."""
    title = thread.get('title', '')
    slug = thread.get('slug', '').replace('-', ' ')
    return {_normalize_token(w) for w in re.findall(r'[a-zA-Z]+', f'{title} {slug}') if len(w) > 2}


def _jaccard(a, b):
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def suggest_thread(entities, registry, centroids, inbox_slug='inbox', min_score=0.08):
    """
    Pick best thread from NER overlap with manual centroids.
    Returns (slug, score) or (inbox_slug, 0).
    """
    if not entities:
        return inbox_slug, 0.0

    entity_set = set(entities)
    best_slug = inbox_slug
    best_score = 0.0

    for thread in registry:
        slug = thread['slug']
        if thread.get('fallback'):
            continue
        centroid = set(centroids.get(slug) or [])
        centroid |= _thread_signal_terms(thread)
        score = _jaccard(entity_set, centroid)
        if score > best_score:
            best_score = score
            best_slug = slug

    if best_score < min_score:
        return inbox_slug, best_score
    return best_slug, best_score
