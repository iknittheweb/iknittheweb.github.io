// =====================================================================
// CSS Purge and Minify Script (Beginner-Friendly)
// =====================================================================
// Purpose: Remove unused CSS selectors and minify CSS files for deployment.
// Usage: Run with: node purge-and-minify.cjs
// Key Concepts:
//   - PurgeCSS: Removes unused CSS selectors based on HTML content
//   - Minification: Shrinks CSS for faster loading
//   - Automation: Processes all CSS files in dist/css
// =====================================================================

// -------------------------------------------------------------
// 1. Import required modules
// -------------------------------------------------------------
const fs = require('fs'); // For reading and writing files and folders
const path = require('path'); // For building file and folder paths
const { PurgeCSS } = require('purgecss'); // Use PurgeCSS Node API
const postcss = require('postcss');
const cssnano = require('cssnano');

// -------------------------------------------------------------
// 2. Set up CSS directory and ensure it exists
// -------------------------------------------------------------
const cssDir = path.join(__dirname, 'dist', 'css');
fs.mkdirSync(cssDir, { recursive: true });

// -------------------------------------------------------------
// 3. Purge and minify a single CSS file
// -------------------------------------------------------------
async function purgeAndReplace(file) {
  // Get base name for matching HTML files
  let base = file.endsWith('.min.css') ? path.basename(file, '.min.css') : path.basename(file, '.css');
  let htmlFiles;
  if (base === 'styles') {
    htmlFiles = [path.join(__dirname, 'index.html')];
  } else {
    const allFiles = fs.readdirSync(__dirname);
    htmlFiles = allFiles.filter((f) => f.startsWith(base + '.') && f.endsWith('.html')).map((f) => path.join(__dirname, f));
  }
  const allExist = htmlFiles.every((f) => fs.existsSync(f));
  if (allExist) {
    // Load PurgeCSS config
    const purgecssConfig = require(path.join(__dirname, 'purgecss.config.js'));
    // Read CSS file
    const css = fs.readFileSync(file, 'utf8');
    // Run PurgeCSS Node API
    const purgeCSSResult = await new PurgeCSS().purge({
      ...purgecssConfig,
      content: htmlFiles,
      css: [{ raw: css }],
    });
    if (purgeCSSResult && purgeCSSResult[0] && purgeCSSResult[0].css) {
      // Write purged CSS to filename.purged.css
      const purgedFile = file.replace(/\.css$/, '.purged.css');
      fs.writeFileSync(purgedFile, purgeCSSResult[0].css);
      // Minify after purging
      const minified = await postcss([cssnano]).process(purgeCSSResult[0].css, { from: purgedFile });
      const minFile = file.replace(/\.css$/, '.min.css');
      fs.writeFileSync(minFile, minified.css);
    } else {
      console.warn(`PurgeCSS did not produce expected output for ${file}.`);
    }
  } else {
    console.warn(`Skipping ${file}: No matching HTML file(s) (${htmlFiles.join(', ')}) found.`);
  }
}

// -------------------------------------------------------------
// 4. Main process: loop through all CSS files and purge/minify
// -------------------------------------------------------------
async function run() {
  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    for (const file of files) {
      // Only process .css files, skip .min.css and purged-*.css
      if (file.endsWith('.css') && !file.endsWith('.min.css') && !file.startsWith('purged-')) {
        await purgeAndReplace(path.join(cssDir, file));
      }
    }
  } else {
    console.warn('Warning: dist/css directory does not exist. Skipping CSS purging.');
  }
}

// -------------------------------------------------------------
// 5. Run the main process
// -------------------------------------------------------------
run();
