#!/usr/bin/env bash
# patch-sober.sh — caria.so: IBM Plex Sans, sober palette, no glow.
# Usage:  bash scripts/patch-sober.sh app/static/css

set -u
CSS="${1:-app/static/css}"
S="$CSS/styles.css"
P="$CSS/pages.css"
miss=0

cp "$S" "$S.bak" && cp "$P" "$P.bak"

sed_inplace() {
  local file=$1
  local expr=$2
  if sed --version 2>/dev/null | grep -q GNU; then
    sed -i "$expr" "$file"
  else
    sed -i '' "$expr" "$file"
  fi
}

sub() {
  if grep -qF -- "$2" "$1"; then
    sed_inplace "$1" "$3"
  else
    echo "MISS  $(basename "$1"): $2"
    miss=$((miss + 1))
  fi
}

sub "$S" "family=Host+Grotesk" \
  "/family=Host+Grotesk/c\\
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&family=IBM+Plex+Mono:wght@400;500&display=swap');"

sub "$S" '--font-sans: "Host Grotesk", system-ui, sans-serif;' \
  's|--font-sans: "Host Grotesk", system-ui, sans-serif;|--font-sans: "IBM Plex Sans", system-ui, sans-serif;|'

if ! grep -q -- '--font-body:' "$S"; then
  sed_inplace "$S" '/--font-sans: "IBM Plex Sans", system-ui, sans-serif;/a\
  --font-body: var(--font-sans); /* set to var(--font-serif) to bring the serif back */'
fi

sub "$S" '--font-mono: "Geist Mono", ui-monospace, monospace;' \
  's|--font-mono: "Geist Mono", ui-monospace, monospace;|--font-mono: "IBM Plex Mono", ui-monospace, monospace;|'

sub "$S" 'font-family: var(--font-serif);' \
  's|font-family: var(--font-serif);|font-family: var(--font-body);|'

sub "$S" '.txt-xbold { font-weight: 900; }' \
  's|.txt-xbold { font-weight: 900; }|.txt-xbold { font-weight: 700; }|'

sub "$S" '--t-display: clamp(2.25rem, 5.5vw, 3rem);' \
  's|--t-display: clamp(2.25rem, 5.5vw, 3rem);|--t-display: clamp(2.5rem, 5vw, 3.75rem);|'
sub "$S" '--t-title:   clamp(1.5rem, 3vw, 2rem);' \
  's|--t-title:   clamp(1.5rem, 3vw, 2rem);|--t-title:   clamp(1.75rem, 3vw, 2.5rem);|'

sub "$S" '--c-accent: #D33F49;' \
  's|--c-accent: #D33F49;|--c-accent: #9A2B32;|'
sub "$S" '--c-accent-dark: #B02C35;' \
  's|--c-accent-dark: #B02C35;|--c-accent-dark: #7A2227;|'
sub "$S" '--c-accent-light: #F8D9DB;' \
  's|--c-accent-light: #F8D9DB;|--c-accent-light: #F3E3E4;|'
sub "$S" '--c-link: #2D68C4;' \
  's|--c-link: #2D68C4;|--c-link: #9A2B32;|'
sub "$S" '--c-link-hover: #1E4C9A;' \
  's|--c-link-hover: #1E4C9A;|--c-link-hover: #111214;|'
sub "$S" '--c-background: var(--c-gray-100);' \
  's|--c-background: var(--c-gray-100);|--c-background: #FFFFFF;|'
sub "$S" '--c-background-gray: var(--c-gray-200);' \
  's|--c-background-gray: var(--c-gray-200);|--c-background-gray: #EEF0F2;|'
sub "$S" '--c-border: var(--c-gray-300);' \
  's|--c-border: var(--c-gray-300);|--c-border: #D9DCE0;|'
sub "$S" '--c-text-primary: var(--c-gray-900);' \
  's|--c-text-primary: var(--c-gray-900);|--c-text-primary: #111214;|'
sub "$S" '--c-text-subtitle: #3F3F46;' \
  's|--c-text-subtitle: #3F3F46;|--c-text-subtitle: #34373C;|'
sub "$S" '--c-text-body: var(--c-gray-700);' \
  's|--c-text-body: var(--c-gray-700);|--c-text-body: #34373C;|'
sub "$S" '--c-text-secondary: var(--c-gray-600);' \
  's|--c-text-secondary: var(--c-gray-600);|--c-text-secondary: #5A5D63;|'
sub "$S" '--c-text-tertiary: var(--c-gray-400);' \
  's|--c-text-tertiary: var(--c-gray-400);|--c-text-tertiary: #5A5D63;|'
sub "$S" '--c-input-focus: rgba(211, 63, 73, 0.2);' \
  's|--c-input-focus: rgba(211, 63, 73, 0.2);|--c-input-focus: rgba(154, 43, 50, 0.2);|'
sub "$S" '--card-shadow:' \
  's|--card-shadow: [^;]*;|--card-shadow: none;|g'

sub "$S" '--c-accent: #E75864;' \
  's|--c-accent: #E75864;|--c-accent: #E8A3A8;|'
sub "$S" '--c-accent-dark: #D33F49;' \
  's|--c-accent-dark: #D33F49;|--c-accent-dark: #F0B9BD;|'
sub "$S" '--c-link: #4D90F0;' \
  's|--c-link: #4D90F0;|--c-link: #E8A3A8;|'
sub "$S" '--c-link-hover: #6BA2F7;' \
  's|--c-link-hover: #6BA2F7;|--c-link-hover: #FFFFFF;|'

sub "$P" '"Geist Mono", monospace' \
  's|"Geist Mono", monospace|var(--font-mono)|g'

if ! grep -q 'SOBER OVERRIDES (patch-sober.sh)' "$S"; then
cat >> "$S" <<'EOF'

/* ── SOBER OVERRIDES (patch-sober.sh) ─────────────────────── */
.btn.btn-primary:hover { background-color: var(--c-accent); color: #FFF; }
.btn.btn-secondary:hover { background-color: var(--c-text-primary); color: var(--c-background); }
/* ── /SOBER OVERRIDES ─────────────────────────────────────── */
EOF
fi

if ! grep -q 'SOBER OVERRIDES (patch-sober.sh)' "$P"; then
cat >> "$P" <<'EOF'

/* ── SOBER OVERRIDES (patch-sober.sh) ─────────────────────── */
.idx-section--services, .rx-ip,
.idx-section--projects, .idx-section--stack,
.idx-section--blog, .rx-blog,
.idx-section--arc, .rx-arc { background: var(--c-background); }
[class*="lr-pattern-"]::before { display: none; }
.rx-contact-inner { border-radius: 0; border: 0; background: var(--c-background-gray); }
.rx-contact-inner h2 { font-weight: 600; }
/* ── /SOBER OVERRIDES ─────────────────────────────────────── */
EOF
fi

echo "done — $miss pattern(s) missed. Backups: $S.bak $P.bak"
echo "revert: mv $S.bak $S && mv $P.bak $P"
