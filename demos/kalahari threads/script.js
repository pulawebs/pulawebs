/* ============================================================
   KALAHARI THREADS — Demo project by PulaWebs
   script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Reduced motion preference
  --------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  function openMenu() {
    navLinks.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close the mobile menu after a nav link is selected
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) closeMenu();
    });
  });

  /* ---------------------------------------------------------
     Smooth scrolling (nav links + hero buttons)
  --------------------------------------------------------- */
  function scrollToTarget(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        scrollToTarget(href);
      }
    });
  });

  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      scrollToTarget(btn.getAttribute('data-scroll'));
    });
  });

  /* ---------------------------------------------------------
     Product "View Item" modal
  --------------------------------------------------------- */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');
  const modalDismiss = document.getElementById('modal-dismiss');

  let lastFocusedEl = null;

  function openModal(product) {
    lastFocusedEl = document.activeElement;

    modalTitle.textContent = product.name;
    modalPrice.textContent = `${product.price} (demo price — not for sale)`;
    modalDesc.textContent = product.desc;

    modalOverlay.hidden = false;
    modalClose.focus();

    document.addEventListener('keydown', handleModalKeydown);
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.removeEventListener('keydown', handleModalKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function handleModalKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    // Basic focus trap within the modal
    if (e.key === 'Tab') {
      const focusable = document.getElementById('product-modal')
        .querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.querySelectorAll('[data-product]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({
        name: btn.getAttribute('data-product'),
        price: btn.getAttribute('data-price'),
        desc: btn.getAttribute('data-desc')
      });
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalDismiss.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* ---------------------------------------------------------
     Contact form validation
  --------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  const fields = {
    'full-name': {
      input: document.getElementById('full-name'),
      error: document.getElementById('error-full-name'),
      validate: (val) => val.trim().length > 0,
      message: 'Please enter your full name.'
    },
    'email': {
      input: document.getElementById('email'),
      error: document.getElementById('error-email'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      message: 'Please enter a valid email address.'
    },
    'phone': {
      input: document.getElementById('phone'),
      error: document.getElementById('error-phone'),
      validate: (val) => val.trim() === '' || /^[0-9+()\-\s]{6,}$/.test(val.trim()),
      message: 'Please enter a valid phone number, or leave this blank.'
    },
    'message': {
      input: document.getElementById('message'),
      error: document.getElementById('error-message'),
      validate: (val) => val.trim().length > 0,
      message: 'Please enter a message.'
    }
  };

  function validateField(key) {
    const field = fields[key];
    const isValid = field.validate(field.input.value);
    const row = field.input.closest('.form-row');

    if (isValid) {
      row.classList.remove('has-error');
      field.error.textContent = '';
    } else {
      row.classList.add('has-error');
      field.error.textContent = field.message;
    }
    return isValid;
  }

  // Live validation as the user types/leaves a field
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
    fields[key].input.addEventListener('input', () => {
      if (fields[key].input.closest('.form-row').classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    let allValid = true;
    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.form-row.has-error input, .form-row.has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // No backend — this is a demo project, so no message is actually sent.
    successMsg.textContent = 'Thank you! This is a demo form, so no message was actually sent.';
    form.reset();
  });

});
