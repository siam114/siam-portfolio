/* ==========================================================================
   Siam.Dev - Projects data (single source of truth)
   ==========================================================================
   Add or remove a project by editing this array ONLY.
   New projects are always appended at the END of the array (that is the display order).

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
            image: "assets/images/beeldschoon.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Seal Subscriptions"],
            liveUrl: "https://0j8fpv-pi.myshopify.com/",
            githubUrl: null
        },
        {
            id: "iyush-naturals",
            title: "Iyush Naturals",
            category: "shopify",
            description: "I designed and customized this Shopify store for a natural soap and personal care brand using the Ella theme. I customized the storefront with a clean, responsive design and implemented unique custom sections to create a more engaging, brand-focused shopping experience across every page — from the homepage and collections to the product pages.",
            image: "assets/images/iyush.jpeg",
            tags: ["Shopify", "Ella Theme", "Liquid", "Custom Sections", "Responsive Design"],
            liveUrl: "https://iyushnaturals.com/",
            githubUrl: null
        },
        {
            id: "rede-coverte",
            title: "Rede Coverte",
            category: "shopify",
            description: "This Shopify store was designed and customized for a rental business in France that provides room and home essentials for flexible rental periods of 1, 3, and 6 months. I customized the storefront based on the client's requirements, built a custom product page experience, and created a tailored inquiry/contact form using Hulk Form Builder.",
            image: "assets/images/rede.jpeg",
            tags: ["Shopify", "Liquid", "Hulk Form Builder", "Custom Product Page", "Responsive Design"],
            liveUrl: "https://redecoverte.fr/",
            githubUrl: null
        },
        {
            id: "mudhavi",
            title: "Mudhavi",
            category: "shopify",
            description: "Simple, elegant Shopify storefront for a handcrafted clay and pottery brand. Customized presentations for the homepage, products, and collections keep the design clean and minimal, clear navigation makes browsing easy, and a smooth, responsive shopping experience works comfortably on mobile — with clean product presentation so the handmade goods shine while checkout stays straightforward.",
            image: "assets/images/mudhavi.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://mudhavi.com/",
            githubUrl: null
        },
        {
            id: "livia-diamonds",
            title: "Livia Diamonds",
            category: "shopify",
            description: "Shopify optimization project for an existing jewellery storefront — fixing storefront bugs and errors, updating outdated plugins, and cleaning up theme code for better performance and loading speed, while reorganizing collections and categories so customers can browse more easily. The result is a faster, tidier storefront that keeps the brand look intact.",
            image: "assets/images/livia.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://shopliviadiamonds.com/",
            githubUrl: null
        },
        {
            id: "runners-dust",
            title: "Runners Dust",
            category: "shopify",
            description: "Single-product Shopify storefront designed for a focused product launch. It features a custom pre-order system with a dedicated pre-order form and a streamlined purchasing flow, a product-focused homepage and page layout, and responsive, mobile-friendly design that keeps the launch experience clean and direct.",
            image: "assets/images/runners.jpeg",
            tags: ["Shopify", "Liquid", "Pre-Order System", "Responsive Design"],
            liveUrl: "https://www.runnersdust.com/",
            githubUrl: null
        },
        {
            id: "khadija",
            title: "Khadija",
            category: "shopify",
            description: "Practice Shopify storefront for a Burka/Abaya fashion brand. Clean product presentation through organized collections, clear navigation, and a simple cart and checkout flow make it a useful exercise in building a lightweight, brand-true e-commerce experience for a niche fashion market.",
            image: "assets/images/khadija.jpeg",
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
            image: "assets/images/homez.jpeg",
            tags: ["HTML5", "CSS3", "JavaScript"],
            liveUrl: "https://homez-landing-page-theta.vercel.app/",
            githubUrl: "https://github.com/siam114/Homez-landing-page"
        },
        {
            id: "software-chamber-portfolio",
            title: "Software Chamber Portfolio",
            category: "custom",
            description: "Modern company portfolio website designed and developed as a job task using Next.js, React, TypeScript, and Tailwind CSS. It delivers a clean, responsive interface with professional visual hierarchy, modern UI sections, and smooth interactions — built as a complete, polished marketing site for a software company.",
            image: "assets/images/chamber.jpeg",
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            liveUrl: "https://software-chamber-portfolio-website.vercel.app/",
            githubUrl: "https://github.com/siam114/software-chamber-portfolio-website"
        },
        {
            id: "cineverse",
            title: "CineVerse",
            category: "custom",
            description: "CineVerse is a modern movie-themed homepage built as a practice project to improve my Figma-to-frontend implementation skills. It translates a visual design into a responsive interface with a hero banner, trending and featured movie sections, movie cards with ratings, and a working search bar — built with React, Vite, Tailwind CSS, and Axios.",
            image: "assets/images/cineverse.jpeg",
            tags: ["React", "Vite", "Tailwind CSS", "Axios"],
            liveUrl: "https://cine-verse-flax.vercel.app/",
            githubUrl: "https://github.com/siam114/CineVerse-"
        },
        {
            id: "ancestral-and-more",
            title: "Ancestral & More",
            category: "shopify",
            description: "Premium Shopify eCommerce store for handcrafted clay cookware and traditional pottery, built around a warm, heritage-inspired storefront. Custom Liquid sections present artisan-made products through curated collections, thoughtful product storytelling, and clean, responsive layouts — delivering a smooth, seamless shopping experience that feels as considered as the cookware itself.",
            image: "assets/images/ancestral.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://ancestralandmore.com/",
            githubUrl: null
        },
        {
            id: "skull-and-bogeys",
            title: "Skull & Bogeys Golf Co.",
            category: "shopify",
            description: "Premium Shopify golf apparel and accessories store featuring performance golf polos, stylish clothing, headwear, and golfing essentials. A modern, sport-inspired storefront pairs curated collections with premium product presentation and clean, responsive layouts — creating a purpose-driven brand experience that feels polished and easy to shop across desktop and mobile.",
            image: "assets/images/skull-and-bogeys.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "E-commerce", "Apparel"],
            liveUrl: "https://www.skullandbogeys.com/",
            githubUrl: null
        },
        {
            id: "cabtex-llc",
            title: "CABTEX LLC",
            category: "shopify",
            description: "Professional Shopify wholesale clothing store featuring premium men's and women's apparel, denim, and accessories. A custom storefront design pairs clean collection organization with a B2B wholesale setup and Shopify POS integration — streamlining both online and in-store retail operations through a polished, responsive experience built for buyers and retail partners alike.",
            image: "assets/images/cabtex.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Wholesale B2B", "Shopify POS"],
            liveUrl: "https://www.cabtexllc.com/",
            githubUrl: null
        },
        {
            id: "milestones-elite-performance",
            title: "Milestones Elite Performance",
            category: "custom",
            description: "Professional youth mental performance website helping young athletes build confidence, focus, discipline, and resilience. Dedicated experiences for parents, coaches, and athletic directors showcase coaching programs, mental training resources, and the signature 10-Second Reset technique — delivered through a modern, engaging, fully responsive design that supports the brand's mission and peak performance.",
            image: "assets/images/milestones.jpeg",
            tags: ["UI/UX Design", "Web Design", "HTML", "CSS", "JavaScript", "Responsive Design"],
            liveUrl: "https://milestoneseliteperformance.com/",
            githubUrl: null
        },
        {
            id: "opticamd",
            title: "OpticaMD – Dr. Rudrani Banik",
            category: "shopify",
            description: "Shopify rebrand and development project for Dr. Rudrani Banik, transforming Ageless by Dr. Rani into OpticaMD. Built a storefront with seven products and four bundles, product, collection, About, Contact, FAQ, and educational pages, an Eye-Q quiz with CRM integration and subscriptions, plus SEO, performance optimization, analytics, and post-launch support for a seamless, conversion-focused experience.",
            image: "assets/images/opticamd.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "CRO", "Subscription Integration", "CRM Integration", "Performance Optimization"],
            liveUrl: "https://www.opticamd.com/",
            githubUrl: null
        },
        {
            id: "bonded-boutique",
            title: "Bonded Boutique",
            category: "shopify",
            description: "Premium Shopify fashion eCommerce store featuring a curated selection of international clothing brands, women's fashion, and lifestyle products. A modern, elegant storefront with organized collections, catalog management for 15–20 brands and roughly 300 SKUs, Exact Online integration through xCore for inventory synchronization, and WhatsApp marketing for customer engagement and retention.",
            image: "assets/images/bonded-boutique.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Exact Online", "xCore Integration", "Product Management", "E-commerce"],
            liveUrl: "https://www.bonded-boutique.nl/",
            githubUrl: null
        }
    ];
})();