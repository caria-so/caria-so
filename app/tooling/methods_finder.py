"""Method Finder — loads app/data/research_methods/methods.json."""

from app.data_loader import load_json

_CATALOG_JSON = ('research_methods', 'methods.json')


def load_catalog():
    """Return the methods catalog with lookup helpers for the Method Finder page."""
    data = load_json(*_CATALOG_JSON)
    methods = data.get('methods', [])
    return {
        'schema_version': data.get('schema_version', '1.0'),
        'meta': data.get('meta', {}),
        'methods': methods,
        'methods_by_id': {m['id']: m for m in methods if m.get('id')},
        'count': len(methods),
    }
