/**
 * CrepeCrafters - Interactive JavaScript
 * Tagline: "Sweet. Savory. Simply Delicious."
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initActiveNavigation();
  initBackToTop();
  initScrollAnimations();
  initGalleryFilter();
  initGalleryLightbox();
  initCustomCrepeBuilder();
  initFaqAccordion();
  initContactForm();
  initQuickOrderModals();
});

/* ==========================================================================
   1. Mobile Navigation & Drawer
   ========================================================================== */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');

  if (!hamburgerBtn || !mobileDrawer || !mobileOverlay) return;

  function openMenu() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when clicking mobile nav links
  const mobileLinks = mobileDrawer.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   2. Active Navigation Highlight
   ========================================================================== */
function initActiveNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. Back-to-Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   4. Scroll Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   5. Gallery Filtering
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Gallery Lightbox Modal
   ========================================================================== */
function initGalleryLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightboxModal || !galleryItems.length) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
      const category = item.querySelector('span') ? item.querySelector('span').textContent : '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = title ? `${title} (${category})` : '';
      }
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   7. Interactive Custom Crepe Builder & Price Calculator
   ========================================================================== */
function initCustomCrepeBuilder() {
  const builderForm = document.getElementById('customCrepeForm');
  if (!builderForm) return;

  const baseInputs = builderForm.querySelectorAll('input[name="crepeBase"]');
  const fillingInputs = builderForm.querySelectorAll('input[name="crepeFillings"]');
  const sauceInputs = builderForm.querySelectorAll('input[name="crepeSauces"]');
  const toppingInputs = builderForm.querySelectorAll('input[name="crepeToppings"]');

  const summaryBaseEl = document.getElementById('summaryBase');
  const summaryFillingsCountEl = document.getElementById('summaryFillingsCount');
  const summarySaucesCountEl = document.getElementById('summarySaucesCount');
  const summaryToppingsCountEl = document.getElementById('summaryToppingsCount');
  const summaryTagsContainer = document.getElementById('summaryTags');
  const totalPriceEl = document.getElementById('totalPrice');
  const visualEmojiEl = document.getElementById('crepeVisualEmoji');

  const orderCustomBtn = document.getElementById('orderCustomBtn');
  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const orderSuccessDetails = document.getElementById('orderSuccessDetails');
  const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');

  function calculateAndRender() {
    let total = 0;
    const selectedTags = [];

    // 1. Base
    let baseName = 'Classic Golden';
    let basePrice = 5.00;
    baseInputs.forEach(input => {
      if (input.checked) {
        baseName = input.getAttribute('data-name');
        basePrice = parseFloat(input.getAttribute('data-price')) || 5.00;
      }
    });
    total += basePrice;
    if (summaryBaseEl) summaryBaseEl.textContent = `${baseName} ($${basePrice.toFixed(2)})`;
    selectedTags.push(`Base: ${baseName}`);

    // Visual emoji changer
    if (visualEmojiEl) {
      visualEmojiEl.textContent = baseName.toLowerCase().includes('chocolate') ? '🥞🍫' : '🥞';
    }

    // 2. Fillings
    let fillingsCount = 0;
    fillingInputs.forEach(input => {
      if (input.checked) {
        fillingsCount++;
        const price = parseFloat(input.getAttribute('data-price')) || 0;
        total += price;
        selectedTags.push(input.getAttribute('data-name'));
      }
    });
    if (summaryFillingsCountEl) {
      summaryFillingsCountEl.textContent = fillingsCount > 0 ? `${fillingsCount} selected` : 'None';
    }

    // 3. Sauces
    let saucesCount = 0;
    sauceInputs.forEach(input => {
      if (input.checked) {
        saucesCount++;
        const price = parseFloat(input.getAttribute('data-price')) || 0;
        total += price;
        selectedTags.push(input.getAttribute('data-name'));
      }
    });
    if (summarySaucesCountEl) {
      summarySaucesCountEl.textContent = saucesCount > 0 ? `${saucesCount} selected` : 'None';
    }

    // 4. Toppings
    let toppingsCount = 0;
    toppingInputs.forEach(input => {
      if (input.checked) {
        toppingsCount++;
        const price = parseFloat(input.getAttribute('data-price')) || 0;
        total += price;
        selectedTags.push(input.getAttribute('data-name'));
      }
    });
    if (summaryToppingsCountEl) {
      summaryToppingsCountEl.textContent = toppingsCount > 0 ? `${toppingsCount} selected` : 'None';
    }

    // Render tags
    if (summaryTagsContainer) {
      summaryTagsContainer.innerHTML = '';
      selectedTags.forEach(tag => {
        const pill = document.createElement('span');
        pill.className = 'summary-pill';
        pill.textContent = tag;
        summaryTagsContainer.appendChild(pill);
      });
    }

    // Total display
    if (totalPriceEl) {
      totalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    return {
      baseName,
      fillingsCount,
      saucesCount,
      toppingsCount,
      total: total.toFixed(2),
      tags: selectedTags
    };
  }

  // Bind change listeners to all inputs
  builderForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', calculateAndRender);
  });

  // Initial calculation
  calculateAndRender();

  // Order submission modal
  if (orderCustomBtn && orderSuccessModal) {
    orderCustomBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentOrder = calculateAndRender();
      const orderNumber = Math.floor(1000 + Math.random() * 9000);

      if (orderSuccessDetails) {
        orderSuccessDetails.innerHTML = `
          <p><strong>Order #: CC-${orderNumber}</strong></p>
          <p style="margin: 8px 0; color: #555;">Base: ${currentOrder.baseName}</p>
          <p style="margin: 4px 0; font-size: 0.9rem; color: #777;">Ingredients: ${currentOrder.tags.slice(1).join(', ') || 'Just the delicious base'}</p>
          <h3 style="color: #E84A63; margin-top: 15px;">Total: $${currentOrder.total}</h3>
          <p style="font-size: 0.85rem; color: #888; margin-top: 8px;">Your crepe is being freshly prepared with love in our kitchen!</p>
        `;
      }

      orderSuccessModal.classList.add('active');
    });
  }

  if (closeOrderModalBtn && orderSuccessModal) {
    closeOrderModalBtn.addEventListener('click', () => {
      orderSuccessModal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('active');
        answerEl.style.maxHeight = answerEl.scrollHeight + 40 + 'px';
      } else {
        item.classList.remove('active');
        answerEl.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form Handler & Feedback Message
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const successBanner = document.getElementById('formSuccessBanner');

  if (!contactForm || !successBanner) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const nameVal = nameInput ? nameInput.value.trim() : 'Guest';

    // Show animated success notification banner
    successBanner.innerHTML = `
      <div style="font-size: 1.5rem; line-height: 1;">🎉</div>
      <div>
        <strong>Thank you, ${nameVal}!</strong> Your message has been sent successfully. Our team will get back to you within 24 hours.
      </div>
    `;
    successBanner.classList.add('active');

    // Scroll to success banner smoothly
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Reset form
    contactForm.reset();

    // Auto-hide after 8 seconds
    setTimeout(() => {
      successBanner.classList.remove('active');
    }, 8000);
  });
}

/* ==========================================================================
   10. Quick Item Add / Order Notifications for Menu Cards
   ========================================================================== */
function initQuickOrderModals() {
  const orderButtons = document.querySelectorAll('.btn-order-quick');
  if (!orderButtons.length) return;

  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemName = btn.getAttribute('data-item') || 'Crepe Item';
      const itemPrice = btn.getAttribute('data-price') || '$8.99';

      showToast(`Added ${itemName} (${itemPrice}) to your café tray!`);
    });
  });
}

/**
 * Toast notification utility
 */
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.style.position = 'fixed';
    toast.style.bottom = '90px';
    toast.style.right = '30px';
    toast.style.backgroundColor = '#3D2314';
    toast.style.color = '#FCF6E8';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '9999px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.zIndex = '3000';
    toast.style.border = '1px solid #D4AF37';
    toast.style.fontSize = '0.92rem';
    toast.style.fontWeight = '600';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    document.body.appendChild(toast);
  }

  toast.textContent = `✨ ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
  }, 3500);
}
