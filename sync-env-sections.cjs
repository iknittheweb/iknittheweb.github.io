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
const fs = require('fs'); // Node.js file system module for reading/writing files
const path = require('path'); // Node.js path module for handling file paths
const glob = require('glob'); // Glob module for matching file patterns

// -------------------------------------------------------------
// 2. Find all template files (including index.template.html)
// -------------------------------------------------------------
const templateFiles = glob.sync(path.join(__dirname, 'src', 'templates', '*.template.html')); // Find all template files in src/templates

// -------------------------------------------------------------
// 3. Get all .env* files in the project root
// -------------------------------------------------------------
const envFiles = glob.sync(path.join(__dirname, '.env*')); // Find all .env* files in project root

// -------------------------------------------------------------
// 4. Extract page keys from template filenames
// -------------------------------------------------------------
function getPageKey(filename) {
  const base = path.basename(filename); // Get just the filename
  // Remove extension, replace dots with dashes (preserve case)
  return base.replace('.template.html', '').replace(/\./g, '-');
}

// -------------------------------------------------------------
// 5. Template for a new section
// -------------------------------------------------------------
function sectionTemplate(pageKey) {
  // Generate a human-readable page name from the key
  const readableName = pageKey.replace(/-/g, ' ').replace(/\b(\w)/g, (m) => m.toUpperCase());
  const pageFile = pageKey.toLowerCase().replace(/-/g, '.'); // e.g. ABOUT-PAGE -> about.page
  const htmlFile = pageFile + '.html'; // HTML filename
  const cssFile = pageFile + '.css'; // CSS filename
  // Set category based on page type
  const category = pageKey.includes('HOME') ? 'Portfolio' : pageKey.includes('CHALLENGE') ? 'Reference' : 'Tools';
  // Set nav config
  const navConfig = pageKey.includes('HOME') ? 'main,about,portfolio,contact' : pageKey.toLowerCase();
  // Default description and keywords
  const description = `Auto-generated section for ${readableName}. Customize this description for your page.`;
  const keywords = `${readableName}, web development, tutorial, accessibility`;
  // Open Graph and Twitter meta
  const ogTitle = `${readableName} | I Knit The Web`;
  const subtitle = `Visual Guide To ${readableName} | I Knit The Web`;
  const title = `${readableName} | I Knit The Web`;
  const twitterTitle = ogTitle;
  const ogDescription = description;
  const twitterDescription = description;
  // JSON-LD schema for SEO
  const schemaJson = `{"@context":"https://schema.org","@type":"WebPage","name":"${ogTitle}","description":"${description}","url":"/${htmlFile}"}`;
  // Return the section as a string
  return `\n# ${readableName}\n${pageKey}_BREADCRUMB_CATEGORY_URL=/${pageFile}\n${pageKey}_BREADCRUMB_CATEGORY=${category}\n${pageKey}_css_file=${cssFile}\n${pageKey}_description=${description}\n${pageKey}_keywords=${keywords}\n${pageKey}_data_nav_config=${navConfig}\n${pageKey}_description=${ogDescription}\n${pageKey}_og_title=${ogTitle}\n${pageKey}_page_url=/${htmlFile}\n${pageKey}_PAGE_NAME=${pageKey.toLowerCase()}\n${pageKey}_schema_json=${schemaJson}\n${pageKey}_SUBTITLE=${subtitle}\n${pageKey}_TITLE=${title}\n${pageKey}_TWITTER_description=${twitterDescription}\n${pageKey}_title=${twitterTitle}\n`;
}

// -------------------------------------------------------------
// 6. For each env file, ensure all sections exist
// -------------------------------------------------------------
// For each .env* file, ensure all page sections exist
for (const envPath of envFiles) {
  let envContent = fs.readFileSync(envPath, 'utf8'); // Read the env file
  let updated = false; // Track if we add anything
  for (const templatePath of templateFiles) {
    const pageKey = getPageKey(templatePath); // Get the page key for this template
    // Regex to check if section already exists
    const regex = new RegExp(`(^|\n)${pageKey}_BREADCRUMB_CATEGORY_URL=`, 'i');
    if (!regex.test(envContent)) {
      envContent += sectionTemplate(pageKey); // Add missing section
      updated = true;
    }
  }
  if (updated) {
    fs.writeFileSync(envPath, envContent, 'utf8'); // Write updated env file
    console.log(`Updated ${envPath} with missing page sections.`); // Log what was updated
  }
}
