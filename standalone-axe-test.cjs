// =====================================================================
// Standalone Axe Accessibility Test Script (Beginner-Friendly)
// =====================================================================
// Purpose: Run axe-core accessibility checks on a static HTML file using jsdom.
// Usage: Run with: node standalone-axe-test.cjs
// Key Concepts:
//   - jsdom: Simulates a browser environment in Node.js
//   - axe-core: Automated accessibility testing tool
//   - Reporting accessibility violations in the console
// =====================================================================

// -------------------------------------------------------------
// 1. Import required modules
// -------------------------------------------------------------
const fs = require('fs');
const { JSDOM } = require('jsdom');

// -------------------------------------------------------------
// 2. Load the HTML file to test
// -------------------------------------------------------------
const html = fs.readFileSync('dist/pages/minimal-accessibility-test.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

// -------------------------------------------------------------
// 3. Inject axe-core into the jsdom window
// -------------------------------------------------------------
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
dom.window.eval(axeSource);

// -------------------------------------------------------------
// 4. Run axe-core accessibility checks after DOM loads
// -------------------------------------------------------------
dom.window.addEventListener('load', () => {
  dom.window.axe
    .run(dom.window.document)
    .then((results) => {
      if (results.violations.length > 0) {
        console.log('Accessibility violations:');
        results.violations.forEach((v) => {
          console.log(`- [${v.id}] ${v.help}`);
          console.log(`  Description: ${v.description}`);
          console.log(`  Impact: ${v.impact}`);
          v.nodes.forEach((node) => {
            console.log(`    Element: ${node.target.join(', ')}`);
            console.log(`    Failure Summary: ${node.failureSummary}`);
          });
        });
      } else {
        console.log('No accessibility violations found.');
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('Axe-core error:', err);
      process.exit(1);
    });
});
