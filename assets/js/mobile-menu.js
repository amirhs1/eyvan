document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (!navToggle || !mobileMenu) {
    return;
  }

  const navClose = mobileMenu.querySelector('[data-nav-close]');
  const mobileNavLinks = mobileMenu.querySelectorAll('.c-nav__link');
  const body = document.body;

  function openMobileMenu() {
    mobileMenu.hidden = false;
    mobileMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    body.classList.add('is-mobile-menu-open');
  }

  function closeMobileMenu() {
    mobileMenu.hidden = true;
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    body.classList.remove('is-mobile-menu-open');
  }

  function toggleMobileMenu() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  if (navClose) {
    navClose.addEventListener('click', closeMobileMenu);
  }

  document.addEventListener('keydown', function (event) {
    if (
      event.key === 'Escape' &&
      navToggle.getAttribute('aria-expanded') === 'true'
    ) {
      closeMobileMenu();
      navToggle.focus();
    }
  });

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });
});
