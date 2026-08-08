"""Load fingerprint runs, iterations, and regime-diversity viz payloads."""

import json
import os
import re
from datetime import datetime

PAPERS_ROOT = os.path.join(os.path.dirname(__file__), 'data', 'fingerprints')
FP_RE = re.compile(r'^fingerprint_(?P<ts>\d{8}T\d{6}Z)\.json$')


def parse_fingerprint_timestamp(filename):
    match = FP_RE.match(filename)
    if not match:
        return None
    try:
        return datetime.strptime(match.group('ts'), '%Y%m%dT%H%M%SZ')
    except ValueError:
        return None


def discover_runs(papers_root=PAPERS_ROOT):
    """Find run folders containing timestamped fingerprint JSON files."""
    runs = []
    if not os.path.isdir(papers_root):
        return runs

    for dirpath, _, filenames in os.walk(papers_root):
        fps = sorted(
            [f for f in filenames if FP_RE.match(f)],
            key=lambda f: parse_fingerprint_timestamp(f) or datetime.min,
        )
        if not fps:
            continue

        rel = os.path.relpath(dirpath, papers_root)
        if rel == '.':
            run_id = os.path.basename(papers_root)
        else:
            run_id = rel.replace(os.sep, '/')

        iterations = []
        for fn in fps:
            ts = parse_fingerprint_timestamp(fn)
            filepath = os.path.join(dirpath, fn)
            meta = peek_fingerprint_meta(filepath)
            iterations.append({
                'filename': fn,
                'timestamp': ts.isoformat() + 'Z' if ts else '',
                'timestamp_label': ts.strftime('%Y-%m-%d %H:%M UTC') if ts else fn,
                'run_id': meta.get('run_id', ''),
                'verdict': meta.get('verdict', ''),
                'parent_run': meta.get('parent_run'),
                'novelty_ratio': meta.get('novelty_ratio'),
            })

        runs.append({
            'id': run_id,
            'path': run_id,
            'iterations': iterations,
        })

    runs.sort(key=lambda r: r['path'])
    return runs


