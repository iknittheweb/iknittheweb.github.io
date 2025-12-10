#!/usr/bin/env bash
set -euo pipefail

# =====================================================================
# CSS Purge and Minify Script (Beginner-Friendly)
# =====================================================================
# Purpose: Remove unused CSS selectors and optionally minify CSS files for deployment.
# Usage: Run with: bash purge-and-minify.sh
# Key Concepts:
#   - PurgeCSS: Removes unused CSS selectors based on HTML content
#   - Minification: Shrinks CSS for faster loading (optional)
#   - Automation: Processes all CSS files in dist/css
# =====================================================================

# -------------------------------------------------------------
# 1. Set up directory and file patterns
# -------------------------------------------------------------
DIST_DIR="dist" # directory containing built HTML and CSS
CSS_GLOB="${DIST_DIR}/css/*.css" # pattern for CSS files to purge
CONTENT_GLOBS="${DIST_DIR}/**/*.html" # pattern for HTML files to scan

# -------------------------------------------------------------
# 2. Check for HTML files before running purgecss
# -------------------------------------------------------------
if ! shopt -s nullglob && compgen -G "${DIST_DIR}/*.html" > /dev/null; then
  echo "No HTML files found under ${DIST_DIR}. Skipping purgecss."
  exit 0
fi

# -------------------------------------------------------------
# 3. Run PurgeCSS to remove unused selectors
# -------------------------------------------------------------
echo "Running purgecss on ${CSS_GLOB} with content ${CONTENT_GLOBS}"
npx purgecss --css "${CSS_GLOB}" --content "${CONTENT_GLOBS}" --output "${DIST_DIR}/css"

# -------------------------------------------------------------
# 4. (Optional) Minify CSS files after purging
# -------------------------------------------------------------
# Uncomment the next line to minify CSS using csso or another tool
# npx csso "${DIST_DIR}/css/styles.css" --output "${DIST_DIR}/css/styles.min.css"

echo "Purge and optional minify finished."
