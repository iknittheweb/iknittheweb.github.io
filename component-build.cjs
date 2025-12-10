// =====================================================================
// Component Build Script (Beginner-Friendly)
// =====================================================================
// Purpose: Generates HTML pages from templates, injects shared components, and copies assets for deployment.
// Features:
//   - Processes all .template.html files in src/templates/
//   - Injects header and footer from index.html
//   - Replaces environment variable placeholders (e.g., {{BASE_URL}}, {{ASSET_URL}})
//   - Copies JS and image assets to dist/
// Usage:
//   - Run with npm scripts for local, alternate, or production builds
// Key Concepts:
//   - Template processing
//   - Component injection
//   - Asset management
// =====================================================================

// =============================================================
// STEP 0: Import required Node.js modules and register helpers
// =============================================================
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
// Register 'eq' helper for conditional logic in templates
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// =============================================================
// STEP 1: Determine which .env file to use (matches build.cjs logic)
// -------------------------------------------------------------
const mode = process.argv[2] ? process.argv[2].toLowerCase() : '';
let dotenvPath = '.env';
if (process.env.DOTENV_CONFIG_PATH) {
  dotenvPath = process.env.DOTENV_CONFIG_PATH;
} else if (mode === 'alt') {
  dotenvPath = '.env.alt';
} else if (mode === 'netlify-alt') {
  dotenvPath = '.env.netlify-alt';
} else if (mode === 'prod' || mode === 'production') {
  dotenvPath = '.env.production';
}
console.log(`[component-build.cjs] Using dotenv path: ${dotenvPath}`);
require('dotenv').config({ path: dotenvPath });
console.log(`[component-build.cjs] BASE_URL: ${process.env.BASE_URL}`);

// =============================================================
// STEP 2: Process all .template.html files in src/templates/
// -------------------------------------------------------------
// This step compiles templates, injects header/footer, and replaces env placeholders.
const srcDir = path.join(__dirname, 'src', 'templates');
const outDir = __dirname;
const indexTemplatePath = path.join(srcDir, 'index.template.html');
const indexHtmlPath = path.join(__dirname, 'index.html');

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const headerMatch = indexHtml.match(/<header[\s\S]*?<\/header>/i);
const footerMatch = indexHtml.match(/<footer[\s\S]*?<\/footer>/i);
const header = headerMatch ? headerMatch[0] : '';
const footer = footerMatch ? footerMatch[0] : '';

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith('.template.html')) {
    const templatePath = path.join(srcDir, file);
    const templateSrc = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSrc);

    // Build context: env vars + page-specific defaults
    const pageSpecific = {
      TITLE: 'Untitled Page',
      DESCRIPTION: 'No description provided. Please update before deploying.',
      KEYWORDS: 'web, page, update keywords',
      OG_IMAGE: '/src/img/pages/default-og-image.png',
      PAGE_NAME: file.replace('.template.html', ''),
    };
    const context = Object.assign({}, pageSpecific, process.env);

    let html = template(context);

    // Remove template warning and workflow comments from the output
    html = html.replace(/<!--\s*IMPORTANT: This is a TEMPLATE file![\s\S]*?DO NOT edit the generated \*\.html file directly[\s\S]*?-->/g, '');
    html = html.replace(/<!--\s*-{2,}\s*BEGINNER-FRIENDLY EXPLANATORY COMMENTS[\s\S]*?-{2,}\s*-->/g, '');

    // Inject header and footer
    html = html.replace(/<!--\s*HEADER_PLACEHOLDER\s*-->/i, header);
    html = html.replace(/<!--\s*FOOTER_PLACEHOLDER\s*-->/i, footer);

    // Warn if unreplaced placeholders remain
    const unreplaced = html.match(/{{[A-Z0-9_]+}}/g);
    if (unreplaced && unreplaced.length > 0) {
      console.warn(`⚠️ Unreplaced placeholders found in ${file.replace('.template.html', '.html')}:`, unreplaced);
    }

    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
    const outFile = path.join(distDir, file.replace('.template.html', '.html'));
    fs.writeFileSync(outFile, html);
    console.log(`Generated: ${outFile}`);
  }
});
// =============================================================
// STEP 3: Copy JavaScript files to dist/js
// -------------------------------------------------------------
// This step copies all JS files from src/js to dist/js for deployment.
const jsSrcDir = path.join(__dirname, 'src', 'js');
const jsDistDir = path.join(__dirname, 'dist', 'js');
if (!fs.existsSync(jsDistDir)) fs.mkdirSync(jsDistDir, { recursive: true });
fs.readdirSync(jsSrcDir).forEach((file) => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(path.join(jsSrcDir, file), path.join(jsDistDir, file));
    console.log(`Copied JS: ${file} to dist/js/`);
  }
});

// =============================================================
// STEP 4: Copy image files to dist/img
// -------------------------------------------------------------
// This step copies all image files from src/img to dist/img for deployment.
const imgSrcDir = path.join(__dirname, 'src', 'img');
const imgDistDir = path.join(__dirname, 'dist', 'img');
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied IMG: ${srcPath} to ${destPath}`);
    }
  });
}
copyDirRecursive(imgSrcDir, imgDistDir);
