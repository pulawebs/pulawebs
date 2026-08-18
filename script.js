/* ==========================================================================
   PulaWebs — script.js
   Vanilla JS only. Adds interactivity to the existing HTML/CSS without
   modifying either. Every DOM lookup is null-checked so missing/optional
   elements never throw errors.
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Shared helpers                                                      */
  /* ------------------------------------------------------------------ */

  /** True if the user has asked the OS/browser to reduce motion. */
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Reads the sticky header's rendered height so smooth-scroll targets
   * land below it instead of underneath it. Falls back to 0 if the
   * header is missing.
   */
  const getHeaderOffset = () => {
    const header = document.querySelector('.site-header');
    return header ? header.getBoundingClientRect().height : 0;
  };

  /**
   * Smoothly scrolls to a section, offsetting for the sticky header.
   * Respects prefers-reduced-motion by jumping instantly instead.
   */
  const scrollToSection = (target) => {
    if (!target) return;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 12;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  /**
   * Returns the section element referenced by an in-page hash link
   * (e.g. "#contact" -> #contact element), or null if it isn't a
   * valid in-page link.
   */
  const getInPageTarget = (anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || !href.startsWith('#')) return null;

    let target = null;
    try {
      target = document.querySelector(href);
    } catch (err) {
      target = null; // Ignore malformed selectors
    }
    return target;
  };

  /* ------------------------------------------------------------------ */
  /* 1. MOBILE NAVIGATION                                                */
  /* ------------------------------------------------------------------ */
  /*
    The current HTML markup does not include a dedicated mobile menu
    button, so this looks for one using common conventions
    (.nav-toggle / .mobile-menu-toggle / [data-nav-toggle]) and simply
    does nothing if none is found — the rest of the site keeps working.
    If/when a toggle button is added to the HTML, this will work
    immediately with no further JS changes needed.
  */
  const initMobileNav = () => {
    const toggle = document.querySelector(
      '.nav-toggle, .mobile-menu-toggle, [data-nav-toggle]'
    );
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return; // Nothing to wire up safely

    // Ensure the toggle button is accessible even if the HTML omitted attrs.
    if (!toggle.hasAttribute('aria-expanded')) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (!toggle.hasAttribute('aria-controls') && navLinks.id) {
      toggle.setAttribute('aria-controls', navLinks.id);
    }

    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      navLinks.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close the menu whenever a nav link is chosen.
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click.
    document.addEventListener('click', (event) => {
      const clickedInsideNav =
        navLinks.contains(event.target) || toggle.contains(event.target);
      if (!clickedInsideNav && navLinks.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on Escape for keyboard users.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  };

  /* ------------------------------------------------------------------ */
  /* 2. SMOOTH NAVIGATION                                                */
  /* ------------------------------------------------------------------ */
  /*
    Applies to every in-page anchor link (href starting with "#"),
    site-wide — not just the nav — so hero, pricing, and footer links
    all benefit. External links (mailto:, tel:, http(s)://, etc.) are
    left completely alone.
  */
  const initSmoothScroll = () => {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = getInPageTarget(anchor);
        if (!target) return; // Not a valid in-page target — let default happen

        event.preventDefault();
        scrollToSection(target);

        // Keep the URL hash in sync without adding a jumpy native scroll.
        const href = anchor.getAttribute('href');
        if (history.pushState) {
          history.pushState(null, '', href);
        }
      });
    });
  };

  /* ------------------------------------------------------------------ */
  /* 3. PRICING PACKAGE SELECTION                                        */
  /* ------------------------------------------------------------------ */
  /*
    Clicking "Choose FOUNDATION" or "Choose SIGNATURE" scrolls to the
    contact section and pre-selects the matching option in the
    #package dropdown, so the visitor doesn't have to pick it again.
  */
  const initPricingSelection = () => {
    const packageSelect = document.getElementById('package');
    const contactSection = document.getElementById('contact');

    const wireButton = (cardSelector, packageValue) => {
      const button = document.querySelector(`${cardSelector} .btn`);
      if (!button) return;

      button.addEventListener('click', (event) => {
        // The buttons already link to #contact — let smooth scroll run,
        // then just make sure the right package ends up selected.
        if (packageSelect) {
          const optionExists = Array.from(packageSelect.options).some(
            (option) => option.value === packageValue
          );
          if (optionExists) {
            packageSelect.value = packageValue;
            // Notify any listeners (and screen readers) that the value changed.
            packageSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        if (contactSection) {
          event.preventDefault();
          scrollToSection(contactSection);
          if (history.pushState) history.pushState(null, '', '#contact');
        }
      });
    };

    wireButton('.pricing-card-foundation', 'foundation');
    wireButton('.pricing-card-signature', 'signature');
  };

  /* ------------------------------------------------------------------ */
  /* 4 & 5. CONTACT FORM — VALIDATION, SUBMISSION & RESET                */
  /* ------------------------------------------------------------------ */
  const initContactForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const fullnameField = form.querySelector('#fullname');
    const emailField = form.querySelector('#email');
    const packageField = form.querySelector('#package');
    const submitButton = form.querySelector('button[type="submit"]');

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // A place to show a form-level confirmation message once submitted.
    let statusBox = null;
    const getStatusBox = () => {
      if (statusBox) return statusBox;
      statusBox = document.createElement('div');
      statusBox.setAttribute('role', 'status');
      statusBox.setAttribute('aria-live', 'polite');
      statusBox.style.marginTop = '0.5rem';
      statusBox.style.padding = '0.85rem 1rem';
      statusBox.style.borderRadius = '6px';
      statusBox.style.fontSize = '0.9375rem';
      statusBox.style.lineHeight = '1.5';
      form.insertBefore(statusBox, submitButton ? submitButton : null);
      return statusBox;
    };

    const showStatus = (message, type) => {
      const box = getStatusBox();
      box.textContent = message;
      box.style.display = 'block';
      if (type === 'success') {
        box.style.backgroundColor = '#e9f7ef';
        box.style.color = '#1f8a4c';
        box.style.border = '1px solid #b7e4c7';
      } else {
        box.style.backgroundColor = '#fdecec';
        box.style.color = '#b3261e';
        box.style.border = '1px solid #f3b4b0';
      }
    };

    const clearStatus = () => {
      if (statusBox) {
        statusBox.textContent = '';
        statusBox.style.display = 'none';
      }
    };

    // Inline field-error helper: creates/reuses a small message under a field.
    const getErrorEl = (field) => {
      const group = field.closest('.form-group') || field.parentElement;
      if (!group) return null;

      let errorEl = group.querySelector('.js-field-error');
      if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'js-field-error';
        errorEl.setAttribute('role', 'alert');
        errorEl.style.color = '#b3261e';
        errorEl.style.fontSize = '0.8125rem';
        errorEl.style.marginTop = '0.35rem';
        group.appendChild(errorEl);
      }
      return errorEl;
    };

    const setFieldError = (field, message) => {
      if (!field) return;
      const errorEl = getErrorEl(field);
      if (errorEl) errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
      field.style.borderColor = '#b3261e';
    };

    const clearFieldError = (field) => {
      if (!field) return;
      const group = field.closest('.form-group') || field.parentElement;
      const errorEl = group ? group.querySelector('.js-field-error') : null;
      if (errorEl) errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
      field.style.borderColor = '';
    };

    const clearAllErrors = () => {
      form.querySelectorAll('.js-field-error').forEach((el) => {
        el.textContent = '';
      });
      form.querySelectorAll('[aria-invalid]').forEach((field) => {
        field.removeAttribute('aria-invalid');
        field.style.borderColor = '';
      });
    };

    /** Validates the form and returns true only if everything checks out. */
    const validateForm = () => {
      let isValid = true;
      let firstInvalidField = null;

      clearAllErrors();
      clearStatus();

      // Full name — required.
      if (fullnameField && !fullnameField.value.trim()) {
        setFieldError(fullnameField, 'Please enter your full name.');
        isValid = false;
        firstInvalidField = firstInvalidField || fullnameField;
      }

      // Email — required and must look like a real email address.
      if (emailField) {
        const emailValue = emailField.value.trim();
        if (!emailValue) {
          setFieldError(emailField, 'Please enter your email address.');
          isValid = false;
          firstInvalidField = firstInvalidField || emailField;
        } else if (!EMAIL_PATTERN.test(emailValue)) {
          setFieldError(emailField, 'Please enter a valid email address (e.g. name@example.com).');
          isValid = false;
          firstInvalidField = firstInvalidField || emailField;
        }
      }

      // Package — must be selected.
      if (packageField && !packageField.value) {
        setFieldError(packageField, 'Please select a package so we know what you need.');
        isValid = false;
        firstInvalidField = firstInvalidField || packageField;
      }

      // Any other native "required" fields the HTML might define later.
      form.querySelectorAll('[required]').forEach((field) => {
        if (field === fullnameField || field === emailField) return; // already handled
        if (!field.value || !field.value.trim()) {
          setFieldError(field, 'This field is required.');
          isValid = false;
          firstInvalidField = firstInvalidField || field;
        }
      });

      if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
      }

      return isValid;
    };

    // Clear a field's error as soon as the visitor starts fixing it.
    [fullnameField, emailField, packageField].forEach((field) => {
      if (!field) return;
      const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, () => clearFieldError(field));
    });

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    showStatus(
      'Please fix the highlighted fields before submitting.',
      'error'
    );
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      showStatus(
        'Thank you! Your enquiry has been sent successfully. We will get back to you soon.',
        'success'
      );

      form.reset();
      clearAllErrors();
    } else {
      showStatus(
        'Sorry, something went wrong. Please try again.',
        'error'
      );
    }
  } catch (error) {
    showStatus(
      'Unable to send your enquiry right now. Please try again later.',
      'error'
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Request';
    }
  }
});
  };

  /* ------------------------------------------------------------------ */
  /* 6. SUBTLE INTERACTIONS                                              */
  /* ------------------------------------------------------------------ */

  /** A light, reduced-motion-aware "press" feedback for all buttons. */
  const initButtonPressFeedback = () => {
    if (prefersReducedMotion()) return; // Respect the user's preference entirely

    const buttons = document.querySelectorAll('.btn:not(:disabled)');

    buttons.forEach((button) => {
      button.style.transition = 'transform 120ms ease';

      const press = () => {
        button.style.transform = 'scale(0.97)';
      };
      const release = () => {
        button.style.transform = '';
      };

      button.addEventListener('mousedown', press);
      button.addEventListener('touchstart', press, { passive: true });
      ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach((evt) => {
        button.addEventListener(evt, release);
      });
    });
  };

  /**
   * The portfolio "View Project" buttons currently point to "#" as
   * placeholders. Clicking them shouldn't jump the page to the top —
   * instead, show a brief, friendly note explaining these are demo
   * projects (matching the existing .portfolio-note copy).
   */
  const initPortfolioPlaceholders = () => {
    const portfolioButtons = document.querySelectorAll('.portfolio-card .btn');
    if (!portfolioButtons.length) return;

    portfolioButtons.forEach((button) => {
      const href = button.getAttribute('href');
      if (href !== '#') return; // Real links should work normally

      button.addEventListener('click', (event) => {
        event.preventDefault();

        const card = button.closest('.portfolio-card');
        if (!card) return;

        let note = card.querySelector('.js-portfolio-note');
        if (!note) {
          note = document.createElement('p');
          note.className = 'js-portfolio-note';
          note.setAttribute('role', 'status');
          note.textContent = 'This is a placeholder project — real case studies are coming soon.';
          note.style.margin = '0 1.5rem 1.5rem';
          note.style.fontSize = '0.8125rem';
          note.style.fontStyle = 'italic';
          note.style.color = '#8993a1';
          card.appendChild(note);
        }
      });
    });
  };

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initPricingSelection();
    initContactForm();
    initButtonPressFeedback();
    initPortfolioPlaceholders();
  });
})();
