// =====================================================================
// Source Map Inspector Script (Beginner-Friendly)
// =====================================================================
// Purpose: Inspects a CSS/JS source map file and prints a summary for debugging.
// Features:
//   - Reads and parses a source map JSON file
//   - Prints summary info: sourceRoot, sources count, sourcesContent presence
//   - Shows first source and preview of sourcesContent
// Usage:
//   - Run with: node inspect-map.js path/to/styles.css.map
// Key Concepts:
//   - Source maps
//   - Debugging build output
//   - JSON parsing
// =====================================================================
// =============================================================
// STEP 0: Import required Node.js modules
// =============================================================
const fs = require('fs');
const path = require('path');

// =============================================================
// STEP 1: Get the source map file path from command line arguments
// -------------------------------------------------------------
const p = process.argv[2];
if (!p) {
  console.error('Usage: node inspect-map.js path/to/styles.css.map');
  process.exit(2);
}

// =============================================================
// STEP 2: Resolve and check the file exists
// -------------------------------------------------------------
const full = path.resolve(p);
if (!fs.existsSync(full)) {
  console.error('File not found:', full);
  process.exit(3);
}

// =============================================================
// STEP 3: Read, parse, and summarize the source map
// -------------------------------------------------------------
try {
  const m = JSON.parse(fs.readFileSync(full, 'utf8'));
  // Build a summary object for easy debugging
  const summary = {
    sourceRoot: m.sourceRoot === '' ? '(empty string)' : m.sourceRoot,
    sourcesCount: (m.sources || []).length,
    hasSourcesContent: !!m.sourcesContent,
    sourcesWithDotDot: (m.sources || []).filter((s) => s.startsWith('../') || s.includes('/../')).slice(0, 20),
  };
  // Print summary info
  console.log(JSON.stringify(summary, null, 2));
  console.log('');
  // Show first source file
  console.log('example source[0]:', (m.sources || [])[0] || '(none)');
  // Show preview of sourcesContent if present
  if (m.sourcesContent && m.sourcesContent.length > 0) {
    console.log('');
    console.log('sourcesContent length =', m.sourcesContent.length);
    console.log('first 200 chars of sourcesContent[0]:');
    console.log('--------------------------------------------------');
    console.log(m.sourcesContent[0].slice(0, 200));
    console.log('--------------------------------------------------');
  } else {
    console.log('no sourcesContent present in this map.');
  }
} catch (err) {
  console.error('Error reading/parsing map:', err.message);
  process.exit(4);
}
