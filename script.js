/* =========================================================
   PULAWEBs — MODERN SITE JAVASCRIPT
   Clean interactions / smooth navigation / mobile menu /
   pricing selection / contact form
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     HELPERS
     ========================================================= */

  const header = document.querySelector(".site-header");

  const getHeaderHeight = () => {
    return header ? header.offsetHeight : 0;
  };

  const smoothScrollTo = (element) => {
    if (!element) return;

    const position =
      element.getBoundingClientRect().top +
      window.scrollY -
      getHeaderHeight() -
      15;

    window.scrollTo({
      top: position,
      behavior: "smooth"
    });
  };


  /* =========================================================
     1. SMOOTH NAVIGATION
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      smoothScrollTo(target);

      history.pushState(null, "", href);

    });

  });


  /* =========================================================
     2. NAVIGATION SCROLL EFFECT
     ========================================================= */

  const updateHeader = () => {

    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  };

  window.addEventListener("scroll", updateHeader);

  updateHeader();


  /* =========================================================
     3. PRICING BUTTONS
     ========================================================= */

  const packageSelect = document.getElementById("package");
  const contactSection = document.getElementById("contact");

  const selectPackage = (packageName) => {

    if (!packageSelect) return;

    const option = Array.from(packageSelect.options).find(
      (item) => item.value === packageName
    );

    if (option) {
      packageSelect.value = packageName;

      packageSelect.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    }

  };


  const pricingButtons = {

    ".pricing-card-foundation .btn": "foundation",

    ".pricing-card-signature .btn": "signature"

  };


  Object.entries(pricingButtons).forEach(
    ([selector, packageName]) => {

      const button = document.querySelector(selector);

      if (!button) return;

      button.addEventListener("click", (event) => {

        if (!contactSection) return;

        event.preventDefault();

        selectPackage(packageName);

        smoothScrollTo(contactSection);

        history.pushState(
          null,
          "",
          "#contact"
        );

      });

    }
  );


  /* =========================================================
     4. CONTACT FORM
     ========================================================= */

  const form = document.querySelector(".contact-form");

  if (form) {

    const submitButton =
      form.querySelector('button[type="submit"]');

    const showMessage = (message, success = true) => {

      let messageBox =
        form.querySelector(".form-message");

      if (!messageBox) {

        messageBox =
          document.createElement("div");

        messageBox.className =
          "form-message";

        form.insertBefore(
          messageBox,
          submitButton
        );

      }

      messageBox.textContent = message;

      messageBox.style.padding = "14px 16px";
      messageBox.style.borderRadius = "10px";
      messageBox.style.fontSize = "14px";

      if (success) {

        messageBox.style.background = "#edf8f0";
        messageBox.style.color = "#20753b";

      } else {

        messageBox.style.background = "#fff0f0";
        messageBox.style.color = "#a52828";

      }

    };


    form.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();

        const name =
          document.getElementById("fullname");

        const email =
          document.getElementById("email");

        if (!name || !email) return;

        if (!name.value.trim()) {

          showMessage(
            "Please enter your name.",
            false
          );

          name.focus();

          return;

        }


        if (!email.value.trim()) {

          showMessage(
            "Please enter your email.",
            false
          );

          email.focus();

          return;

        }


        if (!email.validity.valid) {

          showMessage(
            "Please enter a valid email address.",
            false
          );

          email.focus();

          return;

        }


        if (submitButton) {

          submitButton.disabled = true;

          submitButton.textContent =
            "Sending...";

        }


        try {

          const response =
            await fetch(
              form.action,
              {
                method: "POST",

                body:
                  new FormData(form),

                headers: {
                  Accept:
                    "application/json"
                }
              }
            );


          if (response.ok) {

            showMessage(
              "Thanks! Your enquiry has been sent. We'll get back to you soon.",
              true
            );

            form.reset();

          } else {

            showMessage(
              "Something went wrong. Please try again.",
              false
            );

          }

        } catch (error) {

          showMessage(
            "We couldn't send your message right now. Please try again.",
            false
          );

        } finally {

          if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
              "Submit";

          }

        }

      }
    );

  }


  /* =========================================================
     5. BUTTON PRESS EFFECT
     ========================================================= */

  document
    .querySelectorAll(".btn")
    .forEach((button) => {

      button.addEventListener(
        "mousedown",
        () => {

          button.style.transform =
            "scale(0.97)";

        }
      );


      button.addEventListener(
        "mouseup",
        () => {

          button.style.transform = "";

        }
      );


      button.addEventListener(
        "mouseleave",
        () => {

          button.style.transform = "";

        }
      );

    });


  /* =========================================================
     6. PORTFOLIO IMAGE LAZY LOADING
     ========================================================= */

  document
    .querySelectorAll(".portfolio-preview img")
    .forEach((image) => {

      image.loading = "lazy";

    });


  /* =========================================================
     7. SIMPLE REVEAL ANIMATIONS
     ========================================================= */

  const revealElements = document.querySelectorAll(
    ".service-card, .pricing-card, .portfolio-card, .step-card, .contact-form, .contact-details"
  );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach((element) => {

      element.classList.add(
        "reveal"
      );

      observer.observe(element);

    });

  }


  /* =========================================================
     8. KEYBOARD ACCESSIBILITY
     ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") return;

      document.activeElement?.blur();

    }
  );


  /* =========================================================
     9. CURRENT YEAR
     ========================================================= */

  const footerYear =
    document.querySelector(
      ".footer-bottom p"
    );

  if (footerYear) {

    footerYear.innerHTML =
      `&copy; ${new Date().getFullYear()} PulaWebs. All rights reserved.`;

  }


})();
