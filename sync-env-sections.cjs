// =====================================================================
// Sync Env Sections Script (Beginner-Friendly)
// =====================================================================
// Purpose: Ensure every .env* file has a section for each page template.
// Usage: Run with: node sync-env-sections.cjs
// Key Concepts:
//   - Scan for template files
//   - Generate and insert missing env sections
//   - Automation for consistent environment config
// =====================================================================

// -------------------------------------------------------------
// 1. Import required modules
// -------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// -------------------------------------------------------------
// 2. Find all template files (including index.template.html)
// -------------------------------------------------------------
const templateFiles = glob.sync(path.join(__dirname, '*.template.html')).concat(glob.sync(path.join(__dirname, 'src', 'templates', '*.template.html')));

// -------------------------------------------------------------
// 3. Get all .env* files in the project root
// -------------------------------------------------------------
const envFiles = glob.sync(path.join(__dirname, '.env*'));

// -------------------------------------------------------------
// 4. Extract page keys from template filenames
// -------------------------------------------------------------
function getPageKey(filename) {
  const base = path.basename(filename);
  if (base === 'index.template.html') return 'HOME';
  return base.replace('.template.html', '').replace(/\./g, '-').toUpperCase();
}

// -------------------------------------------------------------
// 5. Template for a new section
// -------------------------------------------------------------
function sectionTemplate(pageKey) {
  // Generate readable page name
  const readableName = pageKey.replace(/-/g, ' ').replace(/\b(\w)/g, (m) => m.toUpperCase());
  const pageFile = pageKey.toLowerCase().replace(/-/g, '.');
  const htmlFile = pageFile + '.html';
  const cssFile = pageFile + '.css';
  const category = pageKey.includes('HOME') ? 'Portfolio' : pageKey.includes('CHALLENGE') ? 'Reference' : 'Tools';
  const navConfig = pageKey.includes('HOME') ? 'main,about,portfolio,contact' : pageKey.toLowerCase();
  const description = `Auto-generated section for ${readableName}. Customize this description for your page.`;
  const keywords = `${readableName}, web development, tutorial, accessibility`;
  const ogTitle = `${readableName} | I Knit The Web`;
  const subtitle = `Visual Guide To ${readableName} | I Knit The Web`;
  const title = `${readableName} | I Knit The Web`;
  const twitterTitle = ogTitle;
  const ogDescription = description;
  const twitterDescription = description;
  const schemaJson = `{"@context":"https://schema.org","@type":"WebPage","name":"${ogTitle}","description":"${description}","url":"/${htmlFile}"}`;
  return `\n# ${readableName}\n${pageKey}_BREADCRUMB_CATEGORY_URL=/${pageFile}\n${pageKey}_BREADCRUMB_CATEGORY=${category}\n${pageKey}_CSS_FILE=${cssFile}\n${pageKey}_DESCRIPTION=${description}\n${pageKey}_KEYWORDS=${keywords}\n${pageKey}_NAV_CONFIG=${navConfig}\n${pageKey}_OG_DESCRIPTION=${ogDescription}\n${pageKey}_OG_TITLE=${ogTitle}\n${pageKey}_OG_URL=/${htmlFile}\n${pageKey}_PAGE_NAME=${pageKey.toLowerCase()}\n${pageKey}_SCHEMA_JSON=${schemaJson}\n${pageKey}_SUBTITLE=${subtitle}\n${pageKey}_TITLE=${title}\n${pageKey}_TWITTER_DESCRIPTION=${twitterDescription}\n${pageKey}_TWITTER_TITLE=${twitterTitle}\n`;
}

// -------------------------------------------------------------
// 6. For each env file, ensure all sections exist
// -------------------------------------------------------------
for (const envPath of envFiles) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  let updated = false;
  for (const templatePath of templateFiles) {
    const pageKey = getPageKey(templatePath);
    const regex = new RegExp(`(^|\n)${pageKey}_BREADCRUMB_CATEGORY_URL=`, 'i');
    if (!regex.test(envContent)) {
      envContent += sectionTemplate(pageKey);
      updated = true;
    }
  }
  if (updated) {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`Updated ${envPath} with missing page sections.`);
  }
}
