#!/usr/bin/env bash
set -euo pipefail

# directory containing built HTML
DIST_DIR="dist"

# css input pattern (adjust if needed)
CSS_GLOB="${DIST_DIR}/css/*.css"

# content globs for html (adjust if your html lives elsewhere)
CONTENT_GLOBS="${DIST_DIR}/**/*.html"

# If there is no HTML in dist, skip purge to avoid purgecss help dump and errors.
if ! shopt -s nullglob && compgen -G "${DIST_DIR}/*.html" > /dev/null; then
  echo "No HTML files found under ${DIST_DIR}. Skipping purgecss."
  exit 0
fi

echo "Running purgecss on ${CSS_GLOB} with content ${CONTENT_GLOBS}"
# run purgecss via npx to ensure installed version is used
npx purgecss --css "${CSS_GLOB}" --content "${CONTENT_GLOBS}" --output "${DIST_DIR}/css"

# Optionally run a CSS minifier here (e.g. csso or clean-css)
# npx csso "${DIST_DIR}/css/styles.css" --output "${DIST_DIR}/css/styles.min.css"

echo "Purge and optional minify finished."
