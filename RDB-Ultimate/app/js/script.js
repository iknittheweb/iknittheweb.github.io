const menuTopNav = document.querySelector('#menuTopNav');
const main = document.querySelector('#main');
const footer = document.querySelector('#footer');
const btnOpen = document.querySelector('#btnOpen');
const btnClose = document.querySelector('#btnClose');
const overlay = document.querySelector('#overlay');
const breakpoint = window.matchMedia('(width < 43.75em)');

// Body Scroll Lock
// function set up with arrow function ( => ) syntax
const setupTopNav = () => {
  // if the viewport is less than 700px
  if (breakpoint.matches) {
    // console.log('is mobile');
    // initial state of mobile menu is closed and inaccessible by screen readers and keyboard users
    menuTopNav.setAttribute('inert', '');
  } else {
    // console.log('is tablet/desktop');
    // ensure mobile menu is closed and main content and footer are accessible by screen readers and keyboard users
    closeMobileMenu();
    menuTopNav.removeAttribute('inert');
  }
};

setupTopNav();

// pay attention to when the user clicks the open and close buttons and run the appropriate functions defined below
btnOpen.addEventListener('click', openMobileMenu);
btnClose.addEventListener('click', closeMobileMenu);

// pay attention to when the user changes the size of the viewport
breakpoint.addEventListener('change', () => {
  // console.log('breakpoint crossed');
  setupTopNav();
});

// functions to open and close the mobile menu
/**
 * Opens the mobile navigation menu and updates accessibility attributes.
 *
 * - Sets `aria-expanded`   to 'true' on the open button to indicate menu is expanded.
 * - Adds `inert` attribute to main and footer to make them inaccessible while menu is open.
 * - Removes `inert` from the top navigation menu to make it accessible.
 * - Sets transition duration for menu and overlay to 400ms for smooth animation.
 * - Disables body scroll to prevent background scrolling when menu is open.
 * - Moves focus to the close button for accessibility.
 */
function openMobileMenu() {
  // console.log('run openMobileMenu');
  btnOpen.setAttribute('aria-expanded', 'true');
  main.setAttribute('inert', '');
  footer.setAttribute('inert', '');
  menuTopNav.removeAttribute('inert');
  menuTopNav.style.transitionDuration = '400ms';
  overlay.style.transitionDuration = '400ms';
  bodyScrollLock.disableBodyScroll(menuTopNav);
  btnClose.focus();
}

/**
 * Closes the mobile navigation menu and restores accessibility and scroll.
 *
 * - Sets `aria-expanded`   to 'false' on the open button to indicate menu is collapsed.
 * - Removes `inert` from main and footer to make them accessible again.
 * - Adds `inert` to the top navigation menu to make it inaccessible.
 * - Re-enables body scroll to allow background scrolling.
 * - Moves focus back to the open button for accessibility.
 * - After 500ms, removes inline styles from menu and overlay (cleanup after transition).
 */
function closeMobileMenu() {
  // console.log('run closeMobileMenu');
  btnOpen.setAttribute('aria-expanded', 'false');
  main.removeAttribute('inert');
  footer.removeAttribute('inert');
  menuTopNav.setAttribute('inert', '');
  bodyScrollLock.enableBodyScroll(menuTopNav);
  btnOpen.focus();

  setTimeout(() => {
    menuTopNav.removeAttribute('style');
    overlay.removeAttribute('style');
  }, 500);
}
