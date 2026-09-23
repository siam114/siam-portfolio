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
            description: "Premium Shopify pet e-commerce storefront featuring custom homepage sections, product and collection organization, brand storytelling, responsive design, customer reviews, FAQ, blog, and newsletter integration.",
            image: "assets/images/midnights-menagerie.svg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://midnightsmenagerie.com/",
            githubUrl: null
        },
        {
            id: "iyush-naturals",
            title: "Iyush Naturals",
            category: "shopify",
            description: "I designed and customized this Shopify store for a natural soap and personal care brand using the Ella Shopify theme. I customized the storefront with a clean, responsive design and implemented unique custom sections to create a more engaging and brand-focused shopping experience.",
            tags: ["Shopify", "Ella Theme", "Liquid", "Custom Sections", "Responsive Design"],
            liveUrl: "https://iyushnaturals.com/",
            githubUrl: null
        },
        {
            id: "rede-coverte",
            title: "Rede Coverte",
            category: "shopify",
            description: "This Shopify store was designed and customized for a rental business in France that provides room and home essentials for flexible rental periods of 1, 3, and 6 months. I customized the storefront based on the client's requirements, built a custom product page experience, and created a tailored inquiry/contact form using Hulk Form Builder.",
            tags: ["Shopify", "Liquid", "Hulk Form Builder", "Custom Product Page", "Responsive Design"],
            liveUrl: "https://redecoverte.fr/",
            githubUrl: null
        },
        {
            id: "mudhavi",
            title: "Mudhavi",
            category: "shopify",
            description: "Simple and elegant Shopify storefront for a handcrafted clay and pottery brand, focused on clean product presentation, easy navigation, and a smooth shopping experience.",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://mudhavi.com/",
            githubUrl: null
        },
        {
            id: "livia-diamonds",
            title: "Livia Diamonds",
            category: "shopify",
            description: "Shopify optimization project focused on fixing storefront bugs and errors, improving category organization, and optimizing the store for better performance and loading speed.",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://shopliviadiamonds.com/",
            githubUrl: null
        },
        {
            id: "runners-dust",
            title: "Runners Dust",
            category: "shopify",
            description: "Single-product Shopify storefront designed for a focused product launch, featuring a custom pre-order system, product-focused layout, responsive design, and a streamlined purchasing experience.",
            tags: ["Shopify", "Liquid", "Pre-Order System", "Responsive Design"],
            liveUrl: "https://www.runnersdust.com/",
            githubUrl: null
        },
        {
            id: "khadija",
            title: "Khadija",
            category: "shopify",
            description: "Practice Shopify storefront for a Burka/Abaya fashion brand, focused on clean product presentation, responsive design, and a simple e-commerce shopping experience.",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://khadija-fp0qev1g.myshopify.com/password",
            password: "1",
            showPassword: true,
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
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            liveUrl: "https://software-chamber-portfolio-website.vercel.app/",
            githubUrl: "https://github.com/siam114/software-chamber-portfolio-website"
        },
        {
            id: "cineverse",
            title: "CineVerse",
            category: "custom",
            description: "CineVerse is a modern movie-themed homepage built as a practice project to improve my Figma-to-frontend implementation skills - translating a visual design into a responsive, polished, and user-friendly web interface.",
            tags: ["React", "Vite", "Tailwind CSS", "Axios"],
            liveUrl: "https://cine-verse-flax.vercel.app/",
            githubUrl: "https://github.com/siam114/CineVerse-"
        }
    ];
})();