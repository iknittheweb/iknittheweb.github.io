// =====================================================================
// Cypress Configuration (Beginner-Friendly)
// =====================================================================
// Purpose: Configures Cypress for end-to-end testing of your project.
// Features:
//   - Sets up project ID for Cypress Dashboard
//   - Defines base URL for local testing
//   - Specifies support and spec files for test organization
// Usage:
//   - Used by Cypress CLI and Dashboard for running and managing tests
// Key Concepts:
//   - End-to-end testing
//   - Test organization
//   - Project configuration
// =====================================================================
const { defineConfig } = require('cypress');

// -------------------------------------------------------------
// Main Cypress configuration object
// -------------------------------------------------------------
module.exports = defineConfig({
  projectId: 'xrecd4', // Unique ID for Cypress Dashboard
  e2e: {
    // ---------------------------------------------------------
    // Node event setup (for plugins, etc.)
    // ---------------------------------------------------------
    setupNodeEvents(on, config) {
      // Percy does not require plugin setup here
      return config;
    },
    // ---------------------------------------------------------
    // Base URL for local testing
    // ---------------------------------------------------------
    baseUrl: 'http://localhost:5500', // Adjust if needed
    // ---------------------------------------------------------
    // Support file for custom commands and setup
    // ---------------------------------------------------------
    supportFile: 'cypress/support/e2e.js',
    // ---------------------------------------------------------
    // Spec pattern for locating test files
    // ---------------------------------------------------------
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
});
