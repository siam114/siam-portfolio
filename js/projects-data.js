/* ==========================================================================
   Siam.Dev - Projects data (single source of truth)
   ==========================================================================
   Add or remove a project by editing this array ONLY.

   Fields:
     id          unique string id
     title       project name
     category    "shopify" | "custom"
     categoryLabel optional card badge override (defaults: Shopify / Custom Website)
     description short card description
     image       path relative to the site root (assets/images/...)
     tags        tech stack shown on the card
     liveUrl     opens in a new tab (Shopify: required; Custom: optional)
     githubUrl   Custom projects only - omitted/null hides the GitHub button

   Category rules:
     - "shopify" : liveUrl required, githubUrl stays null
     - "custom"  : githubUrl and liveUrl, each optional (missing = button hidden)

   Images live in assets/images/. Add the file yourself, then point image at it.
   ========================================================================== */
(function () {
    "use strict";

    window.SIAM_PROJECTS = [
        {
            id: "getambira",
            title: "Getambira",
            category: "shopify",
            description: "Premium flameless-candle eCommerce storefront with a refined, editorial luxury aesthetic. Custom Shopify theme, collection pages, feature-led product education (real-wax, flicker, timer) and a conversion-optimized checkout flow.",
            image: "assets/images/getambira.png",
            tags: ["Shopify", "Liquid", "JavaScript", "CSS", "Responsive"],
            liveUrl: "https://getambira.com/",
            githubUrl: null,
            imgW: 1200,
            imgH: 900
        },
        {
            id: "beeldschoon",
            title: "Beeldschoon",
            category: "shopify",
            description: "Premium Shopify beauty and skincare storefront with custom theme development, responsive design, product organization, quiz, custom bundle functionality, and subscription integration.",
            image: "assets/images/beeldschoon.svg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Seal Subscriptions"],
            liveUrl: "https://0j8fpv-pi.myshopify.com/",
            githubUrl: null
        },
        {
            id: "midnights-menagerie",
            title: "Midnights Menagerie",
            category: "shopify",
            description: "Premium Shopify pet e-commerce storefront featuring custom homepage sections, product and collection organization, brand storytelling, responsive design, testimonials, FAQ, blog, and newsletter integration.",
            image: "assets/images/midnights-menagerie.svg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://midnightsmenagerie.com/",
            githubUrl: null
        },
        {
            id: "homez",
            title: "Homez",
            category: "custom",
            categoryLabel: "Custom Website / Landing Page",
            description: "Modern real estate landing page designed from Figma and built from scratch with HTML, CSS, and JavaScript - clean, responsive, with structured layouts, modern UI components, and smooth UX.",
            image: "assets/images/homez.svg",
            tags: ["HTML5", "CSS3", "JavaScript"],
            liveUrl: "https://homez-landing-page-theta.vercel.app/",
            githubUrl: "https://github.com/siam114/Homez-landing-page"
        },
        {
            id: "software-chamber-portfolio",
            title: "Software Chamber Portfolio",
            category: "custom",
            description: "Modern company portfolio website designed and developed as a job task - a clean, responsive interface, professional visual hierarchy, modern UI sections, and smooth interactions for a software company.",
            image: "assets/images/software-chamber-portfolio.png",
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            liveUrl: "https://software-chamber-portfolio-website.vercel.app/",
            githubUrl: "https://github.com/siam114/software-chamber-portfolio-website",
            imgW: 1200,
            imgH: 900
        },
        {
            id: "cineverse",
            title: "CineVerse",
            category: "custom",
            description: "CineVerse is a modern movie-themed homepage built as a practice project to improve my Figma-to-frontend implementation skills - translating a visual design into a responsive, polished, and user-friendly web interface.",
            image: "assets/images/cineverse.png",
            tags: ["React", "Vite", "Tailwind CSS", "Axios"],
            liveUrl: "https://cine-verse-flax.vercel.app/",
            githubUrl: "https://github.com/siam114/CineVerse-",
            imgW: 1200,
            imgH: 900
        }
    ];
})();