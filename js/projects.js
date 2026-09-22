/* ==========================================================================
   Siam.Dev - Projects renderer
   Renders project cards from js/projects-data.js (window.SIAM_PROJECTS).

   - Homepage sections (#panel-shopify, #panel-custom) get a filtered
     category view.
   - The All Projects page (#panel-all) renders every project together.
   - Shopify cards: single "Live" button. Custom cards: "GitHub" then
     "Live", each rendered only when the URL exists.
   ========================================================================== */
(function () {
    "use strict";

    var BASE = document.documentElement.getAttribute("data-base") || document.body.getAttribute("data-base") || "";
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function createIcon(name) {
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("aria-hidden", "true");

        if (name === "github") {
            var p1 = document.createElementNS(ns, "path");
            p1.setAttribute("d", "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4");
            var p2 = document.createElementNS(ns, "path");
            p2.setAttribute("d", "M9 18c-4.51 2-5-2-7-2");
            svg.appendChild(p1);
            svg.appendChild(p2);
        } else {
            var e1 = document.createElementNS(ns, "path");
            e1.setAttribute("d", "M7 7h10v10");
            var e2 = document.createElementNS(ns, "path");
            e2.setAttribute("d", "M7 17 17 7");
            svg.appendChild(e1);
            svg.appendChild(e2);
        }
        return svg;
    }

    function actionButton(label, url, icon) {
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "btn btn-ghost btn-sm";
        a.appendChild(document.createTextNode(label + " "));
        a.appendChild(createIcon(icon));
        return a;
    }

    function categoryLabel(p) {
        if (p.categoryLabel) return p.categoryLabel;
        return p.category === "shopify" ? "Shopify" : "Custom Website";
    }

    function buildCard(p) {
        var article = document.createElement("article");
        article.className = "project-card reveal";

        var media = document.createElement("div");
        media.className = "project-media";

        var img = document.createElement("img");
        img.src = BASE + p.image;
        img.alt = p.title + " - " + categoryLabel(p) + " project";
        img.width = p.imgW || 800;
        img.height = p.imgH || 600;
        img.loading = "lazy";
        img.decoding = "async";

        var badge = document.createElement("span");
        badge.className = "project-cat";
        badge.textContent = categoryLabel(p);

        media.appendChild(img);
        media.appendChild(badge);

        var body = document.createElement("div");
        body.className = "project-body";

        var h3 = document.createElement("h3");
        h3.className = "project-title";
        h3.textContent = p.title;

        var desc = document.createElement("p");
        desc.className = "project-desc";
        desc.textContent = p.description;

        var tagsUl = document.createElement("ul");
        tagsUl.className = "tags";
        tagsUl.setAttribute("aria-label", "Technologies");
        (p.tags || []).forEach(function (t) {
            var li = document.createElement("li");
            li.textContent = t;
            tagsUl.appendChild(li);
        });

        var actions = document.createElement("div");
        actions.className = "project-actions";

        if (p.category === "shopify") {
            if (p.liveUrl) actions.appendChild(actionButton("Live", p.liveUrl, "external"));
        } else {
            if (p.githubUrl) actions.appendChild(actionButton("GitHub", p.githubUrl, "github"));
            if (p.liveUrl) actions.appendChild(actionButton("Live", p.liveUrl, "external"));
        }

        body.appendChild(h3);
        body.appendChild(desc);
        body.appendChild(tagsUl);
        body.appendChild(actions);

        article.appendChild(media);
        article.appendChild(body);
        return article;
    }

    /* Reveal for JS-rendered cards (mirrors the home page reveal system). */
    var revealObserver = null;
    function observeReveals(cards) {
        if (reducedMotion) {
            cards.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }
        if (!revealObserver) {
            revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        }
        cards.forEach(function (el, i) {
            el.style.setProperty("--d", Math.min(i, 6) * 90 + "ms");
            revealObserver.observe(el);
        });
    }

    function renderProjects(container, list) {
        if (!container) return;
        container.innerHTML = "";
        var cards = [];
        list.forEach(function (p) {
            var card = buildCard(p);
            cards.push(card);
            container.appendChild(card);
        });
        observeReveals(cards);
    }

    function boot() {
        var shopify = document.getElementById("panel-shopify");
        var custom = document.getElementById("panel-custom");
        var all = document.getElementById("panel-all");

        if (all) {
            var data = window.SIAM_PROJECTS || [];
            var shopifyList = data.filter(function (p) { return p.category === "shopify"; });
            var customList = data.filter(function (p) { return p.category === "custom"; });
            renderProjects(all, shopifyList.concat(customList));
        } else {
            if (!window.SIAM_PROJECTS) return;
            renderProjects(shopify, window.SIAM_PROJECTS.filter(function (p) { return p.category === "shopify"; }));
            renderProjects(custom, window.SIAM_PROJECTS.filter(function (p) { return p.category === "custom"; }));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();