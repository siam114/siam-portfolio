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
            description: "Premium flameless-candle Shopify storefront with a refined, editorial luxury aesthetic. Custom theme work, organized collections, feature-led product education around realistic flicker and timer settings, plus a conversion-focused, responsive checkout flow.",
            image: "assets/images/getambira.png",
            tags: ["Shopify", "Liquid", "JavaScript", "CSS", "Responsive"],
            liveUrl: "https://getambira.com/",
            githubUrl: null,
            imgW: 1600,
            imgH: 900
        },
        {
            id: "beeldschoon",
            title: "Beeldschoon",
            category: "shopify",
            description: "Premium Shopify beauty and skincare storefront with custom theme development and tailored homepage and product sections. Responsive layouts, smart product organization, an interactive product-finder quiz, custom bundles, and Seal Subscriptions integration.",
            image: "assets/images/beeldschoon.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Seal Subscriptions"],
            liveUrl: "https://0j8fpv-pi.myshopify.com/",
            githubUrl: null
        },
        {
            id: "iyush-naturals",
            title: "Iyush Naturals",
            category: "shopify",
            description: "I designed and customized this Shopify store for a natural soap and personal care brand using the Ella theme. A clean, responsive storefront with custom sections creates an engaging, brand-focused shopping experience across every page.",
            image: "assets/images/iyush.jpeg",
            tags: ["Shopify", "Ella Theme", "Liquid", "Custom Sections", "Responsive Design"],
            liveUrl: "https://iyushnaturals.com/",
            githubUrl: null
        },
        {
            id: "rede-coverte",
            title: "Rede Coverte",
            category: "shopify",
            description: "Shopify store designed and customized for a French rental business providing room and home essentials for flexible 1, 3, and 6-month periods. Includes a tailored product page experience and a custom inquiry form built with Hulk Form Builder.",
            image: "assets/images/rede.jpeg",
            tags: ["Shopify", "Liquid", "Hulk Form Builder", "Custom Product Page", "Responsive Design"],
            liveUrl: "https://redecoverte.fr/",
            githubUrl: null
        },
        {
            id: "mudhavi",
            title: "Mudhavi",
            category: "shopify",
            description: "Simple, elegant Shopify storefront for a handcrafted clay and pottery brand. Customized homepage, product, and collection presentations keep the design clean and minimal, while clear navigation and a smooth, responsive experience let the handmade goods shine.",
            image: "assets/images/mudhavi.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://mudhavi.com/",
            githubUrl: null
        },
        {
            id: "livia-diamonds",
            title: "Livia Diamonds",
            category: "shopify",
            description: "Shopify optimization project for an existing jewellery storefront — fixing bugs and errors, updating outdated plugins, and cleaning up theme code for better performance and loading speed, while reorganizing collections so customers can browse more easily.",
            image: "assets/images/livia.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://shopliviadiamonds.com/",
            githubUrl: null
        },
        {
            id: "runners-dust",
            title: "Runners Dust",
            category: "shopify",
            description: "Single-product Shopify storefront built for a focused product launch. Features a custom pre-order system with a dedicated form, a streamlined purchasing flow, and a product-focused, responsive layout that keeps the launch experience clean and direct.",
            image: "assets/images/runners.jpeg",
            tags: ["Shopify", "Liquid", "Pre-Order System", "Responsive Design"],
            liveUrl: "https://www.runnersdust.com/",
            githubUrl: null
        },
        {
            id: "khadija",
            title: "Khadija",
            category: "shopify",
            description: "Practice Shopify storefront for a Burka/Abaya fashion brand. Clean product presentation through organized collections, clear navigation, and a simple cart and checkout flow create a lightweight, brand-true e-commerce experience for a niche fashion market.",
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
            description: "Modern real estate landing page designed from Figma and built from scratch with HTML, CSS, and JavaScript. Structured sections, a clean visual hierarchy, modern UI components, custom JavaScript interactions, and a fully responsive layout deliver a smooth, polished user journey.",
            image: "assets/images/homez.jpeg",
            tags: ["HTML5", "CSS3", "JavaScript"],
            liveUrl: "https://homez-landing-page-theta.vercel.app/",
            githubUrl: "https://github.com/siam114/Homez-landing-page"
        },
        {
            id: "software-chamber-portfolio",
            title: "Software Chamber Portfolio",
            category: "custom",
            description: "Company portfolio website designed and developed as a job task using Next.js, React, TypeScript, and Tailwind CSS. It delivers a clean, responsive interface with visual hierarchy, UI sections, and smooth interactions for a polished marketing site.",
            image: "assets/images/chamber.jpeg",
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            liveUrl: "https://software-chamber-portfolio-website.vercel.app/",
            githubUrl: "https://github.com/siam114/software-chamber-portfolio-website"
        },
        {
            id: "cineverse",
            title: "CineVerse",
            category: "custom",
            description: "CineVerse is a modern movie-themed homepage built as a practice project to improve my Figma-to-frontend skills. It translates a visual design into a responsive interface with a hero banner, trending and featured movie sections, movie cards, and a working search bar.",
            image: "assets/images/cineverse.jpeg",
            tags: ["React", "Vite", "Tailwind CSS", "Axios"],
            liveUrl: "https://cine-verse-flax.vercel.app/",
            githubUrl: "https://github.com/siam114/CineVerse-"
        },
        {
            id: "ancestral-and-more",
            title: "Ancestral & More",
            category: "shopify",
            description: "Premium Shopify store for handcrafted clay cookware and traditional pottery, with a warm, heritage-inspired storefront. Custom Liquid sections present artisan-made products through curated collections, thoughtful storytelling, and clean, responsive layouts.",
            image: "assets/images/ancestral.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
            liveUrl: "https://ancestralandmore.com/",
            githubUrl: null
        },
        {
            id: "skull-and-bogeys",
            title: "Skull & Bogeys Golf Co.",
            category: "shopify",
            description: "Shopify golf apparel and accessories store featuring performance polos, clothing, headwear, and golfing essentials. A modern, sport-inspired storefront pairs curated collections with product presentation and a purpose-driven, responsive brand experience.",
            image: "assets/images/skull-and-bogeys.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "E-commerce", "Apparel"],
            liveUrl: "https://www.skullandbogeys.com/",
            githubUrl: null
        },
        {
            id: "cabtex-llc",
            title: "CABTEX LLC",
            category: "shopify",
            description: "Professional Shopify wholesale clothing store featuring premium men's and women's apparel, denim, and accessories. A custom storefront with clean collection organization, B2B wholesale setup, and Shopify POS integration streamlines online and in-store retail operations.",
            image: "assets/images/cabtex.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Wholesale B2B", "Shopify POS"],
            liveUrl: "https://www.cabtexllc.com/",
            githubUrl: null
        },
        {
            id: "milestones-elite-performance",
            title: "Milestones Elite Performance",
            category: "shopify",
            description: "Youth mental performance website helping young athletes build confidence, focus, discipline, and resilience. Dedicated parent, coach, and athletic director experiences showcase coaching programs, training resources, and the 10-Second Reset technique.",
            image: "assets/images/milestones.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "UI/UX Design", "Responsive Design"],
            liveUrl: "https://milestoneseliteperformance.com/",
            githubUrl: null
        },
        {
            id: "opticamd",
            title: "OpticaMD – Dr. Rudrani Banik",
            category: "shopify",
            description: "Shopify rebrand and development project for Dr. Rudrani Banik, transforming Ageless by Dr. Rani into OpticaMD. Includes a custom storefront, seven products and four bundles, an Eye-Q quiz with CRM integration, subscriptions, SEO, and post-launch support.",
            image: "assets/images/opticamd.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "CRO", "Subscription Integration", "CRM Integration", "Performance Optimization"],
            liveUrl: "https://www.opticamd.com/",
            githubUrl: null
        },
        {
            id: "bonded-boutique",
            title: "Bonded Boutique",
            category: "shopify",
            description: "Premium Shopify fashion store featuring international clothing brands, women's fashion, and lifestyle products. Manages 15–20 brands and roughly 300 SKUs, with Exact Online integration through xCore for inventory sync and WhatsApp marketing for customer retention.",
            image: "assets/images/bonded-boutique.jpeg",
            tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "Exact Online", "xCore Integration", "Product Management", "E-commerce"],
            liveUrl: "https://www.bonded-boutique.nl/",
            githubUrl: null
        },
        {
            id: "nexus-agency",
            title: "Nexus Agency – Custom Website",
            category: "custom",
            description: "Modern, premium digital agency website built from scratch to showcase services, creative projects, and digital solutions. A sophisticated dark theme with smooth animations, interactive UI, responsive layouts, service and portfolio sections, team profiles, and contact functionality.",
            image: "assets/images/nexus-agency.jpeg",
            tags: ["Custom Website", "React", "JavaScript", "Node.js", "MongoDB", "UI/UX Design", "Responsive Design", "Full-Stack Development"],
            liveUrl: "https://nexusagency-five.vercel.app/",
            githubUrl: "https://github.com/siam114/nexus-agency"
        }
    ];
})();