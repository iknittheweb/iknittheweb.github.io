#!/usr/bin/env bash
# =====================================================================
# format-html.sh
# =====================================================================
# This script formats all HTML files in the build output directory using Prettier.
# BEGINNER-FRIENDLY: Each section is commented for clarity.

set -euo pipefail

# =====================================================================
# 1. SETUP: Enable globbing and set build directory
# =====================================================================
# Enable ** globbing and nullglob so non-matching globs expand to nothing
shopt -s globstar nullglob

# Change this to your build output directory if not 'dist'
DIST_DIR="dist"

# =====================================================================
# 2. GATHER HTML FILES
# =====================================================================
files=( "$DIST_DIR"/**/*.html )

# =====================================================================
# 3. EXIT IF NO FILES
# =====================================================================
if [ ${#files[@]} -eq 0 ]; then
  echo "No HTML files to format in ${DIST_DIR}. Skipping prettier."
  exit 0
fi

# =====================================================================
# 4. FORMAT FILES WITH PRETTIER
# =====================================================================
echo "Formatting ${#files[@]} HTML file(s)..."
# Use npx so CI uses project-installed prettier
npx prettier --write "${files[@]}"