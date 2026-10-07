/**
 * Sultan Cleaning - Main JS (Bootstrap 5 Integrated)
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '966582102525';
  const DEFAULT_COUPON = 'SULTAN35';

  // 1. Copy Coupon Functionality
  document.querySelectorAll('[data-copy-coupon]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = btn.getAttribute('data-copy-coupon') || DEFAULT_COUPON;
      navigator.clipboard.writeText(code).then(() => {
        showToast(`🎉 تم نسخ كود الخصم (${code}) بنجاح!`);
      }).catch(() => {
        showToast(`كود الخصم: ${code}`);
      });
    });
  });

  // 2. Countdown Timer
  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  if (hoursEl && minutesEl && secondsEl) {
    let endTime = localStorage.getItem('sultan_promo_end');
    if (!endTime || new Date().getTime() > parseInt(endTime, 10)) {
      endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
      localStorage.setItem('sultan_promo_end', endTime.toString());
    }

    const updateTimer = () => {
      const distance = parseInt(endTime, 10) - new Date().getTime();
      if (distance < 0) return;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // 3. Service Filter Tabs (Bootstrap buttons filter)
  const filterBtns = document.querySelectorAll('[data-filter]');
  const serviceCards = document.querySelectorAll('.service-item');

  if (filterBtns.length && serviceCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('btn-brand-primary');
          b.classList.add('btn-outline-secondary');
        });
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-brand-primary');

        const cat = btn.getAttribute('data-filter');
        serviceCards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.closest('.col-service').style.display = 'block';
          } else {
            card.closest('.col-service').style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Before / After Comparison Slider
  const baBefore = document.querySelector('.ba-before');
  const baHandle = document.querySelector('.ba-handle');
  const baInput = document.querySelector('.ba-slider input[type="range"]');

  if (baBefore && baHandle && baInput) {
    baInput.addEventListener('input', (e) => {
      const val = e.target.value;
      baBefore.style.width = `${val}%`;
      baHandle.style.left = `${val}%`;
    });
  }

  // 5. WhatsApp Direct Booking Form (Prepares formatted WhatsApp message)
  document.querySelectorAll('.whatsapp-booking-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name') || 'عميلنا العزيز';
      const phone = fd.get('phone') || '';
      const service = fd.get('service') || 'خدمة تنظيف شامل';
      const city = fd.get('city') || 'الرياض';
      const notes = fd.get('notes') || 'معاينة مجانية';

      const msg = `مرحباً سلطان كلين 🌟%0A` +
        `أود طلب معاينة وتفعيل خصم 35% (كود: ${DEFAULT_COUPON})%0A%0A` +
        `👤 *الاسم:* ${name}%0A` +
        `📱 *الجوال:* ${phone}%0A` +
        `🧹 *الخدمة:* ${service}%0A` +
        `📍 *المدينة / الحي:* ${city}%0A` +
        `📝 *ملاحظات:* ${notes}`;

      showToast('جاري تحويلك إلى واتساب لإتمام الحجز...');
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
        form.reset();
        // Close modal if open
        const modalEl = document.getElementById('bookingModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
      }, 700);
    });
  });

  // 6. Direct Service WhatsApp Buttons
  document.querySelectorAll('[data-wa-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-wa-service');
      const msg = `مرحباً سلطان كلين 👋 أود الاستفسار وطلب معاينة مع خصم 35% لخدمة: *${service}*. كود: ${DEFAULT_COUPON}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    });
  });

  // 7. Gallery Lightbox Modal Handler
  document.querySelectorAll('[data-gallery-img]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = item.getAttribute('data-gallery-img');
      const title = item.getAttribute('data-gallery-title') || 'معرض أعمال سلطان كلين';
      const category = item.getAttribute('data-gallery-cat') || 'خدمة نظافة متخصصة';
      const location = item.getAttribute('data-gallery-location') || 'الرياض';

      const modalEl = document.getElementById('galleryLightboxModal');
      if (modalEl) {
        const modalImg = modalEl.querySelector('#lightboxImg');
        const modalTitle = modalEl.querySelector('#lightboxTitle');
        const modalCat = modalEl.querySelector('#lightboxCategory');
        const modalLoc = modalEl.querySelector('#lightboxLocation');
        const modalWaBtn = modalEl.querySelector('#lightboxWaBtn');

        if (modalImg) modalImg.src = imgSrc;
        if (modalTitle) modalTitle.textContent = title;
        if (modalCat) modalCat.textContent = category;
        if (modalLoc) modalLoc.textContent = location;
        if (modalWaBtn) {
          const waMsg = `مرحباً سلطان كلين 🌟 شاهدت صورة عملكم في المعرض (${title} - ${location}) وأرغب في طلب نفس الخدمة مع خصم 35%`;
          modalWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
        }

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  });

  // 8. Auto-close mobile navbar on link click
  const navCollapse = document.getElementById('mainNav');
  if (navCollapse) {
    const navLinks = navCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  // 9. Scroll To Top Button (Auto-injected if not present + smooth scroll)
  let scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollTopBtn';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'العودة للأعلى');
    scrollBtn.setAttribute('title', 'العودة لأعلى الصفحة');
    scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
  }

  const handleScrollBtn = () => {
    if (window.scrollY > 280) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleScrollBtn, { passive: true });
  handleScrollBtn();

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 10. Simple Toast Notification
  function showToast(text) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-brand-accent me-2"></i> ${text}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
});

