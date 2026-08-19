/* =========================================================
   PULAWEBs — INTERACTIVE STUDIO
   Vanilla JavaScript
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const menuButton = document.getElementById("menuButton");
  const cursor = document.querySelector(".cursor");
  const contactForm = document.getElementById("contactForm");

  /* =========================================================
     PAGE LOAD
  ========================================================= */

  window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    setTimeout(() => {
      document.querySelectorAll(".hero .reveal").forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("visible");
        }, index * 140);
      });
    }, 150);
  });

  /* =========================================================
     NAVBAR
  ========================================================= */

  const updateNavbar = () => {
    if (!navbar) return;

    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", updateNavbar, {
    passive: true
  });

  updateNavbar();

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  if (menuButton && navLinks) {

    menuButton.addEventListener("click", () => {

      navLinks.classList.toggle("active");

      const isOpen =
        navLinks.classList.contains("active");

      menuButton.textContent =
        isOpen ? "×" : "☰";

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );
    });

    navLinks.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuButton.textContent = "☰";

        document.body.classList.remove(
          "menu-open"
        );

      });

    });
  }

  /* =========================================================
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const navHeight =
        navbar
          ? navbar.offsetHeight
          : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navHeight -
        15;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });

  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");

          revealObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

  revealElements.forEach(element => {

    if (
      element.closest(".hero")
    ) {
      return;
    }

    revealObserver.observe(element);

  });

  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */

  if (
    cursor &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener(
      "mousemove",
      event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

      },
      { passive: true }
    );

    const animateCursor = () => {

      cursorX +=
        (mouseX - cursorX) * 0.18;

      cursorY +=
        (mouseY - cursorY) * 0.18;

      cursor.style.left =
        `${cursorX}px`;

      cursor.style.top =
        `${cursorY}px`;

      requestAnimationFrame(
        animateCursor
      );

    };

    animateCursor();

    const interactiveElements =
      document.querySelectorAll(
        "a, button, .project, .service, .price-card"
      );

    interactiveElements.forEach(element => {

      element.addEventListener(
        "mouseenter",
        () => {
          cursor.classList.add("active");
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          cursor.classList.remove("active");
        }
      );

    });
  }

  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  const magneticElements =
    document.querySelectorAll(".magnetic");

  if (
    window.matchMedia("(pointer: fine)").matches
  ) {

    magneticElements.forEach(element => {

      element.addEventListener(
        "mousemove",
        event => {

          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          element.style.transform =
            `translate(
              ${x * 0.12}px,
              ${y * 0.12}px
            )`;

        }
      );

      element.addEventListener(
        "mouseleave",
        () => {

          element.style.transform =
            "translate(0, 0)";

        }
      );

    });

  }

  /* =========================================================
     PROJECT TILT
  ========================================================= */

  const projects =
    document.querySelectorAll(".project");

  if (
    window.matchMedia("(pointer: fine)").matches
  ) {

    projects.forEach(project => {

      project.addEventListener(
        "mousemove",
        event => {

          const rect =
            project.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          const rotateX =
            (y - 0.5) * -4;

          const rotateY =
            (x - 0.5) * 4;

          project.style.transform =
            `
              perspective(1000px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              translateY(-8px)
            `;

        }
      );

      project.addEventListener(
        "mouseleave",
        () => {

          project.style.transform =
            "";

        }
      );

    });

  }

  /* =========================================================
     PARALLAX HERO
  ========================================================= */

  const heroTitle =
    document.querySelector(".hero-title");

  if (heroTitle) {

    window.addEventListener(
      "scroll",
      () => {

        const scroll =
          window.scrollY;

        if (scroll > window.innerHeight) {
          return;
        }

        heroTitle.style.transform =
          `translateY(${scroll * 0.12}px)`;

        heroTitle.style.opacity =
          Math.max(
            0,
            1 - scroll / 650
          );

      },
      { passive: true }
    );

  }

  /* =========================================================
     SERVICE HOVER
  ========================================================= */

  document
    .querySelectorAll(".service")
    .forEach(service => {

      service.addEventListener(
        "mouseenter",
        () => {

          service.style.setProperty(
            "--service-progress",
            "1"
          );

        }
      );

      service.addEventListener(
        "mouseleave",
        () => {

          service.style.setProperty(
            "--service-progress",
            "0"
          );

        }
      );

    });

  /* =========================================================
     PRICING CARD HOVER
  ========================================================= */

  document
    .querySelectorAll(".price-card")
    .forEach(card => {

      card.addEventListener(
        "mousemove",
        event => {

          if (
            !window.matchMedia(
              "(pointer: fine)"
            ).matches
          ) {
            return;
          }

          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          const rotateX =
            (y - 0.5) * -2;

          const rotateY =
            (x - 0.5) * 2;

          card.style.transform =
            `
              perspective(1000px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              translateY(-8px)
            `;

        }
      );

      card.addEventListener(
        "mouseleave",
        () => {

          card.style.transform =
            "";

        }
      );

    });

  /* =========================================================
     CONTACT FORM
  ========================================================= */

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const formData =
          new FormData(contactForm);

        const name =
          String(
            formData.get("name") || ""
          ).trim();

        const email =
          String(
            formData.get("email") || ""
          ).trim();

        const phone =
          String(
            formData.get("phone") || ""
          ).trim();

        const service =
          String(
            formData.get("service") || ""
          ).trim();

        const message =
          String(
            formData.get("message") || ""
          ).trim();

        if (!name || !email) {

          showFormMessage(
            "Please enter your name and email."
          );

          return;

        }

        const subject =
          encodeURIComponent(
            `PulaWebs enquiry — ${name}`
          );

        const body =
          encodeURIComponent(
`New PulaWebs project enquiry

Name:
${name}

Email:
${email}

Phone / WhatsApp:
${phone || "Not provided"}

Service:
${service || "Not selected"}

Project details:
${message || "No details provided"}`
          );

        showFormMessage(
          "Opening your email app..."
        );

        setTimeout(() => {

          window.location.href =
            `mailto:pulawebs@gmail.com?subject=${subject}&body=${body}`;

        }, 400);

      }
    );

  }

  /* =========================================================
     FORM MESSAGE
  ========================================================= */

  function showFormMessage(message) {

    let messageElement =
      document.querySelector(
        ".form-message"
      );

    if (!messageElement) {

      messageElement =
        document.createElement("div");

      messageElement.className =
        "form-message";

      messageElement.style.marginTop =
        "15px";

      messageElement.style.fontSize =
        "13px";

      messageElement.style.color =
        "#aaa";

      contactForm.appendChild(
        messageElement
      );

    }

    messageElement.textContent =
      message;

  }

  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections =
    document.querySelectorAll(
      "section[id]"
    );

  const navAnchors =
    document.querySelectorAll(
      ".nav-links a[href^='#']"
    );

  const sectionObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          const id =
            entry.target.getAttribute("id");

          navAnchors.forEach(anchor => {

            anchor.classList.remove(
              "active"
            );

            if (
              anchor.getAttribute("href") ===
              `#${id}`
            ) {

              anchor.classList.add(
                "active"
              );

            }

          });

        });

      },
      {
        rootMargin:
          "-40% 0px -50% 0px"
      }
    );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  /* =========================================================
     KEYBOARD ACCESSIBILITY
  ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        if (
          navLinks &&
          navLinks.classList.contains(
            "active"
          )
        ) {

          navLinks.classList.remove(
            "active"
          );

          if (menuButton) {
            menuButton.textContent =
              "☰";
          }

        }

      }

    }
  );

  /* =========================================================
     REDUCE MOTION
  ========================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  if (reducedMotion.matches) {

    document
      .querySelectorAll(".reveal")
      .forEach(element => {

        element.classList.add(
          "visible"
        );

      });

  }

})();
