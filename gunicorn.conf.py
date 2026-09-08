"""Gunicorn settings for Render.

Sized for a 512 MB instance. The app serves cached-in-memory markdown and
JSON, so workers are CPU-light but each holds its own copy of parsed content.
"""

import os

bind = f"0.0.0.0:{os.environ.get('PORT', '10000')}"

# Each worker sits around 60 MB with ENABLE_PAPERS off, ~170 MB with it on.
workers = int(os.environ.get('WEB_CONCURRENCY', '2'))
threads = int(os.environ.get('GUNICORN_THREADS', '4'))
worker_class = 'gthread'

# Fingerprint JSON parsing can take several seconds when papers are enabled.
timeout = int(os.environ.get('GUNICORN_TIMEOUT', '60'))
graceful_timeout = 30
keepalive = 5

# Load the app before forking so workers share the parsed templates/data pages.
preload_app = True

max_requests = 1000
max_requests_jitter = 100

accesslog = '-'
errorlog = '-'
loglevel = os.environ.get('GUNICORN_LOG_LEVEL', 'info')
