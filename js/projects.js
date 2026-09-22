/* ==========================================================================
   Siam.Dev - Projects UI (shared by homepage + All Projects page)
   --------------------------------------------------------------------------
   Renders project cards from js/projects-data.js (window.SIAM_PROJECTS).

   Homepage  : fills #panel-shopify / #panel-custom and wires the static
               .tabs (Shopify | Custom) with a sliding active indicator and
               an animated cross-fade + height-morph panel switch.
   /projects : builds the .tabs (All | <categories>) from the data, filters
               the single #panel-all grid, same indicator + switch animation.

   Button rules
     - shopify : single "Live" button
     - custom  : "GitHub" then "Live", each rendered only when the URL exists

   Accessibility/semantics preserved exactly as before:
     role=tab / aria-selected / aria-controls / hidden / .is-active
   ========================================================================== */
(function () {
    "use strict";

    var BASE = document.documentElement.getAttribute("data-base") || document.body.getAttribute("data-base") || "";
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var PANEL_IN_MS = 200;
    var HEIGHT_MS = 300;

    /* ---------------------------------------------------------------- */
    /* Data helpers                                                       */
    /* ---------------------------------------------------------------- */
    function dataList() { return window.SIAM_PROJECTS || []; }

    function categories() {
        var seen = [];
        dataList().forEach(function (p) {
            if (seen.indexOf(p.category) === -1) seen.push(p.category);
        });
        return seen;
    }

    function listFor(key) {
        if (!key || key === "all") return dataList().slice();
        return dataList().filter(function (p) { return p.category === key; });
    }

    function titleCase(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    /* ---------------------------------------------------------------- */
    /* Card rendering                                                     */
    /* ---------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------- */
    /* Tabs: sliding indicator + smooth animated switching                */
    /* ---------------------------------------------------------------- */
    function ensureIndicator(tabsEl) {
        var ind = tabsEl.querySelector(".tab-indicator");
        if (!ind) {
            ind = document.createElement("span");
            ind.className = "tab-indicator";
            ind.setAttribute("aria-hidden", "true");
            tabsEl.insertBefore(ind, tabsEl.firstChild);
        }
        return ind;
    }

    function positionIndicator(tabsEl, btn) {
        var ind = tabsEl.querySelector(".tab-indicator");
        if (!ind || !btn) return;
        var tabsRect = tabsEl.getBoundingClientRect();
        var btnRect = btn.getBoundingClientRect();
        var borderX = (tabsEl.clientLeft || 0);
        ind.style.left = Math.round(btnRect.left - tabsRect.left - borderX) + "px";
        ind.style.width = Math.round(btnRect.width) + "px";
    }

    function scrollTabsIntoView(tabsEl, btn) {
        if (tabsEl.scrollWidth > tabsEl.clientWidth + 1) {
            var target = Math.max(0, btn.offsetLeft - tabsEl.clientWidth / 2 + btn.offsetWidth / 2);
            tabsEl.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
        }
    }

    function morphHeight(el, oldH, newH) {
        if (!el || !oldH) return;
        el.classList.add("is-swapping");
        el.style.height = oldH + "px";
        void el.offsetHeight;
        el.style.height = newH + "px";
        window.setTimeout(function () { el.style.height = ""; }, HEIGHT_MS + 60);
        window.setTimeout(function () { el.classList.remove("is-swapping"); }, HEIGHT_MS + 420);
    }

    function wireTabs(container, mode) {
        var tabsEl = container.querySelector(".tabs");
        if (!tabsEl) return;

        var isProjects = mode === "projects";
        ensureIndicator(tabsEl);

        /* Build buttons for the All Projects page (All + categories). */
        var buttons = Array.prototype.slice.call(tabsEl.querySelectorAll('[role="tab"]'));
        if (isProjects) {
            buttons.forEach(function (b) { b.remove(); });
            buttons = [];
            var keys = ["all"].concat(categories());
            keys.forEach(function (key) {
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "tab-btn";
                btn.id = "tab-" + key;
                btn.setAttribute("role", "tab");
                btn.setAttribute("data-tab", key);
                btn.setAttribute("aria-selected", "false");
                btn.setAttribute("aria-controls", "panel-all");
                btn.textContent = key === "all" ? "All" : titleCase(key);
                tabsEl.appendChild(btn);
                buttons.push(btn);
            });
        }

        var panels = Array.prototype.slice.call(container.querySelectorAll(".projects-grid[data-panel]"));
        var swap = null;
        if (isProjects) {
            swap = panels[0] ? panels[0].closest(".projects-swap") : null;
        } else if (panels.length > 1) {
            swap = document.createElement("div");
            swap.className = "projects-swap";
            var holder = panels[0].parentNode;
            holder.insertBefore(swap, panels[0]);
            panels.forEach(function (p) { swap.appendChild(p); });
        }

        var activeKey = null;
        var initial = buttons.filter(function (b) {
            return b.classList.contains("active") || b.getAttribute("aria-selected") === "true";
        })[0] || buttons[0] || null;
        if (!initial) return;
        initial.classList.add("active");
        initial.setAttribute("aria-selected", "true");
        activeKey = initial.dataset.tab || "all";

        function activate(btn) {
            var key = btn.dataset.tab || "all";
            buttons.forEach(function (b) {
                var on = b === btn;
                b.classList.toggle("active", on);
                b.setAttribute("aria-selected", String(on));
            });
            activeKey = key;
            positionIndicator(tabsEl, btn);
            scrollTabsIntoView(tabsEl, btn);
        }

        function restartEntrance(panelEl) {
            panelEl.classList.remove("is-active");
            void panelEl.offsetHeight;
            panelEl.classList.add("is-active");
        }

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var key = btn.dataset.tab || "all";
                if (key === activeKey) {
                    activate(btn);
                    return;
                }
                activate(btn);

                if (isProjects) {
                    var panel = panels[0];
                    panel.classList.add("is-leaving");
                    var oldH = panel.offsetHeight;
                    window.setTimeout(function () {
                        panel.classList.remove("is-leaving");
                        renderProjects(panel, listFor(key));
                        restartEntrance(panel);
                        if (swap) morphHeight(swap, oldH, panel.offsetHeight);
                    }, PANEL_IN_MS);
                } else {
                    var current = panels.filter(function (p) {
                        return !p.hidden && p.classList.contains("is-active");
                    })[0] || panels.filter(function (p) { return !p.hidden; })[0] || null;
                    var next = panels.filter(function (p) { return p.dataset.panel === key; })[0];
                    if (!current || !next || current === next) return;

                    current.classList.add("is-leaving");
                    var oldH = current.offsetHeight;
                    window.setTimeout(function () {
                        current.classList.remove("is-active");
                        current.classList.remove("is-leaving");
                        current.hidden = true;
                        next.classList.add("is-active");
                        next.hidden = false;
                        if (swap) morphHeight(swap, oldH, next.offsetHeight);
                    }, PANEL_IN_MS);
                }
            });
        });

        var onResize = function () {
            var active = tabsEl.querySelector(".tab-btn.active") || buttons[0];
            positionIndicator(tabsEl, active);
        };
        window.addEventListener("resize", onResize);
        window.addEventListener("load", onResize);
    }

    /* ---------------------------------------------------------------- */
    /* Boot                                                               */
    /* ---------------------------------------------------------------- */
    function boot() {
        var shopify = document.getElementById("panel-shopify");
        var custom = document.getElementById("panel-custom");
        var all = document.getElementById("panel-all");

        var container;
        if (all) {
            container = all.closest(".container") || all.parentNode;
            var tabsHost = container.querySelector(".tabs");
            if (!tabsHost) {
                tabsHost = document.createElement("div");
                tabsHost.className = "tabs";
                tabsHost.setAttribute("role", "tablist");
                tabsHost.setAttribute("aria-label", "Project categories");
                container.insertBefore(tabsHost, all.closest(".projects-swap") || all);
            }
            renderProjects(all, listFor("all"));
            wireTabs(container, "projects");
            var active = container.querySelector(".tab-btn.active") || container.querySelector('[role="tab"]');
            if (active) positionIndicator(container.querySelector(".tabs"), active);
            return;
        }

        if (!window.SIAM_PROJECTS || !shopify) return;
        container = shopify.closest(".container") || shopify.parentNode;
        renderProjects(shopify, listFor("shopify"));
        renderProjects(custom, listFor("custom"));
        wireTabs(container, "home");
        var activeBtn = (container.querySelector(".tabs") || document).querySelector(".tab-btn.active");
        var tabs = container.querySelector(".tabs");
        if (tabs && activeBtn) positionIndicator(tabs, activeBtn);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();