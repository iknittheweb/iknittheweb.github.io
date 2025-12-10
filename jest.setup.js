// =====================================================================
// Jest Setup File (Beginner-Friendly)
// =====================================================================
// Purpose: Provide global mocks for browser APIs and utilities so tests run reliably in jsdom.
// Usage: Automatically loaded by Jest before tests. No need to import manually.
// Key Concepts:
//   - Mocking browser APIs not available in jsdom
//   - Ensuring consistent test environment
//   - Breaking down each major mock for clarity
// =====================================================================

// -------------------------------------------------------------
// 1. Mock window.matchMedia (used by navigation and CSS tests)
// -------------------------------------------------------------
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false, // Always return false for simplicity
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// -------------------------------------------------------------
// 2. Mock TextEncoder and TextDecoder (used by jsdom for encoding/decoding)
// -------------------------------------------------------------
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// -------------------------------------------------------------
// 3. Mock IntersectionObserver (used by skillsChart and other components)
// -------------------------------------------------------------
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// -------------------------------------------------------------
// 4. Mock HTMLFormElement.prototype.requestSubmit (used by contactForm tests)
// -------------------------------------------------------------
if (typeof HTMLFormElement !== 'undefined' && !HTMLFormElement.prototype.requestSubmit) {
  HTMLFormElement.prototype.requestSubmit = function () {
    // Simulate form submit for tests
    if (typeof this.submit === 'function') {
      this.submit();
    }
  };
}

// -------------------------------------------------------------
// 5. Mock body-scroll-lock functions (used by navigation and others)
// -------------------------------------------------------------
global.disableBodyScroll = jest.fn();
global.enableBodyScroll = jest.fn();
