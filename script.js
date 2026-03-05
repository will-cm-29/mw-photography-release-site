document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // DATA (replace with your real project galleries)
    // ============================================================
    const heroImages = [
        "assets/hero/hero-01.webp",
        "assets/hero/hero-02.webp",
        "assets/hero/hero-03.webp"
    ];

    const projects = {
        "boscombe-5-bed": {
            title: "5-Bed House — Boscombe",
            byline: "Holiday let / property marketing",
            description:
                "Interior and lifestyle-focused photography for a five-bedroom property in Boscombe, created for marketing and listing use. Coverage included key living spaces, kitchen, bathrooms, bedrooms, and standout amenity details.",
            hero: "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-living-2400.webp",
            gallery: [
                "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-living-2400.webp",
                "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-living2-2400.webp",
                "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-kitchen-2400.webp",
                "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-kitchen2-2400.webp",
                "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-bedroom-2400.webp",
                "assets/projects/commissioned/boscombe-5-bed/full/boscombe-5-bed-bathroom-2400.webp"
            ]
        },
        "bournemouth-9-bed": {
            title: "9-Bed House — Bournemouth",
            byline: "Large property / listing visuals",
            description:
                "Interior, dining, bedroom and drone photography for a nine-bedroom property in Bournemouth, produced for marketing and listing use. Coverage focused on key shared spaces, room layout clarity, and aerial context shots.",
            hero: "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-dining-2400.webp",
            gallery: [
                "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-dining-2400.webp",
                "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-dining2-2400.webp",
                "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-kitchen-2400.webp",
                "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-room-2400.webp",
                "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-dronef-2400.webp",
                "assets/projects/commissioned/bournemouth-9-bed/full/bournemouth-9-bed-droneb-2400.webp"
            ]
        }
    };

    // ============================================================
    // UTILITIES
    // ============================================================
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    let scrollLockCount = 0;
    let lastFocusedElement = null;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function lockScroll() {
        scrollLockCount += 1;
        if (scrollLockCount === 1) document.body.style.overflow = "hidden";
    }

    function unlockScroll() {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
        if (scrollLockCount === 0) document.body.style.overflow = "";
    }

    function formatGBP(n) {
        return `£${Number(n).toFixed(0)}`;
    }

    function trapFocus(container, event) {
        if (!container || event.key !== "Tab") return;

        const focusable = qsa(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
            container
        ).filter(el => el.offsetParent !== null);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function preloadImage(src) {
        if (!src) return;
        const img = new Image();
        img.src = src;
    }

    // ============================================================
    // MOBILE NAV
    // ============================================================
    const navToggle = qs("#navToggle");
    const mobileNav = qs("#mobileNav");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = mobileNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        qsa(".nav-link", mobileNav).forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            if (!mobileNav.classList.contains("is-open")) return;
            const insideNav = e.target.closest(".nav");
            if (!insideNav) {
                mobileNav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ============================================================
    // HERO CROSSFADE
    // ============================================================
    const slideA = qs(".hero-slide-a");
    const slideB = qs(".hero-slide-b");

    if (slideA && slideB && heroImages.length) {
        let index = 0;
        let showingA = true;

        slideA.style.backgroundImage = `url("${heroImages[0]}")`;
        slideA.style.opacity = "1";
        slideB.style.opacity = "0";

        if (!prefersReducedMotion && heroImages.length > 1) {
            slideA.style.transition = "opacity 1s ease";
            slideB.style.transition = "opacity 1s ease";

            setInterval(() => {
                index = (index + 1) % heroImages.length;
                const next = heroImages[index];

                if (showingA) {
                    slideB.style.backgroundImage = `url("${next}")`;
                    slideB.style.opacity = "1";
                    slideA.style.opacity = "0";
                } else {
                    slideA.style.backgroundImage = `url("${next}")`;
                    slideA.style.opacity = "1";
                    slideB.style.opacity = "0";
                }

                showingA = !showingA;
            }, 5200);
        }
    }

    // Footer year
    const yearEl = qs("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ============================================================
    // MODAL HELPERS
    // ============================================================
    function openDialog(overlayEl, panelEl) {
        if (!overlayEl || !panelEl) return;
        lastFocusedElement = document.activeElement;
        overlayEl.hidden = false;
        lockScroll();
        panelEl.focus();
    }

    function closeDialog(overlayEl) {
        if (!overlayEl || overlayEl.hidden) return;
        overlayEl.hidden = true;
        unlockScroll();
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    // ============================================================
    // ABOUT MODAL
    // ============================================================
    const aboutOverlay = qs("#aboutOverlay");
    const aboutPanel = qs(".overlay-about");
    const aboutOpenBtn = qs("#aboutOpen");

    const openAbout = () => openDialog(aboutOverlay, aboutPanel);
    const closeAbout = () => closeDialog(aboutOverlay);

    if (aboutOpenBtn) aboutOpenBtn.addEventListener("click", openAbout);
    qsa("[data-close-about]").forEach(el => el.addEventListener("click", closeAbout));

    // ============================================================
    // PROJECT MODAL
    // ============================================================
    const projectOverlay = qs("#projectOverlay");
    const projectPanel = qs(".overlay-project");
    const projectHero = qs("#projectModalHero");
    const projectByline = qs("#projectModalByline");
    const projectTitle = qs("#projectModalTitle");
    const projectDesc = qs("#projectModalDescription");
    const projectGallery = qs("#projectModalGallery");

    function renderProjectGallery(project) {
        if (!projectGallery) return;
        projectGallery.innerHTML = "";

        project.gallery.forEach((src, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `masonry-item${index % 3 === 1 ? " h2" : ""}`;
            btn.innerHTML = `<img src="${src}" data-full="${src}" alt="${project.title} image ${index + 1}" loading="lazy" decoding="async">`;
            btn.addEventListener("click", () => openLightbox(project.gallery, index, project.title));
            projectGallery.appendChild(btn);
        });
    }

    function openProject(projectId) {
        const project = projects[projectId];
        if (!project || !projectOverlay || !projectPanel) return;

        if (projectHero) {
            projectHero.src = project.hero || project.gallery[0] || "";
            projectHero.alt = project.title;
        }
        if (projectByline) projectByline.textContent = project.byline || "";
        if (projectTitle) projectTitle.textContent = project.title || "Project";
        if (projectDesc) projectDesc.textContent = project.description || "";

        renderProjectGallery(project);
        openDialog(projectOverlay, projectPanel);
    }

    function closeProject() {
        closeDialog(projectOverlay);
        if (projectHero) projectHero.src = "";
        if (projectGallery) projectGallery.innerHTML = "";
    }

    qsa(".project-card[data-project-id]").forEach(card => {
        card.addEventListener("click", () => openProject(card.dataset.projectId));
    });

    qsa("[data-close-project]").forEach(el => el.addEventListener("click", closeProject));

    // ============================================================
    // PORTFOLIO THUMB AUTO-WIRING (your current file pattern)
    // ============================================================
    const THUMB_SIZES = [800, 1600];
    const FULL_SIZE = 2400;

    function sizesForTile(btn) {
        const isWide = btn.classList.contains("w2");
        if (!isWide) {
            return "(max-width: 520px) 50vw, (max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw";
        }
        return "(max-width: 520px) 50vw, (max-width: 700px) 100vw, (max-width: 1000px) 66vw, 50vw";
    }

    function getPortfolioRoot(imgEl) {
        const masonry = imgEl.closest(".masonry");
        const gallery = masonry?.getAttribute("data-gallery") || "home1";
        return `assets/portfolio/${gallery}`;
    }

    function thumbSrc(root, base, w) {
        return `${root}/thumb/${base}-${w}.webp`;
    }

    function fullSrc(root, base) {
        return `${root}/full/${base}-${FULL_SIZE}.webp`;
    }

    qsa("#portfolio img[data-img]").forEach(img => {
        const base = img.getAttribute("data-img");
        const btn = img.closest(".masonry-item");
        if (!base || !btn) return;

        const root = getPortfolioRoot(img);

        img.src = thumbSrc(root, base, THUMB_SIZES[0]);
        img.srcset = THUMB_SIZES.map(w => `${thumbSrc(root, base, w)} ${w}w`).join(", ");
        img.sizes = sizesForTile(btn);
        img.loading = "lazy";
        img.decoding = "async";
        img.dataset.full = fullSrc(root, base);
    });

    // ============================================================
    // LIGHTBOX
    // ============================================================
    const lightbox = qs("#lightbox");
    const lightboxStage = qs(".lightbox-stage");
    const lightboxImg = qs("#lightboxImage");
    const lightboxCaption = qs("#lightboxCaption");
    const lightboxPrev = qs("#lightboxPrev");
    const lightboxNext = qs("#lightboxNext");

    let lightboxImages = [];
    let lightboxIndex = 0;
    let lightboxCaptionText = "";

    function renderLightbox() {
        if (!lightboxImg || !lightboxImages.length) return;

        const src = lightboxImages[lightboxIndex];
        lightboxImg.src = src;
        lightboxImg.alt = lightboxCaptionText || `Image ${lightboxIndex + 1}`;

        if (lightboxCaption) {
            lightboxCaption.textContent = `${lightboxCaptionText || "Image"} (${lightboxIndex + 1}/${lightboxImages.length})`;
        }

        preloadImage(lightboxImages[(lightboxIndex + 1) % lightboxImages.length]);
        preloadImage(lightboxImages[(lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length]);
    }

    function openLightbox(images, startIndex = 0, captionText = "") {
        if (!lightbox || !lightboxStage) return;
        lightboxImages = images.slice();
        lightboxIndex = Math.max(0, Math.min(startIndex, lightboxImages.length - 1));
        lightboxCaptionText = captionText;
        renderLightbox();
        openDialog(lightbox, lightboxStage);
    }

    function closeLightbox() {
        closeDialog(lightbox);
        if (lightboxImg) lightboxImg.src = "";
        lightboxImages = [];
        lightboxIndex = 0;
        lightboxCaptionText = "";
    }

    function nextLightbox() {
        if (!lightboxImages.length) return;
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        renderLightbox();
    }

    function prevLightbox() {
        if (!lightboxImages.length) return;
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        renderLightbox();
    }

    if (lightboxPrev) lightboxPrev.addEventListener("click", prevLightbox);
    if (lightboxNext) lightboxNext.addEventListener("click", nextLightbox);

    // Existing close buttons/backdrop hooks
    document.querySelectorAll("[data-lightbox-close]").forEach((el) => {
        el.addEventListener("click", closeLightbox);
    });

    // NEW: click-outside safety for lightbox (clicking empty side area closes)
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            // Close if clicking the outer container or the backdrop
            if (
                e.target === lightbox ||
                e.target.classList.contains("lightbox-backdrop")
            ) {
                closeLightbox();
                return;
            }

            // Close if clicking the stage but NOT on image/controls
            if (
                e.target.classList.contains("lightbox-stage") ||
                e.target.classList.contains("lightbox-figure")
            ) {
                closeLightbox();
            }
        });
    }

    // portfolio click wiring
    const portfolioGrid = qs("#portfolioGrid");
    if (portfolioGrid) {
        const items = qsa(".masonry-item", portfolioGrid);
        const fullList = items
            .map(btn => qs("img", btn))
            .map(img => img?.dataset.full || img?.src)
            .filter(Boolean);

        items.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                const img = qs("img", btn);
                const alt = img?.alt || "Portfolio image";
                openLightbox(fullList, index, alt);
            });
        });
    }

    // ============================================================
    // FIX 1: BACKDROP / CLICK-OUTSIDE CLOSE SAFETY
    // ============================================================
    projectOverlay?.addEventListener("click", (e) => {
        if (e.target === projectOverlay || e.target.classList.contains("overlay-backdrop")) {
            closeProject();
        }
    });

    aboutOverlay?.addEventListener("click", (e) => {
        if (e.target === aboutOverlay || e.target.classList.contains("overlay-backdrop")) {
            closeAbout();
        }
    });

    lightbox?.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-backdrop")) {
            closeLightbox();
        }
    });

    // ============================================================
    // QUOTE BUILDER
    // ============================================================
    const quoteBuilder = qs("#quoteBuilder");
    const estimateTotalEl = qs("#estimateTotal");
    const builderRequestQuoteBtn = qs("#builderRequestQuote");
    const builderResetBtn = qs("#builderReset");
    const builderPayDepositBtn = qs("#builderPayDeposit");

    const builderPropertyType = qs("#builderPropertyType");
    const builderSize = qs("#builderSize");
    const extraImagesInput = qs("#extraImages");

    const contactSection = qs("#contact");
    const contactServicesInput = qs("#servicesRequired");
    const contactMessage = qs("#message");
    const contactPropertyType = qs("#propertyType");

    const hiddenSelectedPackage = qs("#selectedPackage");
    const hiddenQuoteEstimate = qs("#quoteEstimate");
    const hiddenSelectedServicesJson = qs("#selectedServicesJson");

    function sizeKeyFromSelectValue(value) {
        switch (value) {
            case "small": return "priceSmall";
            case "medium": return "priceMedium";
            case "large": return "priceLarge";
            case "custom-images": return "priceCustom";
            default: return "priceMedium";
        }
    }

    function getBuilderSelections() {
        if (!quoteBuilder) return { services: [], total: 0 };

        const sizeKey = sizeKeyFromSelectValue(builderSize?.value || "medium");
        const checked = qsa('input[name="service"]:checked', quoteBuilder);

        let total = 0;
        const services = checked.map(input => {
            const amount = Number(input.dataset[sizeKey.toLowerCase()] ?? 0);
            total += amount;
            return { name: input.value, price: amount };
        });

        const extraImages = Math.max(0, Number(extraImagesInput?.value || 0));
        if (extraImages > 0) {
            const extraTotal = extraImages * 5;
            total += extraTotal;
            services.push({ name: `Extra edited photos (${extraImages})`, price: extraTotal });
        }

        return { services, total };
    }

    function syncHiddenQuoteFields({ services, total, selectedPackage = "" }) {
        if (hiddenSelectedPackage) hiddenSelectedPackage.value = selectedPackage;
        if (hiddenQuoteEstimate) hiddenQuoteEstimate.value = String(total || 0);
        if (hiddenSelectedServicesJson) hiddenSelectedServicesJson.value = JSON.stringify(services || []);
    }

    function renderEstimate() {
        if (!estimateTotalEl) return;
        const state = getBuilderSelections();
        estimateTotalEl.innerHTML = `From ${formatGBP(state.total || 0)} <span>(inc. VAT)</span>`;
        syncHiddenQuoteFields({ ...state, selectedPackage: "" });
    }

    function prefillContactFromBuilder() {
        const propertyTypeValue = builderPropertyType?.value || "";
        const sizeBand = builderSize?.selectedOptions?.[0]?.textContent?.trim() || "";
        const state = getBuilderSelections();
        const { services, total } = state;

        const serviceNames = services.map(s => s.name).join(", ");

        if (contactServicesInput) contactServicesInput.value = serviceNames;

        if (contactPropertyType && propertyTypeValue) {
            const map = {
                "flat": "Flat",
                "house": "House",
                "holiday-let": "Holiday let",
                "hospitality": "Hospitality",
                "commercial": "Commercial"
            };
            contactPropertyType.value = map[propertyTypeValue] || "";
        }

        if (contactMessage) {
            contactMessage.value =
                `Package/Quote Enquiry\n` +
                `Property type: ${propertyTypeValue || "Not specified"}\n` +
                `Property size / image count: ${sizeBand || "Not specified"}\n` +
                `Selected services: ${serviceNames || "None selected"}\n` +
                `Estimated total (from): ${formatGBP(total)} inc. VAT\n\n` +
                `Please provide a quote based on property size, location, access and availability.`;
        }

        syncHiddenQuoteFields({ ...state, selectedPackage: "Custom Builder" });

        contactSection?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        contactServicesInput?.focus();
    }

    if (quoteBuilder) {
        quoteBuilder.addEventListener("change", renderEstimate);
        quoteBuilder.addEventListener("input", renderEstimate);
        renderEstimate();
    }

    builderRequestQuoteBtn?.addEventListener("click", prefillContactFromBuilder);

    builderResetBtn?.addEventListener("click", () => {
        quoteBuilder?.reset();
        const photo = qsa('input[name="service"]', quoteBuilder).find(cb => cb.value === "Photography");
        if (photo) photo.checked = true;
        if (builderSize) builderSize.value = "medium";
        if (builderPropertyType) builderPropertyType.value = "house";
        if (extraImagesInput) extraImagesInput.value = "0";
        renderEstimate();
    });

    qsa(".package-select").forEach(btn => {
        btn.addEventListener("click", () => {
            const packageName = btn.dataset.package || "Package";
            const total = Number(btn.dataset.total || 0);
            const services = (btn.dataset.services || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
                .map(name => ({ name, price: null }));

            if (contactServicesInput) contactServicesInput.value = btn.dataset.services || "";
            if (contactMessage) {
                contactMessage.value =
                    `Package Enquiry: ${packageName}\n` +
                    `Selected package includes: ${btn.dataset.services || ""}\n` +
                    `From price: ${formatGBP(total)} (inc. VAT)\n\n` +
                    `Please confirm availability and provide a final quote based on property size, location and access.`;
            }

            syncHiddenQuoteFields({ services, total, selectedPackage: packageName });

            contactSection?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
            contactServicesInput?.focus();
        });
    });

    // Optional Stripe deposit button (hidden by default)
    builderPayDepositBtn?.addEventListener("click", async () => {
        const state = getBuilderSelections();
        const payload = {
            mode: "deposit",
            selectedPackage: "Custom Builder",
            propertyType: builderPropertyType?.value || "",
            sizeBand: builderSize?.value || "",
            services: state.services,
            estimate: state.total
        };

        builderPayDepositBtn.disabled = true;
        const originalText = builderPayDepositBtn.textContent;
        builderPayDepositBtn.textContent = "Redirecting…";

        try {
            const res = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Payment setup failed");

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (err) {
            alert(err.message || "Could not start payment. Please try again.");
            builderPayDepositBtn.disabled = false;
            builderPayDepositBtn.textContent = originalText;
        }
    });

    // ============================================================
    // CONTACT FORM -> /api/contact
    // ============================================================
    const contactForm = qs("#contactForm");
    const contactStatus = qs("#contactStatus");

    function validateContactForm(form) {
        const name = qs("#name", form);
        const email = qs("#email", form);
        const message = qs("#message", form);

        if (!name?.value.trim()) return "Please enter your name.";
        if (!email?.value.trim()) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return "Please enter a valid email address.";
        if (!message?.value.trim()) return "Please enter a short message about the project.";
        return "";
    }

    contactForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const validationError = validateContactForm(contactForm);
        if (validationError) {
            if (contactStatus) contactStatus.textContent = validationError;
            return;
        }

        if (contactStatus) contactStatus.textContent = "Sending…";

        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        if (payload["bot-field"]) {
            if (contactStatus) contactStatus.textContent = "Submission blocked.";
            return;
        }

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Message failed");

            contactForm.reset();
            if (contactStatus) {
                contactStatus.textContent = "Thanks — your enquiry has been sent. We usually reply within 24 hours.";
            }
        } catch (err) {
            if (contactStatus) {
                contactStatus.textContent = err.message || "Sorry — message failed. Please try again.";
            }
        }
    });

    // ============================================================
    // KEYBOARD HANDLING
    // ============================================================
    document.addEventListener("keydown", (e) => {
        if (lightbox && !lightbox.hidden) {
            trapFocus(lightboxStage, e);
            if (e.key === "Escape") {
                e.preventDefault();
                return closeLightbox();
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                return nextLightbox();
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                return prevLightbox();
            }
            return;
        }

        if (projectOverlay && !projectOverlay.hidden) {
            trapFocus(projectPanel, e);
            if (e.key === "Escape") {
                e.preventDefault();
                return closeProject();
            }
            return;
        }

        if (aboutOverlay && !aboutOverlay.hidden) {
            trapFocus(aboutPanel, e);
            if (e.key === "Escape") {
                e.preventDefault();
                return closeAbout();
            }
        }

        if (overlay) {
            overlay.addEventListener("click", (e) => {
                if (
                    e.target === overlay ||
                    e.target.classList.contains("overlay-backdrop")
                ) {
                    closeOverlay();
                }
            });
        }

        // Reliable backdrop / outside-click close for about overlay
        if (aboutOverlay) {
            aboutOverlay.addEventListener("click", (e) => {
                if (
                    e.target === aboutOverlay ||
                    e.target.classList.contains("overlay-backdrop")
                ) {
                    closeAboutOverlay();
                }
            });
        }
    });
});

