import os
from app.init import create_app

app = create_app()

if __name__ == '__main__':
    # Flask debug reloader + spaCy/BLAS often abort on macOS (libblis).
    # Set FLASK_USE_RELOADER=1 to re-enable hot reload (may crash on file save).
    debug = os.environ.get('FLASK_ENV', '').lower() != 'production'
    # Reload Python when routes change (disable with FLASK_USE_RELOADER=0 if macOS BLAS crashes).
    reloader_env = os.environ.get('FLASK_USE_RELOADER')
    if reloader_env is not None:
        use_reloader = reloader_env.lower() in ('1', 'true', 'yes')
    else:
        use_reloader = debug

    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 8080)),
        debug=debug,
        use_reloader=use_reloader,
    )
