/* ========================================
   PULSIA AGENCY — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVIGATION ──
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu__close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  });

  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileClose?.addEventListener('click', closeMobileMenu);

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── SCROLL ANIMATIONS ──
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // ── SERVICES TAB (services page) ──
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.style.display = 'none');
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.style.display = 'grid';
    });
  });

  // ── ORDER FORM — price display ──
  const serviceSelect = document.getElementById('order-service');
  const subServiceSelect = document.getElementById('order-subservice');
  const priceIndicator = document.querySelector('.price-indicator');
  const priceRange = document.querySelector('.price-range');
  const priceNote = document.querySelector('.price-note');

  // Build price lookup from JSON data injected by Eleventy (window.PULSIA_SERVICES)
  // Falls back to empty object if not on commande page
  const allServices = window.PULSIA_SERVICES
    ? [...(window.PULSIA_SERVICES.infographie || []), ...(window.PULSIA_SERVICES.digital || [])]
    : [];

  const servicePrices = {};
  allServices.forEach(s => {
    servicePrices[s.id] = {
      label: s.titre,
      price: s.prix,
      note: s.note_prix,
      sub: s.options || []
    };
  });

  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const val = serviceSelect.value;
      const data = servicePrices[val];

      if (data && subServiceSelect) {
        subServiceSelect.innerHTML = '<option value="">-- Choisir une option --</option>';
        data.sub.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.toLowerCase().replace(/\s+/g, '-');
          opt.textContent = s;
          subServiceSelect.appendChild(opt);
        });
        subServiceSelect.disabled = false;
      } else if (subServiceSelect) {
        subServiceSelect.innerHTML = '<option value="">-- Sélectionnez d\'abord un service --</option>';
        subServiceSelect.disabled = true;
      }

      if (data && priceIndicator) {
        priceRange.textContent = data.price;
        priceNote.textContent = data.note;
        priceIndicator.classList.add('visible');
      } else if (priceIndicator) {
        priceIndicator.classList.remove('visible');
      }
    });
  }

  // ── NETLIFY FORMS HANDLER ──
  const forms = document.querySelectorAll('form[data-netlify="true"]');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const successMsg = form.nextElementSibling;
      const hasFiles = form.querySelector('input[type="file"]');

      if (submitBtn) {
        submitBtn.textContent = 'Envoi en cours…';
        submitBtn.disabled = true;
      }

      try {
        let body, headers;

        if (hasFiles) {
          // Multipart for forms with file attachments (candidature freelance)
          body = new FormData(form);
          headers = {}; // Let browser set Content-Type with boundary
        } else {
          // URL-encoded for simple forms (faster, more compatible)
          body = new URLSearchParams(new FormData(form)).toString();
          headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        }

        const response = await fetch('/', {
          method: 'POST',
          headers,
          body,
        });

        if (response.ok || response.status === 200 || response.redirected) {
          form.style.display = 'none';
          if (successMsg?.classList.contains('success-msg')) {
            successMsg.classList.add('visible');
          }
        } else {
          throw new Error('Statut ' + response.status);
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.textContent = 'Réessayer';
          submitBtn.disabled = false;
        }
        alert('Une erreur s\'est produite. Vérifiez votre connexion et réessayez, ou contactez-nous directement sur WhatsApp.');
      }
    });
  });

  // ── SMOOTH ANCHOR SCROLLING ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── IMAGE ZOOM (Créamiir) ──
  const zoomImg = document.querySelector('.creamiir-image-hero img');
  if (zoomImg) {
    zoomImg.style.cursor = 'zoom-in';
    zoomImg.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:24px;';
      const img = document.createElement('img');
      img.src = zoomImg.src;
      img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 32px 80px rgba(0,0,0,0.5);';
      overlay.appendChild(img);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  }

  // ── PRINT TOGGLE — Page Commande ──
  const printBtnOui = document.getElementById('print-btn-oui');
  const printBtnNon = document.getElementById('print-btn-non');
  const printOptions = document.getElementById('print-options');
  const impressionValue = document.getElementById('impression-value');

  function setPrintChoice(choice) {
    if (!printBtnOui || !printBtnNon) return;

    if (choice === 'oui') {
      printBtnOui.classList.add('print-btn--active');
      printBtnNon.classList.remove('print-btn--active');
      impressionValue.value = 'oui';
      if (printOptions) {
        printOptions.style.display = 'block';
        printOptions.classList.add('visible');
      }
    } else {
      printBtnNon.classList.add('print-btn--active');
      printBtnOui.classList.remove('print-btn--active');
      impressionValue.value = 'non';
      if (printOptions) {
        printOptions.style.display = 'none';
        printOptions.classList.remove('visible');
        // Clear print fields when hidden so they don't pollute the form submission
        printOptions.querySelectorAll('select, textarea, input').forEach(el => {
          if (el.tagName === 'TEXTAREA' || el.type === 'text') el.value = '';
          else if (el.tagName === 'SELECT') el.selectedIndex = 0;
        });
      }
    }
  }

  printBtnOui?.addEventListener('click', () => setPrintChoice('oui'));
  printBtnNon?.addEventListener('click', () => setPrintChoice('non'));

  // Initialise to "non" state (hidden) on page load
  setPrintChoice('non');

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 20);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

});

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
