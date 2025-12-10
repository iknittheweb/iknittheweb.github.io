// -------------------------------------------------------------
// Babel Configuration
// -------------------------------------------------------------
// Purpose: Configures Babel to transpile modern JavaScript for compatibility.
// Features:
//   - Uses @babel/preset-env for smart polyfilling and syntax conversion
//   - Targets current Node.js version for server-side scripts
// Usage:
//   - Used in build tools and scripts to ensure code runs everywhere
// Key Concepts:
//   - Babel presets
//   - JavaScript compatibility
//   - Transpilation
// -------------------------------------------------------------
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
