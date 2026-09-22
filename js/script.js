/* ==========================================================================
   Siam.Dev â€” Portfolio interactions
   Pure vanilla JS. Wrapped in an IIFE to avoid global leaks.
   ========================================================================== */
(function () {
    "use strict";

    /* Flag so CSS only enables reveal animations when JS is running
       (content stays visible for no-JS / reduced-motion users). */
    document.documentElement.classList.add("js");

    /* ------------------------------------------------------------------
       Content toggles
       Flip SHOW_TESTIMONIALS to true to bring the Testimonials section
       and its nav link back â€” markup/data stays intact either way.
       ------------------------------------------------------------------ */
    var SHOW_TESTIMONIALS = false;

    /* Contact form API endpoint (Vercel Function -> Resend).
       Local dev: run `vercel dev` at the repo root, the site + API are
       served on http://localhost:3000. In production the site stays on
       GitHub Pages and the API lives on the Vercel project URL.
       To override without editing this file:
         window.CONTACT_API_URL = ".../api/contact";
       All credentials live server-side in the Vercel function; never here. */
    var CONTACT_API_URL = (function () {
        if (window.CONTACT_API_URL) return window.CONTACT_API_URL;
        var host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") {
            return "http://localhost:3000/api/contact";
        }
        return "https://siam-portfolio.vercel.app/api/contact";
    })();
    var SUCCESS_MESSAGE = "Message sent successfully! I'll get back to you soon.";
    var RATE_LIMIT_MESSAGE = "Too many messages. Please wait a moment and try again.";
    var PROVIDER_ERROR_MESSAGE = "Something went wrong while sending your message. Please try again.";

    if (!SHOW_TESTIMONIALS) {
        var testimonialsSection = document.getElementById("testimonials");
        var testimonialsLink = document.querySelector('a.nav-link[href="#testimonials"]');
        if (testimonialsSection) testimonialsSection.hidden = true;
        if (testimonialsLink && testimonialsLink.parentElement) {
            testimonialsLink.parentElement.hidden = true;
        }
    }

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

    /* ------------------------------------------------------------------
       Skills - single source of truth for the Technologies & Tools grid
       pct is the target width; featured adds a subtle accent border.
       Icons are inline official brand SVGs (single filled path, site teal).
       ------------------------------------------------------------------ */
    var skills = [
        { name: "HTML5", pct: 95, color: "#E34F26", icon: "M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" },
        { name: "CSS3", pct: 92, color: "#1572B6", icon: "M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" },
        { name: "TypeScript", pct: 88, color: "#3178C6", icon: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" },
        { name: "JavaScript", pct: 90, color: "#F7DF1E", icon: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" },
        { name: "React", pct: 90, featured: true, color: "#61DAFB", icon: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" },
        { name: "Next.js", pct: 82, icon: "M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z" },
        { name: "Tailwind CSS", pct: 92, color: "#06B6D4", icon: "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" },
        { name: "Node.js", pct: 85, color: "#5FA04E", icon: "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695,2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" },
        { name: "Express.js", pct: 85, icon: "M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z" },
        { name: "MongoDB", pct: 82, color: "#47A248", icon: "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" },
        { name: "Firebase", pct: 85, color: "#FFCA28", icon: "M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" },
        { name: "Shopify", pct: 88, featured: true, color: "#96BF48", icon: "M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" },
        { name: "Liquid", pct: 82, color: "#0EA5E9", icon: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" },
        { name: "REST APIs", pct: 88, view: "0 -960 960 960", icon: "M480-375 375-480l105-105 105 105-105 105Zm-85-294-83-83 126-126q9-9 20-13t22-4q11 0 22 4t20 13l126 126-83 83-85-85-85 85ZM208-312 82-438q-9-9-13-20t-4-22q0-11 4-22t13-20l126-126 83 83-85 85 85 85-83 83Zm544 0-83-83 85-85-85-85 83-83 126 126q9 9 13 20t4 22q0 11-4 22t-13 20L752-312ZM438-82 312-208l83-83 85 85 85-85 83 83L522-82q-9 9-20 13t-22 4q-11 0-22-4t-20-13Z" },
        { name: "Git & GitHub", pct: 90, icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
        { name: "Redux", pct: 85, color: "#764ABC", icon: "M16.634 16.504c.87-.075 1.543-.84 1.5-1.754-.047-.914-.796-1.648-1.709-1.648h-.061a1.71 1.71 0 00-1.648 1.769c.03.479.226.869.494 1.153-1.048 2.038-2.621 3.536-5.005 4.795-1.603.838-3.296 1.154-4.944.93-1.378-.195-2.456-.81-3.116-1.799-.988-1.499-1.078-3.116-.255-4.734.6-1.17 1.499-2.023 2.099-2.443a9.96 9.96 0 01-.42-1.543C-.868 14.408-.416 18.752.932 20.805c1.004 1.498 3.057 2.456 5.304 2.456.6 0 1.23-.044 1.843-.194 3.897-.749 6.848-3.086 8.541-6.532zm5.348-3.746c-2.32-2.728-5.738-4.226-9.634-4.226h-.51c-.253-.554-.837-.899-1.498-.899h-.045c-.943 0-1.678.81-1.647 1.753.03.898.794 1.648 1.708 1.648h.074a1.69 1.69 0 001.499-1.049h.555c2.309 0 4.495.674 6.488 1.992 1.527 1.005 2.622 2.323 3.237 3.897.538 1.288.509 2.547-.045 3.597-.855 1.647-2.294 2.517-4.196 2.517-1.199 0-2.367-.375-2.967-.644-.36.298-.96.793-1.394 1.093 1.318.598 2.652.943 3.94.943 2.922 0 5.094-1.647 5.919-3.236.898-1.798.824-4.824-1.47-7.416zM6.49 17.042c.03.899.793 1.648 1.708 1.648h.06a1.688 1.688 0 001.648-1.768c0-.9-.779-1.647-1.693-1.647h-.06c-.06 0-.15 0-.226.029-1.243-2.098-1.768-4.347-1.572-6.772.12-1.828.72-3.417 1.797-4.735.9-1.124 2.593-1.68 3.747-1.708 3.236-.061 4.585 3.971 4.689 5.574l1.498.45C17.741 3.197 14.686.62 11.764.62 9.02.62 6.49 2.613 5.47 5.535 4.077 9.43 4.991 13.177 6.7 16.174c-.15.195-.24.539-.21.868z" }
    ];

    function renderSkills() {
        var grid = document.querySelector(".skills-grid");
        if (!grid) return;

        var frag = document.createDocumentFragment();
        skills.forEach(function (skill) {
            var card = document.createElement("article");
            card.className = "skill-card reveal" + (skill.featured ? " skill-card--featured" : "");

            var head = document.createElement("div");
            head.className = "skill-card-head";

            var icon = document.createElement("span");
            icon.className = "skill-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.innerHTML = '<svg viewBox="' + (skill.view || "0 0 24 24") + '" aria-hidden="true" focusable="false"><path fill="' + (skill.color || "currentColor") + '" d="' + skill.icon + '"/></svg>';

            var name = document.createElement("h3");
            name.className = "skill-name";
            name.textContent = skill.name;

            var pct = document.createElement("span");
            pct.className = "skill-pct";
            pct.textContent = skill.pct + "%";

            head.appendChild(icon);
            head.appendChild(name);
            head.appendChild(pct);

            var track = document.createElement("div");
            track.className = "skill-bar-track";
            track.setAttribute("role", "progressbar");
            track.setAttribute("aria-valuemin", "0");
            track.setAttribute("aria-valuemax", "100");
            track.setAttribute("aria-valuenow", String(skill.pct));
            track.setAttribute("aria-label", skill.name + " - " + skill.pct + "% proficiency");

            var fill = document.createElement("span");
            fill.className = "skill-bar-fill";
            fill.dataset.progress = String(skill.pct);

            track.appendChild(fill);
            card.appendChild(head);
            card.appendChild(track);
            frag.appendChild(card);
        });

        grid.appendChild(frag);
    }

    renderSkills();

    revealStagger();
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

    /* ------------------------------------------------------------------
       Hero rotating typewriter (Shopify / Liquid / Full-Stack JS)
       ------------------------------------------------------------------ */
    var typeRole = document.getElementById("type-role");
    var typeAnnounce = document.getElementById("type-announce");
    var roles = ["Shopify Developer", "Liquid & Theme Developer", "Frontend Developer", "MERN Stack Developer", "Web Developer"];

    if (typeRole) {
        if (prefersReducedMotion) {
            // static first role â€” no typing, no timers
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
        var href = a.getAttribute("href");
        if (!href || href.charAt(0) !== "#") return null;
        try {
            return document.querySelector(href);
        } catch (e) {
            return null;
        }
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
       Handled by js/projects.js (shared project UI: renderer + tabs +
       sliding indicator + animated panel switching).
       ------------------------------------------------------------------ */

    /* ------------------------------------------------------------------
       Contact form validation (fake submission)
       ------------------------------------------------------------------ */
    var form = document.getElementById("contact-form");

    if (form) {
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

    var formSubmitting = false;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (formSubmitting) return;

        var fields = ["name", "email", "projectType", "message"];
        var valid = true;
        fields.forEach(function (name) {
            var input = form.querySelector("[name='" + name + "']");
            if (!validateField(input)) valid = false;
        });

        if (!valid) {
            var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
            if (firstError) {
                var ptFocus = firstError.id === "project-type" ?
                    document.getElementById("project-type-trigger") : null;
                (ptFocus || firstError).focus();
            }
            return;
        }

        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
        if (errorMsg) errorMsg.hidden = true;
        if (successMsg) successMsg.hidden = true;
        formSubmitting = true;
        var btnLabel = submitBtn.querySelector(".btn-label");
        var btnLabelText = btnLabel.textContent;
        btnLabel.textContent = "Sending...";

        var payload = {};
        fields.forEach(function (name) {
            payload[name] = form.querySelector("[name='" + name + "']").value.trim();
        });
        var ptSelect = form.querySelector("#project-type");
        payload.subject = ptSelect.value
            ? ptSelect.options[ptSelect.selectedIndex].text.trim()
            : "General Inquiry";

        fetch(CONTACT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (!res.ok) {
                var failureMessage;
                if (res.status === 400) failureMessage = "Please check your information and try again.";
                else if (res.status === 429) failureMessage = RATE_LIMIT_MESSAGE;
                else failureMessage = PROVIDER_ERROR_MESSAGE;
                console.error("Contact form API error:", res.status, res.statusText);
                try {
                    res.clone().text().then(function (body) {
                        console.error("Contact form API response:", body);
                    }).catch(function () {});
                } catch (e) { /* response already consumed */ }
                formSubmitting = false;
                btnLabel.textContent = btnLabelText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "";
                if (errorMsg) {
                    errorMsg.textContent = failureMessage;
                    errorMsg.hidden = false;
                }
                return;
            }
            formSubmitting = false;
            btnLabel.textContent = btnLabelText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
            console.log("Contact form sent successfully:", res.status, CONTACT_API_URL);
            form.reset();
            if (successMsg) {
                successMsg.textContent = SUCCESS_MESSAGE;
                successMsg.hidden = false;
            }
            setTimeout(function () {
                if (successMsg) successMsg.hidden = true;
            }, 5000);
        }).catch(function (error) {
            console.error("Contact form request failed:", error);
            formSubmitting = false;
            btnLabel.textContent = btnLabelText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
            if (errorMsg) {
                errorMsg.textContent = PROVIDER_ERROR_MESSAGE;
                errorMsg.hidden = false;
            }
        });
    });
    }

    /* ------------------------------------------------------------------
       Custom Project Type dropdown (combobox)
       The hidden native <select id="project-type"> stays the form's real
       control for validation and submission; the visible combobox mirrors
       every selection into it, so the existing logic is unchanged.
       ------------------------------------------------------------------ */
    var projectType = document.getElementById("project-type");
    var ptTrigger = document.getElementById("project-type-trigger");
    var ptList = document.getElementById("project-type-list");
    var ptValueEl = document.getElementById("project-type-value");
    var ptField = document.getElementById("project-type-field");
    var ptLabel = document.getElementById("project-type-label");

    if (projectType && ptTrigger && ptList && ptValueEl) {
        var ptCloseTimer = 0;
        var ptActiveIndex = -1;
        var ptOpenState = false;
        var ptAnimToken = 0;

        function ptOptions() {
            return Array.prototype.slice.call(ptList.children);
        }

        function ptIsOpen() {
            return ptOpenState;
        }

        function ptSyncInvalid() {
            if (projectType.getAttribute("aria-invalid") === "true") {
                ptTrigger.setAttribute("aria-invalid", "true");
            } else {
                ptTrigger.removeAttribute("aria-invalid");
            }
        }

        function ptSyncLabel() {
            var opt = projectType.options[projectType.selectedIndex] || projectType.options[0];
            ptValueEl.textContent = opt.textContent.trim();
            ptValueEl.classList.toggle("is-empty", !opt.value);
            ptOptions().forEach(function (item) {
                var selected = item.dataset.value === projectType.value;
                item.classList.toggle("is-selected", selected);
                item.setAttribute("aria-selected", String(selected));
            });
            ptSyncInvalid();
        }

        function ptSetActive(index) {
            var opts = ptOptions();
            if (!opts.length) return;
            index = (index + opts.length) % opts.length;
            opts.forEach(function (item, i) {
                item.classList.toggle("is-active", i === index);
            });
            ptActiveIndex = index;
            ptTrigger.setAttribute("aria-activedescendant", opts[index].id);
            if (opts[index].scrollIntoView) opts[index].scrollIntoView({ block: "nearest" });
        }

        function ptClearActive() {
            ptOptions().forEach(function (item) {
                item.classList.remove("is-active");
            });
            ptActiveIndex = -1;
        }

        function ptOpen() {
            if (ptIsOpen()) return;
            var opts = ptOptions();
            ptOpenState = true;
            ptList.hidden = false;
            ptTrigger.setAttribute("aria-expanded", "true");
            ptTrigger.classList.add("is-open");
            var selected = 0;
            opts.forEach(function (item, i) {
                if (item.dataset.value === projectType.value) selected = i;
            });
            var token = ++ptAnimToken;
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    if (token !== ptAnimToken) return;
                    ptList.classList.add("is-open");
                });
            });
            ptSetActive(selected);
        }

        function ptClose() {
            if (!ptIsOpen()) return;
            ptOpenState = false;
            ptAnimToken += 1;
            clearTimeout(ptCloseTimer);
            ptList.classList.remove("is-open");
            ptTrigger.setAttribute("aria-expanded", "false");
            ptTrigger.classList.remove("is-open");
            ptTrigger.removeAttribute("aria-activedescendant");
            var delay = prefersReducedMotion ? 0 : 210;
            ptCloseTimer = setTimeout(function () {
                ptList.hidden = true;
                ptClearActive();
            }, delay);
        }

        function ptSelect(item) {
            if (!item) return;
            projectType.value = item.dataset.value;
            projectType.dispatchEvent(new Event("change", { bubbles: true }));
            ptValueEl.textContent = item.textContent.trim();
            ptValueEl.classList.remove("is-empty");
            ptOptions().forEach(function (el) {
                var selected = el === item;
                el.classList.toggle("is-selected", selected);
                el.setAttribute("aria-selected", String(selected));
            });
            ptSyncInvalid();
            ptClose();
            ptTrigger.focus();
        }

        // Build options once from the native select (single source of truth).
        Array.prototype.forEach.call(projectType.options, function (opt, i) {
            if (!opt.value) return;
            var item = document.createElement("li");
            item.id = "project-type-opt-" + i;
            item.className = "project-type__option";
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", "false");
            item.textContent = opt.textContent;
            item.dataset.value = opt.value;
            ptList.appendChild(item);
        });

        ptTrigger.addEventListener("click", function () {
            if (ptIsOpen()) ptClose();
            else ptOpen();
        });

        ptTrigger.addEventListener("keydown", function (event) {
            var opts = ptOptions();
            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    if (!ptIsOpen()) { ptOpen(); return; }
                    ptSetActive(ptActiveIndex + 1);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    if (!ptIsOpen()) {
                        ptOpen();
                        ptSetActive(opts.length - 1);
                        return;
                    }
                    ptSetActive(ptActiveIndex - 1);
                    break;
                case "Enter":
                case " ":
                    event.preventDefault();
                    if (!ptIsOpen()) { ptOpen(); return; }
                    ptSelect(opts[ptActiveIndex]);
                    break;
                case "Escape":
                    if (ptIsOpen()) {
                        event.preventDefault();
                        ptClose();
                    }
                    break;
                case "Home":
                    if (ptIsOpen()) { event.preventDefault(); ptSetActive(0); }
                    break;
                case "End":
                    if (ptIsOpen()) { event.preventDefault(); ptSetActive(opts.length - 1); }
                    break;
                case "Tab":
                    if (ptIsOpen()) ptClose();
                    break;
            }
        });

        // Keep focus on the combobox while picking (blur shouldn't fight selection).
        ptList.addEventListener("pointerdown", function (event) {
            event.preventDefault();
        });
        ptList.addEventListener("click", function (event) {
            var item = event.target.closest ? event.target.closest(".project-type__option") : null;
            if (item) ptSelect(item);
        });

        // Click / tap outside the field closes the dropdown.
        document.addEventListener("pointerdown", function (event) {
            if (!ptIsOpen()) return;
            if (ptField && ptField.contains(event.target)) return;
            ptClose();
        });

        // Clicking the label opens the dropdown like a regular field label.
        if (ptLabel) {
            ptLabel.addEventListener("click", function (event) {
                event.preventDefault();
                ptTrigger.focus();
                ptOpen();
            });
        }

        // Blur validates with the same rules as the other fields.
        ptTrigger.addEventListener("blur", function () {
            if (ptField && ptField.contains(document.activeElement)) return;
            validateField(projectType);
            ptSyncInvalid();
        });

        // Keep the visible combobox in sync when the form is reset.
        // (Chrome fires the reset event before applying control defaults,
        //  so defer the read until after the native reset completes.)
        form.addEventListener("reset", function () {
            setTimeout(ptSyncLabel, 0);
        });

        ptSyncLabel();
    }

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
        var cursorTrail = document.querySelector(".cursor-trail");
        var CURSOR_TARGETS = "a, button, [role='button'], select, textarea, summary, input, .tab-btn, .chip, .tag, .nav-link, .btn";

        if (cursorDot && cursorRing) {
            document.documentElement.classList.add("custom-cursor");

            var targetX = -100;
            var targetY = -100;
            var dotX = -100;
            var dotY = -100;
            var ringX = -100;
            var ringY = -100;
            var trailX = -100;
            var trailY = -100;
            var trailOpacity = 0;

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
                if (cursorTrail) {
                    trailX += (targetX - trailX) * 0.16;
                    trailY += (targetY - trailY) * 0.16;
                    var trailDist = Math.hypot(targetX - trailX, targetY - trailY);
                    var trailGoal = Math.min(1, trailDist / 110) * 0.65;
                    trailOpacity += (trailGoal - trailOpacity) * 0.12;
                    cursorTrail.style.opacity = trailOpacity;
                    cursorTrail.style.transform =
                        "translate3d(" + trailX + "px, " + trailY + "px, 0) translate(-50%, -50%)";
                }
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
                if (cursorTrail) {
                    trailX = targetX;
                    trailY = targetY;
                    trailOpacity = 0;
                    cursorTrail.style.opacity = 0;
                    cursorTrail.style.transform =
                        "translate3d(" + trailX + "px, " + trailY + "px, 0) translate(-50%, -50%)";
                }
                placeCursor();
            });

            requestAnimationFrame(tickCursor);
        }
    }

    /* ------------------------------------------------------------------
       7. INTERACTIVE BACKGROUND PARTICLES (canvas layer behind content)
       Subtle teal particle/orbit field that reacts to mouse movement:
       nearby particles are softly pushed away, a delicate parallax sways
       the field, faint connecting lines appear, and everything fades to
       near-invisible a moment after the mouse stops.
       Pure visual layer (pointer-events: none) — the custom cursor above
       is intentionally untouched. Disabled on coarse/touch pointers,
       small screens (<641px), and reduced-motion.
       ------------------------------------------------------------------ */
    var bgCanvas = document.getElementById("bg-canvas");

    if (bgCanvas && FINE_POINTER && !prefersReducedMotion) {
        var bgfx = (function () {
            var ctx = bgCanvas.getContext("2d");
            var dpr = Math.max(1, window.devicePixelRatio || 1);
            var w = 1;
            var h = 1;
            var tier = 0;               // 0 desktop, 1 tablet (reduced)
            var countScale = 1;
            var forceScale = 1;
            var lineDist = 110;
            var particles = [];
            var sprite = null;          // prerendered teal glow sprite
            var spriteSize = 0;

            var palette = { r: 0, g: 229, b: 183, lineBase: 0.11, partMul: 1 };

            function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

            function isLightTheme() {
                return document.documentElement.getAttribute("data-theme") === "light";
            }

            function readAccentRgb() {
                var c = getComputedStyle(document.documentElement);
                var hex = (c.getPropertyValue("--accent") || "#00E5B7").trim();
                var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return m
                    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
                    : { r: 0, g: 229, b: 183 };
            }

            function buildSprite() {
                spriteSize = 96;
                sprite = document.createElement("canvas");
                sprite.width = spriteSize;
                sprite.height = spriteSize;
                var c = sprite.getContext("2d");
                var r = spriteSize / 2;
                var peak = isLightTheme() ? 0.28 : 0.55;
                var grad = c.createRadialGradient(r, r, 0, r, r, r);
                grad.addColorStop(0, "rgba(" + palette.r + "," + palette.g + "," + palette.b + "," + peak + ")");
                grad.addColorStop(0.45, "rgba(" + palette.r + "," + palette.g + "," + palette.b + "," + (peak * 0.32).toFixed(3) + ")");
                grad.addColorStop(1, "rgba(" + palette.r + "," + palette.g + "," + palette.b + ",0)");
                c.fillStyle = grad;
                c.fillRect(0, 0, spriteSize, spriteSize);
            }

            function refreshPalette() {
                var rgb = readAccentRgb();
                var light = isLightTheme();
                palette.r = rgb.r;
                palette.g = rgb.g;
                palette.b = rgb.b;
                palette.lineBase = light ? 0.045 : 0.11;
                palette.partMul = light ? 0.7 : 1;
                buildSprite();
            }

            function makeParticle() {
                var star = Math.random() < 0.12;
                var x = 8 + Math.random() * (w - 16);
                var y = 8 + Math.random() * (h - 16);
                return {
                    homeX: x, homeY: y,
                    x: x, y: y,
                    r: star ? 1.5 + Math.random() * 1.3 : 0.6 + Math.random() * 1.0,
                    depth: 0.45 + Math.random(),
                    phase: Math.random() * Math.PI * 2,
                    dR: 0.6 + Math.random() * 0.9,
                    alpha: star ? 0.8 : 0.26 + Math.random() * 0.26,
                    star: star,
                    breathe: Math.random() * Math.PI * 2,
                    tw: 0.0011 + Math.random() * 0.0016
                };
            }

            function rebuild() {
                var target = Math.round(((w * h) / 11000) * countScale);
                var count = clamp(target, Math.round(26 * countScale), Math.round(78 * countScale));
                particles = [];
                for (var i = 0; i < count; i += 1) particles.push(makeParticle());
            }

            function resize() {
                var nw = window.innerWidth;
                var nh = window.innerHeight;
                var prevTier = tier;
                if (nw < 641) {
                    tier = -1;
                    particles = [];
                    return;
                }
                tier = nw >= 1024 ? 0 : 1;
                if (prevTier !== tier) {
                    countScale = tier === 0 ? 1 : 0.6;
                    forceScale = tier === 0 ? 1 : 0.7;
                    lineDist = tier === 0 ? 110 : 92;
                }
                w = nw;
                h = nh;
                bgCanvas.width = Math.round(w * dpr);
                bgCanvas.height = Math.round(h * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                rebuild();
            }

            /* --- mouse state ------------------------------------------------- */
            var mouseX = -1e4, mouseY = -1e4;
            var lerpX = -1e4, lerpY = -1e4;
            var parX = 0, parY = 0;
            var activity = 0.15;
            var activityTarget = 0.15;
            var lastMove = 0;

            window.addEventListener("pointermove", function (event) {
                mouseX = event.clientX;
                mouseY = event.clientY;
                lastMove = performance.now();
                activityTarget = 1;
            }, { passive: true });

            document.documentElement.addEventListener("mouseleave", function () {
                mouseX = -1e4;
                mouseY = -1e4;
                activityTarget = 0.15;
            });

            /* --- theme changes ------------------------------------------------ */
            var themeObserver = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i += 1) {
                    if (mutations[i].attributeName === "data-theme") refreshPalette();
                }
            });
            themeObserver.observe(document.documentElement, { attributes: true });

            /* --- frame loop ---------------------------------------------------- */
            var rafId = 0;
            var lastNow = 0;

            function update(dt, time) {
                if (time - lastMove > 2500) activityTarget = 0.15;
                activity += (activityTarget - activity) * 0.045;

                lerpX += (mouseX - lerpX) * 0.16;
                lerpY += (mouseY - lerpY) * 0.16;

                parX += ((mouseX / w - 0.5) * 34 - parX) * 0.05;
                parY += ((mouseY / h - 0.5) * 26 - parY) * 0.05;

                var R = 120 * (tier === 0 ? 1 : 0.85);
                var R2 = R * R;
                var n = particles.length;
                for (var i = 0; i < n; i += 1) {
                    var p = particles[i];
                    var pushX = 0;
                    var pushY = 0;
                    if (mouseX >= 0) {
                        var dx = p.x - mouseX;
                        var dy = p.y - mouseY;
                        var d2 = dx * dx + dy * dy;
                        if (d2 < R2 && d2 > 0.0001) {
                            var d = Math.sqrt(d2);
                            var f = (1 - d / R) * 40 * forceScale * (0.6 + 0.4 * p.depth);
                            pushX = (dx / d) * f;
                            pushY = (dy / d) * f;
                        }
                    }
                    var driftX = Math.sin(time * 0.00055 + p.phase) * p.dR * 0.35;
                    var driftY = Math.cos(time * 0.0006 + p.phase) * p.dR * 0.35;
                    var tX = p.homeX + pushX + parX * p.depth + driftX;
                    var tY = p.homeY + pushY + parY * p.depth + driftY;
                    p.x += (tX - p.x) * 0.075;
                    p.y += (tY - p.y) * 0.075;
                }
            }

            function draw(time) {
                ctx.clearRect(0, 0, w, h);
                var n = particles.length;
                var vis = 0.25 + 0.75 * activity;
                var i, j, p, q, dx, dy, d2, a, alpha;
                ctx.lineCap = "round";

                // soft glow behind the occasional "star" particles
                for (i = 0; i < n; i += 1) {
                    p = particles[i];
                    if (!p.star) continue;
                    alpha = p.alpha * vis * (0.82 + 0.18 * Math.sin(time * p.tw + p.breathe));
                    ctx.globalAlpha = alpha;
                    a = p.r * 5.5;
                    ctx.drawImage(sprite, p.x - a / 2, p.y - a / 2, a, a);
                }
                ctx.globalAlpha = 1;

                // faint connecting lines between close particles
                var lineVis = 0.12 + 0.88 * activity;
                ctx.strokeStyle = "rgba(" + palette.r + "," + palette.g + "," + palette.b + ",0.005)";
                for (i = 0; i < n; i += 1) {
                    p = particles[i];
                    for (j = i + 1; j < n; j += 1) {
                        q = particles[j];
                        dx = p.x - q.x;
                        dy = p.y - q.y;
                        d2 = dx * dx + dy * dy;
                        if (d2 > 0 && d2 < lineDist * lineDist) {
                            a = (1 - Math.sqrt(d2) / lineDist) * palette.lineBase * lineVis;
                            ctx.strokeStyle = "rgba(" + palette.r + "," + palette.g + "," + palette.b + "," + a.toFixed(3) + ")";
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(q.x, q.y);
                            ctx.stroke();
                        }
                    }
                }

                // the particles themselves
                for (i = 0; i < n; i += 1) {
                    p = particles[i];
                    alpha = p.alpha * vis * palette.partMul;
                    if (p.star) alpha *= 0.85 + 0.15 * Math.sin(time * p.tw + p.breathe);
                    if (alpha < 0.015) continue;
                    ctx.fillStyle = "rgba(" + palette.r + "," + palette.g + "," + palette.b + "," + alpha.toFixed(3) + ")";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            function frame(now) {
                rafId = requestAnimationFrame(frame);
                if (document.hidden) return;
                if (!lastNow) lastNow = now;
                var dt = (now - lastNow) / 1000;
                lastNow = now;
                if (dt <= 0 || dt > 0.1) dt = 0.016;
                update(dt, now);
                draw(now);
                window.__bgFX.count = particles.length;
                window.__bgFX.activity = activity;
                window.__bgFX.size[0] = w;
                window.__bgFX.size[1] = h;
                window.__bgFX.palette = "rgba(" + palette.r + "," + palette.g + "," + palette.b + ")";
            }

            document.addEventListener("visibilitychange", function () {
                if (document.hidden) {
                    cancelAnimationFrame(rafId);
                    lastNow = 0;
                } else {
                    rafId = requestAnimationFrame(frame);
                }
            });

            var resizeTimer = 0;
            window.addEventListener("resize", function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(resize, 200);
            }, { passive: true });

            refreshPalette();
            resize();

            var instance = {
                active: true,
                count: 0,
                activity: 0,
                palette: "rgba(0,229,183)",
                size: [0, 0],
                particles: function () {
                    return particles.map(function (p) {
                        return { x: p.x, y: p.y, r: p.r, star: p.star };
                    });
                }
            };
            window.__bgFX = instance;
            rafId = requestAnimationFrame(frame);
        })();
    }
})();