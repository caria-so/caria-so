import os
from app.init import create_app

app = create_app()

if __name__ == '__main__':
    # Flask debug reloader + spaCy/BLAS often abort on macOS (libblis).
    # Set FLASK_USE_RELOADER=1 to re-enable hot reload (may crash on file save).
    use_reloader = os.environ.get('FLASK_USE_RELOADER', '').lower() in ('1', 'true', 'yes')
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 8080)),
        debug=True,
        use_reloader=use_reloader,
    )
