// =====================================================================
// update-placeholder-guide.cjs (Beginner-Friendly)
// =====================================================================
// Purpose: Scan new-page.template.html for placeholders and update line numbers in new-page-placeholder-replacement-guide.txt
// Usage: Run with: node docs/update-placeholder-guide.cjs
// Key Concepts:
//   - Regex for placeholder detection
//   - File reading/writing
//   - Markdown guide generation
// =====================================================================

// -------------------------------------------------------------
// 1. Import required modules
// -------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// -------------------------------------------------------------
// 2. Define paths and regex
// -------------------------------------------------------------
const guidePath = path.join(__dirname, 'new-page-placeholder-replacement-guide.txt');
const templateFiles = glob.sync(path.join(__dirname, '../src/templates/*.template.html'));
const placeholderRegex = /\{\{([A-Z0-9_\-]+)\}\}/g;

// -------------------------------------------------------------
// 3. Collect all placeholders from all templates (for future use)
// -------------------------------------------------------------
const allPlaceholders = {};
templateFiles.forEach((templatePath) => {
  const lines = fs.readFileSync(templatePath, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    let match;
    while ((match = placeholderRegex.exec(line)) !== null) {
      allPlaceholders[match[1]] = { line: idx + 1, file: path.basename(templatePath) };
    }
  });
});

// -------------------------------------------------------------
// 4. Collect all occurrences of placeholders from new-page.template.html
// -------------------------------------------------------------
const newPagePath = path.join(__dirname, '../src/templates/new-page.template.html');
const newPageLines = fs.readFileSync(newPagePath, 'utf8').split(/\r?\n/);
const newPagePlaceholders = {};
newPageLines.forEach((line, idx) => {
  const matches = [...line.matchAll(/\{\{([A-Z0-9_\-]+)\}\}/g)];
  matches.forEach((match) => {
    const name = match[1];
    if (!newPagePlaceholders[name]) {
      newPagePlaceholders[name] = [];
    }
    newPagePlaceholders[name].push(idx + 1);
  });
});

// -------------------------------------------------------------
// 5. Build guide content: list all occurrences of each placeholder
// -------------------------------------------------------------
let guide = '^ PLACEHOLDERS FOR *.TEMPLATE.HTML FILES\n\n';
Object.entries(newPagePlaceholders).forEach(([name, lineNums]) => {
  lineNums.forEach((lineNum) => {
    guide += `- line ${lineNum}: {{${name}}}\n`;
  });
});

// -------------------------------------------------------------
// 6. Write guide to file
// -------------------------------------------------------------
fs.writeFileSync(guidePath, guide, 'utf8');
console.log('Placeholder guide updated to match new-page.template.html placeholders only, with file links.');