def peek_fingerprint_meta(filepath):
    """Light metadata read — still parses full JSON but returns only header fields."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}

    meta = data.get('_meta', {})
    rd = data.get('regime_diversity') or {}
    summary = rd.get('summary') or {}
    return {
        'run_id': meta.get('run_id') or data.get('run_id', ''),
        'verdict': meta.get('verdict') or data.get('verdict', ''),
        'parent_run': meta.get('parent_run'),
        'completed_at': meta.get('completed_at', ''),
        'novelty_ratio': summary.get('novelty_ratio'),
    }


def slim_fingerprint(data):
    """Strip heavy fields; keep report + regime diversity slices."""
    meta = data.get('_meta', {})
    hypothesis = data.get('hypothesis', {})
    seed = data.get('seed', {})
    rd = data.get('regime_diversity') or {}
    claims = data.get('claims', {}).get('final') or data.get('final_claims', [])

    if isinstance(hypothesis, str):
        core_thesis = hypothesis
    else:
        core_thesis = hypothesis.get('core_thesis') or seed.get('hypothesis') or data.get('hypothesis_text') or ''

    literature = data.get('literature') or {}
    return {
        'run_id': meta.get('run_id') or data.get('run_id', ''),
        'completed_at': meta.get('completed_at', ''),
        'verdict': meta.get('verdict') or data.get('verdict', ''),
        'parent_run': meta.get('parent_run'),
        'hypothesis': {'core_thesis': core_thesis[:2000]},
        'claims': {'final': [{'id': c.get('id'), 'type': c.get('type')} for c in claims]},
        'regime_diversity': {
            'embedding_distance': rd.get('embedding_distance') or {},
            'summary': rd.get('summary') or {},
            'structural_distance': rd.get('structural_distance') or {},
            'elements': (rd.get('elements') or [])[:20],
            'residual': (rd.get('residual') or '')[:1200],
            'residual_hypothesis': (rd.get('residual_hypothesis') or '')[:800],
        },
        'literature': {
            'references_count': literature.get('references_count') or len(literature.get('references', [])),
            'regime_map': {
                'n_papers': (literature.get('regime_map') or {}).get('n_papers'),
            },
        },
    }


def load_fingerprint(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_fingerprint_slim(filepath):
    return slim_fingerprint(load_fingerprint(filepath))


def run_dir(run_path):
    return os.path.join(PAPERS_ROOT, run_path.replace('/', os.sep))


def iteration_filepath(run_path, filename):
    return os.path.join(run_dir(run_path), filename)


def get_run(run_path):
    runs = discover_runs()
    return next((r for r in runs if r['path'] == run_path), None)


# Old flat slugs → (run path, optional iteration filename)
LEGACY_PAPER_SLUGS = {
    'fingerprint_neurorehab_01': 'neurosciences/neurorehab_run',
}


def resolve_paper_filepath(slug, iteration_fn=None):
    """Map URL slug to a fingerprint JSON path.

    Returns (filepath, slug, run_path, iteration_filename) or None.
    slug may be a legacy flat name or a run path like neurosciences/neurorehab_run.
    """
    slug = (slug or '').strip().strip('/')
    if not slug:
        return None

    if slug in LEGACY_PAPER_SLUGS:
        slug = LEGACY_PAPER_SLUGS[slug]

    flat_path = os.path.join(PAPERS_ROOT, f'{slug}.json')
    if os.path.isfile(flat_path):
        return flat_path, slug, None, os.path.basename(flat_path)

    run = get_run(slug)
    if not run or not run['iterations']:
        return None

    if iteration_fn:
        if not any(it['filename'] == iteration_fn for it in run['iterations']):
            return None
        chosen = iteration_fn
    else:
        chosen = run['iterations'][-1]['filename']

    filepath = iteration_filepath(slug, chosen)
    if not os.path.isfile(filepath):
        return None

    return filepath, slug, slug, chosen


def _viz_overlay_from_fingerprint(data):
    """Extract genealogy / evidence / refs without regime_map embeddings."""
    lit = data.get('literature') or {}
    cg = data.get('concept_genealogy') or {}
    refs = lit.get('references') or []
    ev = data.get('evidence_graph') or {}
    if not cg and not ev and not refs:
        return None
    return {
        'concept_genealogy': cg,
        'evidence_graph': ev,
        'literature': {
            'references': refs,
            'references_count': lit.get('references_count') or len(refs),
        },
    }


def merge_run_viz_overlay(primary_data, run_path, primary_filename):
    """Fill missing genealogy, evidence, and refs from earlier run iterations."""
    if not run_path:
        return primary_data

    run = get_run(run_path)
    if not run or len(run['iterations']) <= 1:
        return primary_data

    merged = dict(primary_data)
    needs_cg = not merged.get('concept_genealogy')
    needs_ev = not merged.get('evidence_graph')
    needs_refs = not (merged.get('literature') or {}).get('references')

    if not (needs_cg or needs_ev or needs_refs):
        return merged

    for it in run['iterations']:
        if it['filename'] == primary_filename:
            continue
        overlay = _viz_overlay_from_fingerprint(
            load_fingerprint(iteration_filepath(run_path, it['filename']))
        )
        if not overlay:
            continue
        if needs_cg and overlay['concept_genealogy']:
            merged['concept_genealogy'] = overlay['concept_genealogy']
            needs_cg = False
        if needs_ev and overlay['evidence_graph']:
            merged['evidence_graph'] = overlay['evidence_graph']
            needs_ev = False
        if needs_refs and overlay['literature']['references']:
            lit = dict(merged.get('literature') or {})
            lit['references'] = overlay['literature']['references']
            lit['references_count'] = overlay['literature']['references_count']
            merged['literature'] = lit
            if not merged.get('references_count'):
                merged['references_count'] = lit['references_count']
            needs_refs = False
        if not (needs_cg or needs_ev or needs_refs):
            break

    return merged


def build_genealogy_viz_payload(data, run_path=None, primary_filename=None):
    """Slim payload for concept_genealogy.js.

    For multi-iteration runs, genealogy lives in an earlier fingerprint while the
    latest iteration carries simulations/regime data. Use the parent iteration
    for concept → claim edges (literature paper IDs), not simulation dataset IDs.
    """
    viz_source = data
    claims = (data.get('claims') or {}).get('final') or data.get('final_claims') or []

    if run_path:
        run = get_run(run_path)
        if run:
            for it in run['iterations']:
                if primary_filename and it['filename'] == primary_filename:
                    continue
                candidate = load_fingerprint(iteration_filepath(run_path, it['filename']))
                if candidate.get('concept_genealogy'):
                    viz_source = candidate
                    claims = (candidate.get('claims') or {}).get('final') or claims
                    break

    refs = (viz_source.get('literature') or {}).get('references', [])
    ev_graph = viz_source.get('evidence_graph') or {}
    slim_claims = []

    for claim in claims:
        supported = list(claim.get('supported_by') or [])
        if not supported:
            eg = ev_graph.get(claim.get('id'), {})
            for side in ('supporting', 'challenging'):
                side_data = eg.get(side) or {}
                if isinstance(side_data, dict):
                    for bucket in side_data.values():
                        if isinstance(bucket, list):
                            supported.extend(bucket)

        slim_claims.append({
            'id': claim.get('id'),
            'type': claim.get('type', 'derived'),
            'statement': (claim.get('statement') or '')[:400],
            'depends_on': claim.get('depends_on') or [],
            'supported_by': supported,
        })

    return {
        'concept_genealogy': viz_source.get('concept_genealogy') or {},
        'claims': {'final': slim_claims},
        'evidence_graph': ev_graph,
        'literature': {
            'references': [
                {
                    'id': ref.get('id'),
                    'title': ref.get('title', ''),
                    'year': ref.get('year'),
                    'authors': ref.get('authors', ''),
                }
                for ref in refs
            ],
        },
    }


def resolve_iteration_pair(run_path, parent_fn=None, child_fn=None):
    run = get_run(run_path)
    if not run or len(run['iterations']) < 1:
        return None, None, run

    iters = run['iterations']
    parent = next((i for i in iters if i['filename'] == parent_fn), None) if parent_fn else iters[0]
    child = next((i for i in iters if i['filename'] == child_fn), None) if child_fn else iters[-1]

    if parent is None:
        parent = iters[0]
    if child is None:
        child = iters[-1]
    return parent, child, run


def extract_radar_axes(parent_data, child_data):
    """Build 7-axis regime diversity radar values per visualize_residual.md."""
    p_claims = parent_data.get('claims', {}).get('final') or []
    c_claims = child_data.get('claims', {}).get('final') or []
    rd = child_data.get('regime_diversity') or {}
    emb = rd.get('embedding_distance') or {}
    struct = rd.get('structural_distance') or {}
    summary = rd.get('summary') or {}

    new_vars = struct.get('new_variables') or []
    preserved = struct.get('preserved_variables') or []
    dropped = struct.get('dropped_variables') or []
    total_vars = len(new_vars) + len(preserved) + len(dropped)

    claim_ratio = len(c_claims) / max(len(p_claims), 1)
    claim_ratio = min(claim_ratio, 2.0) / 2.0

    child_values = {
        'thesis_distance': float(emb.get('thesis_distance') or 0),
        'claim_divergence': 1.0 - float(emb.get('claim_avg_similarity') or 1),
        'residual_distance': float(emb.get('residual_distance_to_centroid') or 0),
        'novelty_ratio': float(summary.get('novelty_ratio') or 0),
        'structural_distance': float(struct.get('distance_score') or 0),
        'new_variables': (len(new_vars) / total_vars) if total_vars else 0,
        'claim_count_shift': claim_ratio,
    }

    parent_values = {
        'thesis_distance': 0,
        'claim_divergence': 0,
        'residual_distance': 0,
        'novelty_ratio': 0,
        'structural_distance': 0,
        'new_variables': 0,
        'claim_count_shift': 1.0,
    }

    labels = [
        'Thesis distance',
        'Claim divergence',
        'Residual distance',
        'Novelty ratio',
        'Structural distance',
        'New variables',
        'Claim count shift',
    ]
    keys = list(child_values.keys())

    axes = []
    for label, key in zip(labels, keys):
        axes.append({
            'key': key,
            'label': label,
            'parent': parent_values[key],
            'child': child_values[key],
        })

    raw_max = max(child_values.values()) if child_values else 0.01
    scale_max = max(raw_max * 1.3, 0.01)

    thesis_sim = emb.get('thesis_similarity')

    return {
        'axes': axes,
        'raw_max': raw_max,
        'scale_max': scale_max,
        'thesis_similarity': thesis_sim,
        'novelty_summary': summary,
        'residual': rd.get('residual', ''),
        'residual_hypothesis': rd.get('residual_hypothesis', ''),
        'elements': rd.get('elements') or [],
    }


def build_regime_viz_payload(run_path, parent_fn=None, child_fn=None):
    parent_iter, child_iter, run = resolve_iteration_pair(run_path, parent_fn, child_fn)
    if not run:
        return None

    parent_path = iteration_filepath(run_path, parent_iter['filename'])
    child_path = iteration_filepath(run_path, child_iter['filename'])

    parent_data = load_fingerprint_slim(parent_path)
    child_data = load_fingerprint_slim(child_path)
    radar = extract_radar_axes(parent_data, child_data)

    return {
        'run': run,
        'parent': {
            'iteration': parent_iter,
            'data': parent_data,
        },
        'child': {
            'iteration': child_iter,
            'data': child_data,
        },
        'radar': radar,
    }
