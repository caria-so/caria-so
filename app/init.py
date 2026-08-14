import logging
import os
from flask import Flask, redirect, render_template, request
from werkzeug.middleware.proxy_fix import ProxyFix

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

INSECURE_SECRET = 'your-secret-key'


def _env_flag(name, default=False):
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in ('1', 'true', 'yes', 'on')


def create_app():
    app = Flask(__name__)

    secret_key = os.environ.get('SECRET_KEY', INSECURE_SECRET)
    is_production = os.environ.get('FLASK_ENV', '').lower() == 'production'

    if is_production and secret_key == INSECURE_SECRET:
        raise RuntimeError(
            'SECRET_KEY must be set to a unique value when FLASK_ENV=production.'
        )

    app.config['SECRET_KEY'] = secret_key
    app.config['CONTACT_EMAIL'] = os.environ.get('CONTACT_EMAIL', 'hello@caria.so')

    # Impossible Papers reads multi-MB fingerprint JSON on request. Off by
    # default so the site can run lean until those pages are wanted.
    app.config['ENABLE_PAPERS'] = _env_flag('ENABLE_PAPERS', default=False)

    if is_production:
        app.logger.setLevel(logging.INFO)
        # Render terminates TLS at its proxy and forwards the original scheme.
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

        @app.before_request
        def force_https():
            # Health checks reach the app without the header and must not be
            # redirected, so only act when the proxy reports plain HTTP.
            if request.headers.get('X-Forwarded-Proto') == 'http':
                return redirect(request.url.replace('http://', 'https://', 1), code=301)

        @app.after_request
        def hsts_header(response):
            response.headers.setdefault(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains',
            )
            return response

    from app.routes import blog_bp
    app.register_blueprint(blog_bp)

    from app.media import media_variants
    app.jinja_env.globals['media_variants'] = media_variants

    if app.config['ENABLE_PAPERS']:
        from app.papers_db import init_reviews_db
        init_reviews_db()

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.context_processor
    def inject_media_helpers():
        return {'media_variants': media_variants}

    @app.after_request
    def static_cache_headers(response):
        if request.path.startswith('/static/'):
            response.cache_control.max_age = 31536000
            response.cache_control.public = True
        return response

    return app
