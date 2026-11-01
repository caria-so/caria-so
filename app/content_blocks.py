"""Shared structured content (project pages, sectioned posts)."""

from app.media import normalize_static_url


def normalize_sections_document(doc):
    """Normalize top-level and section image paths in place."""
    for key in ('image', 'desktop_cover', 'mobile_cover'):
        if doc.get(key):
            doc[key] = normalize_static_url(doc[key])

    for section in doc.get('sections') or []:
        if section.get('image'):
            section['image'] = normalize_static_url(section['image'])
        if section.get('images'):
            normalized = []
            for img in section['images']:
                if isinstance(img, dict) and img.get('src'):
                    img = {**img, 'src': normalize_static_url(img['src'])}
                elif isinstance(img, str):
                    img = normalize_static_url(img)
                normalized.append(img)
            section['images'] = normalized
        case_study = section.get('case_study')
        if isinstance(case_study, dict) and case_study.get('evidence'):
            case_study['evidence'] = [
                {**item, 'image': normalize_static_url(item['image'])}
                if isinstance(item, dict) and item.get('image') else item
                for item in case_study['evidence']
            ]
    return doc
