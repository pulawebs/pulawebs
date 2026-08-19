/* =========================================================
   PulaWebs — script.js
   Vanilla JavaScript
========================================================= */

(() => {
    "use strict";

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            navLinks.classList.toggle("mobile-open");

            menuToggle.classList.toggle("active");

            menuToggle.textContent =
                navLinks.classList.contains("mobile-open")
                    ? "✕"
                    : "☰";
        });


        // Close menu after clicking a link

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("mobile-open");

                menuToggle.classList.remove("active");

                menuToggle.textContent = "☰";
            });

        });

    }


    /* =========================================================
       ADD MOBILE NAV STYLES THROUGH JS
       Keeps your original HTML clean.
    ========================================================= */

    const mobileStyle = document.createElement("style");

    mobileStyle.textContent = `

        @media (max-width: 700px) {

            .nav-links.mobile-open {

                position: fixed;

                top: 80px;
                left: 17px;
                right: 17px;

                display: flex;

                flex-direction: column;

                align-items: stretch;

                gap: 0;

                padding: 10px;

                background: rgba(23, 25, 23, 0.97);

                border: 1px solid rgba(255,255,255,0.1);

                border-radius: 18px;

                backdrop-filter: blur(20px);

                box-shadow:
                    0 20px 60px rgba(0,0,0,0.4);

                animation: menuIn 0.25s ease forwards;

            }

            .nav-links.mobile-open a {

                padding: 17px;

                border-bottom:
                    1px solid rgba(255,255,255,0.07);

            }

            .nav-links.mobile-open a:last-child {

                border-bottom: none;

            }

            @keyframes menuIn {

                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }

            }

        }

    `;

    document.head.appendChild(mobileStyle);


    /* =========================================================
       SCROLL HEADER
    ========================================================= */

    const header = document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 40) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        };

        window.addEventListener("scroll", updateHeader);

        updateHeader();


        const headerStyle = document.createElement("style");

        headerStyle.textContent = `

            .site-header {

                transition:
                    background 0.3s ease,
                    backdrop-filter 0.3s ease;

            }

            .site-header.scrolled {

                position: fixed;

                background:
                    rgba(16,17,16,0.78);

                backdrop-filter: blur(18px);

                border-bottom:
                    1px solid rgba(255,255,255,0.08);

            }

        `;

        document.head.appendChild(headerStyle);

    }


    /* =========================================================
       SCROLL REVEAL ANIMATIONS
    ========================================================= */

    const revealElements = document.querySelectorAll(
        ".section, .work-card, .service-card, .process-card, .price-card, .payment-inner, .contact-form, .contact-info"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


        revealElements.forEach(element => {

            element.classList.add("reveal");

            observer.observe(element);

        });


        const revealStyle = document.createElement("style");

        revealStyle.textContent = `

            .reveal {

                opacity: 0;

                transform: translateY(35px);

                transition:
                    opacity 0.8s ease,
                    transform 0.8s ease;

            }

            .reveal.revealed {

                opacity: 1;

                transform: translateY(0);

            }

            .work-card:nth-child(2),
            .service-card:nth-child(2),
            .process-card:nth-child(2) {

                transition-delay: 0.08s;

            }

            .work-card:nth-child(3),
            .service-card:nth-child(3),
            .process-card:nth-child(3) {

                transition-delay: 0.16s;

            }

        `;

        document.head.appendChild(revealStyle);

    }


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navigationLinks = document.querySelectorAll(
        ".nav-links a"
    );

    if (
        sections.length &&
        navigationLinks.length &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    navigationLinks.forEach(link => {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            `#${id}`
                        ) {

                            link.classList.add("active");

                        }

                    });

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );


        sections.forEach(section => {

            sectionObserver.observe(section);

        });


        const activeStyle = document.createElement("style");

        activeStyle.textContent = `

            .nav-links a.active {

                color: #c8ff2f;

            }

        `;

        document.head.appendChild(activeStyle);

    }


    /* =========================================================
       SMOOTH BUTTON CLICK FEEDBACK
    ========================================================= */

    document.querySelectorAll(
        ".button, .nav-cta, .price-button, .submit-button"
    ).forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add("clicked");

            setTimeout(() => {

                button.classList.remove("clicked");

            }, 250);

        });

    });


    /* =========================================================
       CARD TILT EFFECT
       Desktop only
    ========================================================= */

    const tiltCards = document.querySelectorAll(
        ".service-card, .price-card"
    );

    if (window.matchMedia("(min-width: 701px)").matches) {

        tiltCards.forEach(card => {

            card.addEventListener("mousemove", event => {

                const rect = card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -2;

                const rotateY =
                    ((x - centerX) / centerX) * 2;

                card.style.transform =
                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            });


            card.addEventListener("mouseleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* =========================================================
       CONTACT FORM
    ========================================================= */

    const contactForm =
        document.querySelector(".contact-form");

    const submitButton =
        document.querySelector(".submit-button");

    if (contactForm && submitButton) {

        contactForm.addEventListener("submit", () => {

            submitButton.innerHTML =
                `Sending... <span>→</span>`;

            submitButton.style.opacity = "0.7";

        });

    }


    /* =========================================================
       CURRENT YEAR
    ========================================================= */

    const footerYear =
        document.querySelector(".footer-bottom span");

    if (footerYear) {

        footerYear.textContent =
            `© ${new Date().getFullYear()} PulaWebs`;

    }


    /* =========================================================
       PARALLAX HERO GLOW
    ========================================================= */

    const hero = document.querySelector(".hero");

    const glowOne =
        document.querySelector(".hero-glow-one");

    const glowTwo =
        document.querySelector(".hero-glow-two");

    if (hero && glowOne && glowTwo) {

        window.addEventListener("scroll", () => {

            const scroll = window.scrollY;

            if (scroll < window.innerHeight) {

                glowOne.style.transform =
                    `translateY(${scroll * 0.08}px)`;

                glowTwo.style.transform =
                    `translateY(${-scroll * 0.04}px)`;

            }

        });

    }


    /* =========================================================
       ESC KEY CLOSES MOBILE MENU
    ========================================================= */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        if (
            navLinks &&
            navLinks.classList.contains("mobile-open")
        ) {

            navLinks.classList.remove("mobile-open");

            if (menuToggle) {

                menuToggle.classList.remove("active");

                menuToggle.textContent = "☰";

            }

        }

    });


    /* =========================================================
       REDUCE MOTION SUPPORT
    ========================================================= */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (prefersReducedMotion) {

        document.documentElement.style.scrollBehavior =
            "auto";

        document.querySelectorAll(
            ".reveal"
        ).forEach(element => {

            element.style.transition = "none";

            element.style.opacity = "1";

            element.style.transform = "none";

        });

    }


    console.log(
        "%cPulaWebs",
        "font-size:24px;font-weight:bold;color:#c8ff2f;"
    );

    console.log(
        "Web solutions that flow."
    );

})();
