import os
from flask import Flask, render_template


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')

    from app.routes import blog_bp
    app.register_blueprint(blog_bp)

    from app.papers_db import init_reviews_db
    init_reviews_db()

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    return app
