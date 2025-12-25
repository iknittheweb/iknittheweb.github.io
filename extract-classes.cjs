// extract-classes.cjs
// Scans all HTML and SCSS files, outputs a table of classes, usage locations, and SCSS partials to class-usage.md
// Usage: node extract-classes.cjs

const fs = require('fs');
const path = require('path');

// Recursively get all files matching extensions
function getAllFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, exts, fileList);
    } else if (exts.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Extract class names from HTML file content
function extractClassesFromHTML(content) {
  const classRegex = /class\s*=\s*(["'])(.*?)\1/gs;
  const classes = new Set();
  let match;
  while ((match = classRegex.exec(content))) {
    match[2].split(/\s+/).forEach((cls) => {
      if (cls) classes.add(cls);
    });
  }
  return Array.from(classes);
}

// Extract class selectors from SCSS file content
function extractClassesFromSCSS(content) {
  // Match .className, .class-name, .class_name, but not ... or @mixin, @include, etc.
  const classRegex = /\.(?![0-9])([a-zA-Z0-9_-]+)/g;
  const classes = new Set();
  let match;
  while ((match = classRegex.exec(content))) {
    classes.add(match[1]);
  }
  return Array.from(classes);
}

// Main logic
const rootDir = process.cwd();
const scssExts = ['.scss'];

// Only match *.template.html files
function getTemplateHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getTemplateHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.template.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = getTemplateHtmlFiles(rootDir);
const scssFiles = getAllFiles(rootDir, scssExts);

// Map: className -> { html: Set(files), scss: Set(files) }
const classUsage = {};

// Scan HTML files
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const classes = extractClassesFromHTML(content);
  for (const cls of classes) {
    if (!classUsage[cls]) classUsage[cls] = { html: new Set(), scss: new Set() };
    classUsage[cls].html.add(path.relative(rootDir, file));
  }
}

// Scan SCSS files
for (const file of scssFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const classes = extractClassesFromSCSS(content);
  for (const cls of classes) {
    if (!classUsage[cls]) classUsage[cls] = { html: new Set(), scss: new Set() };
    classUsage[cls].scss.add(path.relative(rootDir, file));
  }
}

// Output markdown table
const outFile = path.join(rootDir, 'class-usage.md');
// Sort classes in original case (not upper/lowercased)
const allClasses = Object.keys(classUsage).sort((a, b) => a.localeCompare(b));

let md = '# CSS Class Usage Report\n\n';
md += '| Class | HTML Files | SCSS Partials |\n';
md += '|-------|------------|---------------|\n';

function getShortScssPath(scssPath) {
  // Normalize path separators
  const rel = scssPath.replace(/\\/g, '/');
  // Remove src/scss/ if present
  const match = rel.match(/(?:src\/scss\/)?([^/]+\/[^/]+\.scss)$/);
  return match ? match[1] : path.basename(scssPath);
}

for (const cls of allClasses) {
  // Only output the filename for *.template.html files
  const htmlList = Array.from(classUsage[cls].html)
    .map((f) => path.basename(f))
    .join('<br>');
  // Output shortened path for SCSS files
  const scssList = Array.from(classUsage[cls].scss).map(getShortScssPath).join('<br>');
  md += `| .${cls} | ${htmlList || ''} | ${scssList || ''} |\n`;
}

fs.writeFileSync(outFile, md, 'utf8');
console.log(`Class usage table written to ${outFile}`);
