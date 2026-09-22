/* ==========================================================================
   Siam.Dev - Shared site layout (single source of truth for Navbar + Footer)
   Injected into <header data-layout="header"> / <footer data-layout="footer">
   on every page so the Navbar and Footer are never duplicated.

   Page detection:
     - body[data-page="home"]    (default) -> brand/nav links use #hash in-page anchors
     - body[data-page="projects"]          -> brand/nav links resolve to index.html#hash (root-level page) via data-base
   -------------------------------------------------------------------------- */
(function () {
    "use strict";

    var page = document.body.getAttribute("data-page") || "home";
    var BASE = document.documentElement.getAttribute("data-base") || document.body.getAttribute("data-base") || "";
    function pin(hash) {
        return page === "home" ? "#" + hash : BASE + "index.html#" + hash;
    }
    function homeUrl() {
        return page === "home" ? "#home" : BASE + "index.html";
    }

    var ICONS = {
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" /></svg>',
        about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>',
        services: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M8 12l-4 4v3h3l4-4 2 2 5-5-2-2-3 3-2-2Z" /></svg>',
        portfolio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1.5" /><rect width="7" height="7" x="14" y="3" rx="1.5" /><rect width="7" height="7" x="14" y="14" rx="1.5" /><rect width="7" height="7" x="3" y="14" rx="1.5" /></svg>',
        skills: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M6.34 17.66l-2.83 2.83" /><path d="M19.07 4.93l-2.83 2.83" /></svg>',
        process: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></svg>',
        testimonials: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 1 9 9c-1.6 0-3.1-.4-4.4-1.1L3 21l1.1-4.6A8.9 8.9 0 0 1 3 12Z" /><path d="M9 9h6M9 13h4" /></svg>',
        contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>'
    };

    var NAV = [
        { key: "home", label: "Home" },
        { key: "about", label: "About" },
        { key: "services", label: "Services" },
        { key: "portfolio", label: "Projects" },
        { key: "skills", label: "Skills" },
        { key: "process", label: "Process" },
        { key: "testimonials", label: "Testimonials" },
        { key: "contact", label: "Contact" }
    ];

    function brand(href, ariaLabel, markSize) {
        return (
            '<a href="' + href + '" class="brand" aria-label="' + ariaLabel + '">' +
            '<span class="brand-mark" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="' + markSize + '" height="' + markSize + '">' +
            '<path d="M12 2 2 7l10 5 10-5-10-5Z" />' +
            '<path d="M2 17 12 22l10-5" />' +
            '<path d="M2 12 12 17l10-5" />' +
            '</svg></span>' +
            '<span class="brand-name">Siam<em>.</em><small>dev</small></span>' +
            '</a>'
        );
    }

    function navLinks() {
        var lis = NAV.map(function (item) {
            var isProjectsPage = page === "projects" && item.key === "portfolio";
            var href = isProjectsPage ? BASE + "projects.html" : pin(item.key);
            var currentPage = "";
            if (isProjectsPage) {
                currentPage = ' class="nav-link-current" aria-current="page"';
            } else if (page === "home" && item.key === "home") {
                currentPage = ' class="nav-link active"';
            } else {
                currentPage = ' class="nav-link"';
            }
            return (
                "<li>" +
                '<a href="' + href + '"' + currentPage + ">" +
                ICONS[item.key] +
                item.label + "</a>" +
                "</li>"
            );
        }).join("");

        return (
            '<ul class="nav-links" id="nav-links">' +
            '<li class="nav-drawer-head">' +
            '<span class="drawer-avatar" aria-hidden="true">S</span>' +
            '<span class="drawer-user"><strong>Siam</strong><small>Shopify Developer</small></span>' +
            '<button class="drawer-close" id="drawer-close" type="button" aria-label="Close menu">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>' +
            "</button></li>" +
            lis +
            "</ul>"
        );
    }

    function themeToggle() {
        return (
            '<button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to light theme" aria-pressed="false">' +
            '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>' +
            '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>' +
            "</button>"
        );
    }

    function navToggle() {
        return (
            '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">' +
            '<svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="22" height="22"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>' +
            '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="22" height="22"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>' +
            "</button>"
        );
    }

    function header() {
        return (
            '<nav class="navbar container" aria-label="Primary">' +
            brand(homeUrl(), page === "home" ? "Siam.Dev — home" : "Siam.Dev — back to top", 18) +
            navLinks() +
            '<div class="nav-right">' +
            '<a href="' + pin("contact") + '" class="btn btn-primary btn-sm nav-cta">Let\'s Talk</a>' +
            '<div class="nav-actions">' +
            themeToggle() +
            navToggle() +
            "</div></div></nav>"
        );
    }

    function footer() {
        var socials = [
            { label: "LinkedIn", href: "https://www.linkedin.com/in/sm-siam598", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>' },
            { label: "GitHub", href: "https://github.com/siam114", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>' },
            { label: "WhatsApp", href: "https://wa.me/8801567989506", svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>' },
            { label: "Facebook", href: "https://www.facebook.com/sumsuzzaman.siam", svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="17" height="17"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>' }
        ].map(function (s) {
            return '<li><a href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + s.label + '">' + s.svg + "</a></li>";
        }).join("");

        return (
            '<div class="container footer-inner">' +
            '<div class="footer-brand">' +
            brand(homeUrl(), "Siam.Dev — back to top", 18) +
            '<p class="footer-tagline">Shopify Developer · MERN-Stack Developer · Frontend Developer</p>' +
            "</div>" +
            '<nav class="footer-nav" aria-label="Footer navigation">' +
            '<a href="' + pin("home") + '">Home</a>' +
            '<a href="' + pin("about") + '">About</a>' +
            '<a href="' + pin("services") + '">Services</a>' +
            '<a href="' + pin("portfolio") + '">Portfolio</a>' +
            '<a href="' + pin("process") + '">Process</a>' +
            '<a href="' + pin("contact") + '">Contact</a>' +
            "</nav>" +
            '<ul class="footer-socials">' + socials + "</ul>" +
            "</div>" +
            '<div class="footer-bottom">' +
            '<p class="copyright">© <span id="copyright-year">' + new Date().getFullYear() + "</span> Siam.Dev. All rights reserved.</p>" +
            "</div>"
        );
    }

    var headerAnchor = document.querySelector('[data-layout="header"]');
    var footerAnchor = document.querySelector('[data-layout="footer"]');

    if (headerAnchor) {
        headerAnchor.outerHTML = '<header class="site-header" id="site-header">' + header() + "</header>";
    }
    if (footerAnchor) {
        footerAnchor.outerHTML = '<footer class="site-footer" aria-label="Footer">' + footer() + "</footer>";
    }

    })();