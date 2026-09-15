/* ==========================================================================
   Siam.Dev — Portfolio interactions
   Pure vanilla JS. Wrapped in an IIFE to avoid global leaks.
   ========================================================================== */
(function () {
    "use strict";

    /* Flag so CSS only enables reveal animations when JS is running
       (content stays visible for no-JS / reduced-motion users). */
    document.documentElement.classList.add("js");

    /* ------------------------------------------------------------------
       Theme switcher (light / dark)
       The <head> bootstrap already set data-theme before paint; this just
       wires up the toggle, persistence, and the meta theme-color hint.
       ------------------------------------------------------------------ */
    var themeToggle = document.getElementById("theme-toggle");
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');

    function currentTheme() {
        return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function applyTheme(theme) {
        var next = theme === "light" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        var light = next === "light";
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(light));
            themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
        }
        if (themeColorMeta) themeColorMeta.setAttribute("content", light ? "#f7f8fa" : "#0a0a0a");
        try { localStorage.setItem("sd-theme", next); } catch (err) { /* private mode */ }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            applyTheme(currentTheme() === "light" ? "dark" : "light");
        });
    }

    /* ------------------------------------------------------------------
       Helpers
       ------------------------------------------------------------------ */
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ------------------------------------------------------------------
       Sticky header state
       ------------------------------------------------------------------ */
    var header = document.getElementById("site-header");
    var backToTop = document.getElementById("back-to-top");

    function onScroll() {
        var scrolled = window.scrollY > 24;
        header.classList.toggle("scrolled", scrolled);
        backToTop.classList.toggle("visible", window.scrollY > 420);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ------------------------------------------------------------------
       Mobile menu
       ------------------------------------------------------------------ */
    var navToggle = document.getElementById("nav-toggle");
    var navLinks = document.getElementById("nav-links");
    var menuOverlay = document.getElementById("menu-overlay");
    var drawerClose = document.getElementById("drawer-close");

    function setMenu(open) {
        navToggle.setAttribute("aria-expanded", String(open));
        if (open) navLinks.classList.add("open");
        else navLinks.classList.remove("open");
        if (menuOverlay) menuOverlay.classList.toggle("open", open);
        document.body.classList.toggle("menu-open", open);
    }

    navToggle.addEventListener("click", function () {
        setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    if (drawerClose) {
        drawerClose.addEventListener("click", function () { setMenu(false); });
    }

    // close when a link is tapped
    navLinks.addEventListener("click", function (event) {
        if (event.target.closest("a")) setMenu(false);
    });

    // close on Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setMenu(false);
    });

    // close when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".navbar")) setMenu(false);
    });

    // reset on resize to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 767 && navLinks.classList.contains("open")) setMenu(false);
    });

    /* ------------------------------------------------------------------
       Scroll reveal + skill bars + hero counters (IntersectionObserver)
       ------------------------------------------------------------------ */
    function revealStagger() {
        document.querySelectorAll("[data-stagger] .reveal").forEach(function (el, i) {
            el.style.setProperty("--d", Math.min(i, 6) * 90 + "ms");
        });
    }

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            var el = entry.target;

            // animate skill bars to their target width
            el.querySelectorAll(".skill-bar-fill").forEach(function (fill) {
                fill.style.width = fill.dataset.progress + "%";
            });

            // animate numbers (hero stats)
            el.querySelectorAll(".stat-value[data-count]").forEach(runCounter);

            el.classList.add("is-visible");
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    /* Count up animation with easing */
    function runCounter(el) {
        var target = parseInt(el.dataset.count, 10) || 0;
        var suffix = el.dataset.suffix || "";
        var duration = 1300;
        var start = null;

        if (prefersReducedMotion) {
            el.textContent = target + suffix;
            return;
        }

        function tick(now) {
            if (start === null) start = now;
            var progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    revealStagger();
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

    /* ------------------------------------------------------------------
       Hero rotating typewriter (Shopify / Full Stack / AI Developer)
       ------------------------------------------------------------------ */
    var typeRole = document.getElementById("type-role");
    var typeAnnounce = document.getElementById("type-announce");
    var roles = ["Shopify Developer", "Full Stack Developer", "AI Developer"];

    if (typeRole) {
        if (prefersReducedMotion) {
            // static first role — no typing, no timers
            typeRole.textContent = roles[0];
        } else {
            // clear the no-JS static fallback before typing
            typeRole.textContent = "";
            var typeTimers = [];

            function typeCycle(index) {
                var word = roles[index % roles.length];
                var count = 0;

                function typeChar() {
                    count += 1;
                    typeRole.textContent = word.slice(0, count);
                    if (count < word.length) {
                        typeTimers.push(setTimeout(typeChar, 62));
                    } else {
                        if (typeAnnounce) typeAnnounce.textContent = word;
                        typeTimers.push(setTimeout(untypeChar, 1500));
                    }
                }

                function untypeChar() {
                    count -= 1;
                    typeRole.textContent = word.slice(0, count);
                    if (count > 0) {
                        typeTimers.push(setTimeout(untypeChar, 28));
                    } else {
                        typeTimers.push(setTimeout(function () { typeCycle(index + 1); }, 240));
                    }
                }

                typeChar();
            }

            var typeObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    typeObserver.disconnect();
                    typeCycle(0);
                });
            }, { threshold: 0.4 });
            typeObserver.observe(typeRole);
        }
    }

    /* ------------------------------------------------------------------
       Active nav state (scrollspy)
       ------------------------------------------------------------------ */
    var navAnchors = document.querySelectorAll(".nav-link");
    var sections = Array.prototype.map.call(navAnchors, function (a) {
        return document.querySelector(a.getAttribute("href"));
    }).filter(Boolean);

    var spyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            navAnchors.forEach(function (a) {
                a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { spyObserver.observe(section); });

    /* ------------------------------------------------------------------
       Portfolio tabs
       ------------------------------------------------------------------ */
    var tabButtons = document.querySelectorAll(".tab-btn");
    var panels = document.querySelectorAll(".projects-grid[data-panel]");

    tabButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var target = btn.dataset.tab;

            tabButtons.forEach(function (b) {
                var isTarget = b === btn;
                b.classList.toggle("active", isTarget);
                b.setAttribute("aria-selected", String(isTarget));
            });

            panels.forEach(function (panel) {
                var show = panel.dataset.panel === target;
                panel.classList.toggle("is-active", show);
                if (show) panel.hidden = false;
                else panel.hidden = true;
            });
        });
    });

    /* ------------------------------------------------------------------
       Contact form validation (fake submission)
       ------------------------------------------------------------------ */
    var form = document.getElementById("contact-form");
    var submitBtn = document.getElementById("submit-btn");
    var successMsg = document.getElementById("form-success");
    var errorMsg = document.getElementById("form-error");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(input, message) {
        var group = input.closest(".form-group");
        var errorEl = group.querySelector(".form-error");
        group.classList.add("has-error");
        errorEl.textContent = message;
        errorEl.hidden = false;
        input.setAttribute("aria-invalid", "true");
    }

    function clearError(input) {
        var group = input.closest(".form-group");
        var errorEl = group.querySelector(".form-error");
        group.classList.remove("has-error");
        errorEl.textContent = "";
        errorEl.hidden = true;
        input.removeAttribute("aria-invalid");
    }

    function validateField(input) {
        var value = input.value.trim();
        var error = null;

        switch (input.name) {
            case "name":
                if (!value) error = "Name is required";
                break;
            case "email":
                if (!value) error = "Email is required";
                else if (!emailRe.test(value)) error = "Enter a valid email";
                break;
            case "projectType":
                if (!value) error = "Please select a project type";
                break;
            case "message":
                if (!value) error = "Message is required";
                else if (value.length < 10) error = "Message is too short";
                break;
        }

        if (error) setError(input, error);
        else clearError(input);
        return !error;
    }

    // live re-validation while typing
    ["name", "email", "projectType", "message"].forEach(function (name) {
        var input = form.querySelector("[name='" + name + "']");
        input.addEventListener("blur", function () { validateField(input); });
        input.addEventListener(input.tagName === "SELECT" ? "change" : "input", function () {
            clearError(input);
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var fields = ["name", "email", "projectType", "message"];
        var valid = true;
        fields.forEach(function (name) {
            var input = form.querySelector("[name='" + name + "']");
            if (!validateField(input)) valid = false;
        });

        if (!valid) {
            var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
            if (firstError) firstError.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
        if (errorMsg) errorMsg.hidden = true;
        if (successMsg) successMsg.hidden = true;

        var payload = {};
        fields.forEach(function (name) {
            payload[name] = form.querySelector("[name='" + name + "']").value.trim();
        });

        fetch("https://formsubmit.co/ajax/hello@siam.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (!res.ok) throw new Error("Submission failed");
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
            form.reset();
            successMsg.hidden = false;
            setTimeout(function () { successMsg.hidden = true; }, 5000);
        }).catch(function () {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
            if (errorMsg) errorMsg.hidden = false;
        });
    });

    /* ------------------------------------------------------------------
       Back to top
       ------------------------------------------------------------------ */
    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    /* ------------------------------------------------------------------
       Custom animated cursor (dot + trailing ring)
       Enabled only on fine-pointer devices without reduced-motion;
       otherwise the native cursor is kept untouched.
       ------------------------------------------------------------------ */
    var FINE_POINTER = window.matchMedia("(pointer: fine)").matches;
    if (FINE_POINTER && !prefersReducedMotion) {
        var cursorDot = document.querySelector(".cursor-dot");
        var cursorRing = document.querySelector(".cursor-ring");
        var CURSOR_TARGETS = "a, button, [role='button'], select, textarea, summary, input, .tab-btn, .chip, .tag, .nav-link, .btn";

        if (cursorDot && cursorRing) {
            document.documentElement.classList.add("custom-cursor");

            var targetX = -100;
            var targetY = -100;
            var dotX = -100;
            var dotY = -100;
            var ringX = -100;
            var ringY = -100;

            function placeCursor(x, y) {
                cursorDot.style.transform =
                    "translate3d(" + dotX + "px, " + dotY + "px, 0) translate(-50%, -50%)";
                cursorRing.style.transform =
                    "translate3d(" + ringX + "px, " + ringY + "px, 0) translate(-50%, -50%)";
            }

            function tickCursor() {
                dotX += (targetX - dotX) * 0.32;
                dotY += (targetY - dotY) * 0.32;
                ringX += (targetX - ringX) * 0.16;
                ringY += (targetY - ringY) * 0.16;
                placeCursor();
                requestAnimationFrame(tickCursor);
            }

            window.addEventListener("pointermove", function (event) {
                targetX = event.clientX;
                targetY = event.clientY;
            }, { passive: true });

            document.addEventListener("pointerdown", function (event) {
                cursorRing.classList.add("is-down");
            });
            window.addEventListener("pointerup", function () {
                cursorRing.classList.remove("is-down");
            });

            document.addEventListener("pointerover", function (event) {
                if (event.target.closest(CURSOR_TARGETS)) {
                    cursorRing.classList.add("is-hover");
                    cursorDot.classList.add("is-hover");
                }
            }, true);
            document.addEventListener("pointerout", function (event) {
                if (event.target.closest(CURSOR_TARGETS)) {
                    cursorRing.classList.remove("is-hover");
                    cursorDot.classList.remove("is-hover");
                }
            }, true);

            // Move both elements to the first hover point when the pointer enters
            document.addEventListener("pointerenter", function (event) {
                targetX = event.clientX;
                targetY = event.clientY;
                dotX = targetX;
                dotY = targetY;
                ringX = targetX;
                ringY = targetY;
                placeCursor();
            });

            requestAnimationFrame(tickCursor);
        }
    }
})();