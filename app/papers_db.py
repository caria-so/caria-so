"""
papers_db.py — review storage for Impossible Papers findings.

Drop this next to routes.py. Call init_reviews_db() on app startup.
Uses its own lightweight SQLite db (site.db), separate from IP's papers.db.
"""

import sqlite3
import hashlib
import os
from datetime import datetime, timedelta
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), 'site.db')


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_reviews_db():
    """Create tables if they don't exist. Call once on app startup."""
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                paper_slug  TEXT    NOT NULL,
                novelty     INTEGER NOT NULL CHECK (novelty BETWEEN 1 AND 7),
                rigor       INTEGER NOT NULL CHECK (rigor BETWEEN 1 AND 7),
                significance INTEGER NOT NULL CHECK (significance BETWEEN 1 AND 7),
                comment     TEXT,
                email       TEXT,
                affiliation TEXT,
                ip_hash     TEXT    NOT NULL,
                created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
            )
        """)
        db.execute("""
            CREATE INDEX IF NOT EXISTS idx_reviews_slug
            ON reviews(paper_slug)
        """)


def hash_ip(ip_address):
    """One-way hash — we never store raw IPs."""
    salt = "impossible-papers-review"
    return hashlib.sha256(f"{salt}:{ip_address}".encode()).hexdigest()[:16]


def can_review(paper_slug, ip_address):
    """Rate limit: one review per paper per IP per 24 hours."""
    h = hash_ip(ip_address)
    cutoff = (datetime.utcnow() - timedelta(hours=24)).isoformat()
    with get_db() as db:
        row = db.execute(
            "SELECT COUNT(*) as c FROM reviews "
            "WHERE paper_slug = ? AND ip_hash = ? AND created_at > ?",
            (paper_slug, h, cutoff)
        ).fetchone()
        return row['c'] == 0


def submit_review(paper_slug, novelty, rigor, significance,
                  comment, email, affiliation, ip_address):
    """Insert a review. Returns True on success, False if rate-limited."""
    if not can_review(paper_slug, ip_address):
        return False

    h = hash_ip(ip_address)
    with get_db() as db:
        db.execute(
            "INSERT INTO reviews "
            "(paper_slug, novelty, rigor, significance, comment, email, affiliation, ip_hash) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (paper_slug, novelty, rigor, significance,
             comment.strip() if comment else None,
             email.strip() if email else None,
             affiliation.strip() if affiliation else None,
             h)
        )
    return True


def get_paper_reviews(paper_slug):
    """All reviews for a paper, newest first."""
    with get_db() as db:
        rows = db.execute(
            "SELECT novelty, rigor, significance, comment, "
            "       affiliation, created_at "
            "FROM reviews WHERE paper_slug = ? "
            "ORDER BY created_at DESC",
            (paper_slug,)
        ).fetchall()
        return [dict(r) for r in rows]


def get_paper_ratings(paper_slug):
    """Aggregate ratings for a paper."""
    with get_db() as db:
        row = db.execute(
            "SELECT COUNT(*) as count, "
            "       AVG(novelty) as novelty, "
            "       AVG(rigor) as rigor, "
            "       AVG(significance) as significance "
            "FROM reviews WHERE paper_slug = ?",
            (paper_slug,)
        ).fetchone()

        if not row or row['count'] == 0:
            return {'count': 0, 'novelty': None, 'rigor': None, 'significance': None}

        return {
            'count': row['count'],
            'novelty': round(row['novelty'], 1),
            'rigor': round(row['rigor'], 1),
            'significance': round(row['significance'], 1),
        }


def get_all_ratings():
    """Aggregate ratings for all papers at once. Returns dict keyed by slug."""
    with get_db() as db:
        rows = db.execute(
            "SELECT paper_slug, COUNT(*) as count, "
            "       AVG(novelty) as novelty, "
            "       AVG(rigor) as rigor, "
            "       AVG(significance) as significance "
            "FROM reviews GROUP BY paper_slug"
        ).fetchall()

        return {
            r['paper_slug']: {
                'count': r['count'],
                'novelty': round(r['novelty'], 1),
                'rigor': round(r['rigor'], 1),
                'significance': round(r['significance'], 1),
            }
            for r in rows
        }