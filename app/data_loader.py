"""Load JSON datasets from app/data/.

Layout:
    app/data/
      research_methods/methods.json   → tooling/methods_finder
      endorsements/endorsements.json
      fingerprints/                   (IP runs — large)

Each tooling page loads from its own subfolder via app/tooling/<tool>.py.
"""

import json
import os

# app/data — same package as this loader's sibling directory
DATA_ROOT = os.path.join(os.path.dirname(__file__), 'data')


def data_path(*parts):
    """Absolute path under app/data/."""
    return os.path.join(DATA_ROOT, *parts)


def load_json(*parts):
    """Load and parse a JSON file from app/data/."""
    path = data_path(*parts)
    with open(path, encoding='utf-8') as handle:
        return json.load(handle)
