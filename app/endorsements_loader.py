"""Load endorsements from data/endorsements/."""

from app.data_loader import load_json

ENDORSEMENTS_JSON = ('endorsements', 'endorsements.json')


def load_endorsements():
    """Return the endorsements list for about + index carousels."""
    data = load_json(*ENDORSEMENTS_JSON)
    return data.get('endorsements', [])
