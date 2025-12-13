// =====================================================================
// lint-staged.config.cjs (Beginner-Friendly)
// =====================================================================
// Purpose: Configure lint-staged to run code linters only on files staged for commit.
// Why: Prevent errors and enforce code style before changes are committed to git.
// Usage: Automatically used by lint-staged during git commit (no need to import).
// Key Concepts:
//   - Linting: Checks code for errors and style issues
//   - Staged files: Files you've marked for commit in git
//   - Automation: Runs checks automatically before each commit
// =====================================================================

// -------------------------------------------------------------
// 1. Define linting rules for staged files
// -------------------------------------------------------------
// For every CSS or SCSS file staged for commit, run stylelint to check for errors and style issues.
module.exports = {
  // Lint and fix JS files
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  // Lint CSS and SCSS files
  '*.{css,scss}': ['stylelint --fix'],
  // Format HTML, CSS, JS, JSON, and Markdown with Prettier
  '*.{js,jsx,ts,tsx,css,scss,html,json,md}': ['prettier --write'],
};
