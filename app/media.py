import os

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")


def _rel_from_static(url: str) -> str | None:
    if not url or not str(url).startswith("/static/"):
        return None
    return str(url)[len("/static/") :]


def media_variants(url: str) -> dict:
    """Return original + optional WebP URL for a /static/ path."""
    rel = _rel_from_static(url)
    if not rel:
        return {"src": url, "webp": None}

    webp_rel = f"{os.path.splitext(rel)[0]}.webp"
    webp_path = os.path.join(STATIC_DIR, webp_rel)
    webp = f"/static/{webp_rel}" if os.path.isfile(webp_path) else None
    return {"src": url, "webp": webp}


def static_asset_exists(url: str) -> bool:
    rel = _rel_from_static(url)
    if not rel:
        return bool(url)
    return os.path.isfile(os.path.join(STATIC_DIR, rel))
