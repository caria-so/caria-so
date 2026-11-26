"""Shared Markdown parsing for posts, projects, and notes."""

import re

import markdown
from markdown.extensions.codehilite import CodeHiliteExtension
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.meta import MetaExtension
from markdown.extensions.tables import TableExtension

_LIST_ITEM_RE = re.compile(r'^(\s*)([-*+]|\d+\.)\s')
_FOOTNOTE_DEF_RE = re.compile(
    r'^[ \t]{0,3}\[\^[^\]]+\]:[^\n]*(?:\n[ \t]+[^\n]*)*',
    re.M,
)
_FOOTNOTE_BLOCK_RE = re.compile(r'<div class="footnote">[\s\S]*?</div>', re.I)


def normalize_list_spacing(text):
    """Insert a blank line before lists when missing (Python-Markdown requires it)."""
    if not text:
        return text

    lines = text.split('\n')
    out = []
    for i, line in enumerate(lines):
        if i > 0 and _LIST_ITEM_RE.match(line):
            prev = lines[i - 1]
            if prev.strip() and not _LIST_ITEM_RE.match(prev):
                if out and out[-1].strip():
                    out.append('')
        out.append(line)
    return '\n'.join(out)


def create_markdown_parser():
    return markdown.Markdown(
        extensions=[
            CodeHiliteExtension(),
            TableExtension(),
            FencedCodeExtension(),
            MetaExtension(),
            'markdown.extensions.toc',
            'markdown.extensions.footnotes',
        ],
        output_format='html5',
    )


def convert_markdown(text, md):
    """Reset parser state and convert markdown body to HTML."""
    md.reset()
    return md.convert(normalize_list_spacing(text))


def extract_footnote_defs(text):
    """Split markdown into body and footnote definitions (Python-Markdown `[^id]:`)."""
    if not text:
        return text, ''
    defs = [m.group(0).rstrip() for m in _FOOTNOTE_DEF_RE.finditer(text)]
    if not defs:
        return text, ''
    body = _FOOTNOTE_DEF_RE.sub('', text)
    body = re.sub(r'\n{3,}', '\n\n', body).rstrip() + '\n'
    return body, '\n\n'.join(defs)


def strip_footnote_block(html):
    """Remove the generated footnotes list so it can be kept on the last chunk only."""
    if not html:
        return html
    return _FOOTNOTE_BLOCK_RE.sub('', html).rstrip()
