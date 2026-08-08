import logging
import os
from flask import Flask, render_template

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

    from app.routes import blog_bp
    app.register_blueprint(blog_bp)

    if app.config['ENABLE_PAPERS']:
        from app.papers_db import init_reviews_db
        init_reviews_db()

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    return app
