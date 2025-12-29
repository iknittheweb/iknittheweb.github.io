// Jest unit tests for dropdown.js
// Add tests for toggling, keyboard, ARIA, and focus management

/**
 * @jest-environment jsdom
 */
import { initializeDropdown } from '../src/js/dropdown.js';

describe('dropdown.js', () => {
  let dropdownTitleGroup, dropdownContent;
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="dropdown">
        <div class="dropdown__header">Dropdown</div>
        <div class="dropdown__content">
          <a href="#">Item 1</a>
          <a href="#">Item 2</a>
        </div>
      </div>
    `;
    document.documentElement.classList.add('css-loaded');
    window.dropdownInitialized = false;
    jest.resetModules();
    initializeDropdown();
    dropdownTitleGroup = document.querySelector('.dropdown__header');
    dropdownContent = document.querySelector('.dropdown__content');
  });

  test('should set ARIA attributes on init', () => {
    expect(dropdownTitleGroup.getAttribute('role')).toBe('button');
    expect(dropdownTitleGroup.getAttribute('aria-controls')).toBe('dropdown-content');
    expect(dropdownTitleGroup.getAttribute('tabindex')).toBe('0');
    expect(dropdownContent.getAttribute('role')).toBe('menu');
    expect(dropdownContent.getAttribute('id')).toBe('dropdown-content');
    expect(dropdownContent.getAttribute('aria-labelledby')).toBe('dropdown-title-group');
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
  });

  test('should toggle dropdown open/close on click', () => {
    dropdownTitleGroup.click();
    expect(dropdownContent.classList.contains('show')).toBe(true);
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('false');
    expect(dropdownTitleGroup.classList.contains('dropdown-open')).toBe(true);
    expect(dropdownTitleGroup.getAttribute('aria-expanded')).toBe('true');

    // Close
    dropdownTitleGroup.click();
    expect(dropdownContent.classList.contains('show')).toBe(false);
    expect(dropdownContent.getAttribute('aria-hidden')).toBe('true');
    expect(dropdownTitleGroup.classList.contains('dropdown-open')).toBe(false);
    expect(dropdownTitleGroup.getAttribute('aria-expanded')).toBe('false');
  });

  test('should handle keyboard events (Enter, Space, Escape)', () => {
    // Open with Enter
    dropdownTitleGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdownContent.classList.contains('show')).toBe(true);
    // Close with Escape
    dropdownTitleGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(dropdownContent.classList.contains('show')).toBe(false);
    // Open with Space
    dropdownTitleGroup.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(dropdownContent.classList.contains('show')).toBe(true);
  });

  test('should trap focus when open', () => {
    dropdownTitleGroup.click();
    // Simulate tabbing into dropdown
    const firstLink = dropdownContent.querySelector('a');
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);
    // Simulate closing and returning focus
    dropdownTitleGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.activeElement).toBe(dropdownTitleGroup);
  });
});
