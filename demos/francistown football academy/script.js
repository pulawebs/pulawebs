/* =========================================
   FRANCISTOWN FOOTBALL ACADEMY
   PulaWebs Demo Project
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    // Close menu when a navigation link is clicked

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}


/* =========================================
   PROGRAM MODAL
========================================= */

const programButtons =
    document.querySelectorAll(".program-button");

const modal =
    document.getElementById("program-modal");

const modalTitle =
    document.getElementById("modal-title");

const modalDescription =
    document.getElementById("modal-description");

const modalClose =
    document.querySelector(".modal-close");

const modalOverlay =
    document.querySelector(".modal-overlay");

const modalContact =
    document.querySelector(".modal-contact");


const programInformation = {

    "Junior Development": {
        description:
            "A foundation program for younger players focused on ball mastery, coordination, passing, teamwork and developing a positive relationship with football."
    },

    "Youth Academy": {
        description:
            "A structured development program focused on technical ability, tactical awareness, position-specific training and competitive development."
    },

    "Elite Development": {
        description:
            "An advanced development pathway for ambitious players. Sessions focus on tactical understanding, match analysis, position-specific training and performance development."
    },

    "Goalkeeper Academy": {
        description:
            "Specialised goalkeeper training focusing on handling, shot stopping, positioning, decision-making and distribution."
    }

};


function openProgramModal(programName) {

    if (!modal || !modalTitle || !modalDescription) {
        return;
    }

    const program =
        programInformation[programName];

    if (!program) {
        return;
    }

    modalTitle.textContent = programName;

    modalDescription.textContent =
        program.description +
        " This is fictional demo content created for the PulaWebs portfolio.";

    modal.classList.add("active");

    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    if (modalClose) {
        modalClose.focus();
    }

}


function closeProgramModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

}


programButtons.forEach(button => {

    button.addEventListener("click", () => {

        const programName =
            button.getAttribute("data-program");

        openProgramModal(programName);

    });

});


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeProgramModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeProgramModal
    );

}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeProgramModal();

    }

});


/* =========================================
   MODAL CONTACT BUTTON
========================================= */

if (modalContact) {

    modalContact.addEventListener("click", () => {

        closeProgramModal();

    });

}


/* =========================================
   FAQ ACCORDION
========================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {

    question.addEventListener("click", () => {

        const currentlyOpen =
            question.getAttribute("aria-expanded") === "true";


        // Close all FAQ items

        faqQuestions.forEach(item => {

            item.setAttribute(
                "aria-expanded",
                "false"
            );

            const answer =
                item.nextElementSibling;

            if (answer) {
                answer.style.maxHeight = null;
            }

        });


        // Open selected item

        if (!currentlyOpen) {

            question.setAttribute(
                "aria-expanded",
                "true"
            );

            const answer =
                question.nextElementSibling;

            if (answer) {

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        }

    });

});


/* =========================================
   CONTACT FORM
========================================= */

const academyForm =
    document.getElementById("academy-form");

const formMessage =
    document.getElementById("form-message");


if (academyForm) {

    academyForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const guardianName =
                document.getElementById(
                    "guardian-name"
                ).value.trim();


            const playerName =
                document.getElementById(
                    "player-name"
                ).value.trim();


            const playerAge =
                document.getElementById(
                    "player-age"
                ).value;


            const position =
                document.getElementById(
                    "position"
                ).value;


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const message =
                document.getElementById(
                    "message"
                ).value.trim();


            /* -------------------------
               VALIDATION
            ------------------------- */

            if (
                !guardianName ||
                !playerName ||
                !playerAge ||
                !position ||
                !email ||
                !phone ||
                !message
            ) {

                showFormMessage(
                    "Please complete all fields before submitting.",
                    "error"
                );

                return;

            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showFormMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            const age =
                Number(playerAge);


            if (age < 5 || age > 18) {

                showFormMessage(
                    "Please enter a player age between 5 and 18.",
                    "error"
                );

                return;

            }


            /* -------------------------
               SUCCESS
            ------------------------- */

            showFormMessage(
                "Thank you! Your enquiry has been recorded for this demo.",
                "success"
            );


            /*
                IMPORTANT:

                This is only a front-end demonstration.

                The form does NOT actually send
                information to an academy or server.
            */


            academyForm.reset();

        }
    );

}


/* =========================================
   FORM MESSAGE
========================================= */

function showFormMessage(message, type) {

    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;

    if (type === "success") {

        formMessage.style.color = "#2e7d32";

    } else {

        formMessage.style.color = "#c62828";

    }

}


/* =========================================
   SMOOTH SCROLLING
========================================= */

const smoothLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


smoothLinks.forEach(link => {

    link.addEventListener("click", event => {

        const targetID =
            link.getAttribute("href");


        if (
            !targetID ||
            targetID === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(targetID);


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        '.nav-menu a[href^="#"]'
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navigationLinks.forEach(link => {

                        link.classList.remove("active");

                    });


                    const activeLink =
                        document.querySelector(
                            `.nav-menu a[href="#${entry.target.id}"]`
                        );


                    if (activeLink) {

                        activeLink.classList.add(
                            "active"
                        );

                    }

                }

            });

        },
        {
            threshold: 0.35
        }
    );


sections.forEach(section => {

    observer.observe(section);

});


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Francistown Football Academy demo loaded successfully."
        );

    }
);
