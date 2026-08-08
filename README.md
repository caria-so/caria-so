# caria.so

Personal site — Flask, server-rendered, content from markdown and JSON on disk.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env      # then fill in the SMTP values
python run.py             # http://127.0.0.1:8080
```

Optional named-entity extraction for the notes/archive pages:

```bash
pip install -r requirements-nlp.txt
python -m spacy download en_core_web_sm
```

Without the model the code falls back to token matching, so this is safe to skip.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `SECRET_KEY` | in production | `your-secret-key` | Flask session signing. Startup **fails** if left at the default when `FLASK_ENV=production`. |
| `FLASK_ENV` | no | — | Set to `production` to disable debug and enforce the secret check. |
| `CONTACT_EMAIL` | no | `hello@caria.so` | Where contact form submissions are delivered. |
| `MAIL_FROM` | no | falls back to `SMTP_USER` | From address on outgoing mail. |
| `SMTP_HOST` | for the contact form | — | SMTP server hostname. |
| `SMTP_PORT` | no | `587` | SMTP port. |
| `SMTP_USER` | for the contact form | — | SMTP username. |
| `SMTP_PASSWORD` | for the contact form | — | SMTP password or API key. |
| `SMTP_USE_TLS` | no | `true` | STARTTLS toggle. |
| `ENABLE_PAPERS` | no | `false` | Enables the Impossible Papers pages (`/papers`, `/regime-diversity`). |
| `WEB_CONCURRENCY` | no | `2` | Gunicorn worker count. |

Without SMTP configured the contact form shows a clear error rather than
silently reporting success.

## Deploying to Render

The repo includes `render.yaml`, so Render can provision it as a Blueprint.

1. In Render, choose **New → Blueprint** and point it at this repository.
2. Render reads `render.yaml` and creates the web service. `SECRET_KEY` is
   generated automatically.
3. Set the four SMTP variables in the dashboard — they are marked
   `sync: false` so they never live in git.
4. Deploy. Health check is `GET /`.

Build and start commands, if you configure the service manually instead:

```
Build:  pip install -r requirements.txt
Start:  gunicorn -c gunicorn.conf.py run:app
```

### Notes on the free tier

- Each worker uses roughly 60 MB with `ENABLE_PAPERS=false`, and about
  170 MB with it enabled, because the fingerprint JSON is parsed per request.
  Two workers fit comfortably in 512 MB; drop `WEB_CONCURRENCY` to `1` if you
  enable papers.
- The filesystem is ephemeral. `app/site.db` stores Impossible Papers reviews
  and is recreated empty on each deploy, so attach a persistent disk before
  relying on review data.
- Free instances sleep when idle and take a few seconds to wake.

## Impossible Papers

`/impossible-papers` is a static overview page and is always available. The
data-driven pages that read `app/data/fingerprints/` are gated behind
`ENABLE_PAPERS` and return 404 while it is off.
