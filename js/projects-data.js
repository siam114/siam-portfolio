/* ==========================================================================
   Siam.Dev - Projects data (single source of truth)
   ==========================================================================
   Add or remove a project by editing this array ONLY.

   Fields:
     id          unique string id
     title       project name
     category    "shopify" | "custom"
     categoryLabel optional card badge override (defaults: Shopify / Custom Website)
     description short card description (aim for ~45-65 words for even card heights)
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
            description: "Premium flameless-candle eCommerce storefront built on Shopify with a refined, editorial luxury aesthetic. Custom theme development, organized collection pages, feature-led product education around real-wax textures, realistic flicker, and timer settings, plus a conversion-optimized checkout flow — all responsive and performance-friendly across desktop and mobile.",
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
            description: "Premium Shopify beauty and skincare storefront with custom theme development and tailored homepage and product sections. Responsive design, smart product and collection organization, an interactive product-finder quiz, custom bundle functionality, and subscription integration via Seal Subscriptions — all built to make repeat purchase effortless.",
            image: "assets/images/beeldschoon.svg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Seal Subscriptions"],
            liveUrl: "https://0j8fpv-pi.myshopify.com/",
            githubUrl: null
        },
        {
            id: "midnights-menagerie",
            title: "Midnights Menagerie",
            category: "shopify",
            description: "Premium Shopify pet e-commerce storefront featuring custom homepage sections built with Liquid, thoughtful product and collection organization, and brand storytelling. Fully responsive with an integrated customer-reviews system, FAQ section, blog, and newsletter capture — everything arranged around a calm, pet-owner-friendly buying experience with clear categories and trust-building content.",
            image: "assets/images/midnights-menagerie.svg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://midnightsmenagerie.com/",
            githubUrl: null
        },
        {
            id: "iyush-naturals",
            title: "Iyush Naturals",
            category: "shopify",
            description: "I designed and customized this Shopify store for a natural soap and personal care brand using the Ella theme. I customized the storefront with a clean, responsive design and implemented unique custom sections to create a more engaging, brand-focused shopping experience across every page — from the homepage and collections to the product pages.",
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
            description: "Simple, elegant Shopify storefront for a handcrafted clay and pottery brand. Customized presentations for the homepage, products, and collections keep the design clean and minimal, clear navigation makes browsing easy, and a smooth, responsive shopping experience works comfortably on mobile — with clean product presentation so the handmade goods shine while checkout stays straightforward.",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://mudhavi.com/",
            githubUrl: null
        },
        {
            id: "livia-diamonds",
            title: "Livia Diamonds",
            category: "shopify",
            description: "Shopify optimization project for an existing jewellery storefront — fixing storefront bugs and errors, updating outdated plugins, and cleaning up theme code for better performance and loading speed, while reorganizing collections and categories so customers can browse more easily. The result is a faster, tidier storefront that keeps the brand look intact.",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://shopliviadiamonds.com/",
            githubUrl: null
        },
        {
            id: "runners-dust",
            title: "Runners Dust",
            category: "shopify",
            description: "Single-product Shopify storefront designed for a focused product launch. It features a custom pre-order system with a dedicated pre-order form and a streamlined purchasing flow, a product-focused homepage and page layout, and responsive, mobile-friendly design that keeps the launch experience clean and direct.",
            tags: ["Shopify", "Liquid", "Pre-Order System", "Responsive Design"],
            liveUrl: "https://www.runnersdust.com/",
            githubUrl: null
        },
        {
            id: "khadija",
            title: "Khadija",
            category: "shopify",
            description: "Practice Shopify storefront for a Burka/Abaya fashion brand. Clean product presentation through organized collections, clear navigation, and a simple cart and checkout flow make it a useful exercise in building a lightweight, brand-true e-commerce experience for a niche fashion market.",
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
            description: "Modern real estate landing page designed from Figma and built from scratch with HTML, CSS, and JavaScript. Structured section layouts, a clean visual hierarchy, and modern UI components — navigation, hero, property listings, and FAQ — combine with custom JavaScript interactions and a fully responsive experience for a smooth, polished user journey.",
            image: "assets/images/homez.svg",
            tags: ["HTML5", "CSS3", "JavaScript"],
            liveUrl: "https://homez-landing-page-theta.vercel.app/",
            githubUrl: "https://github.com/siam114/Homez-landing-page"
        },
        {
            id: "software-chamber-portfolio",
            title: "Software Chamber Portfolio",
            category: "custom",
            description: "Modern company portfolio website designed and developed as a job task using Next.js, React, TypeScript, and Tailwind CSS. It delivers a clean, responsive interface with professional visual hierarchy, modern UI sections, and smooth interactions — built as a complete, polished marketing site for a software company.",
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            liveUrl: "https://software-chamber-portfolio-website.vercel.app/",
            githubUrl: "https://github.com/siam114/software-chamber-portfolio-website"
        },
        {
            id: "cineverse",
            title: "CineVerse",
            category: "custom",
            description: "CineVerse is a modern movie-themed homepage built as a practice project to improve my Figma-to-frontend implementation skills. It translates a visual design into a responsive interface with a hero banner, trending and featured movie sections, movie cards with ratings, and a working search bar — built with React, Vite, Tailwind CSS, and Axios.",
            tags: ["React", "Vite", "Tailwind CSS", "Axios"],
            liveUrl: "https://cine-verse-flax.vercel.app/",
            githubUrl: "https://github.com/siam114/CineVerse-"
        }
    ];
})();