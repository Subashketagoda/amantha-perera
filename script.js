/**
 * Amantha Perera — Creator & Partnership Deck 2026
 * Functional interaction controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.deck-slide'));
  const currentSlideNumEl = document.getElementById('currentSlideNum');
  const btnPrev = document.getElementById('btnPrevSlide');
  const btnNext = document.getElementById('btnNextSlide');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnOpenToc = document.getElementById('btnOpenToc');
  const btnCloseToc = document.getElementById('btnCloseToc');
  const tocBackdrop = document.getElementById('tocBackdrop');
  const tocItems = Array.from(document.querySelectorAll('.toc-item'));
  const mediaModal = document.getElementById('mediaModal');
  const modalBody = document.getElementById('modalBody');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const topNav = document.getElementById('topNav');

  let currentSlideIndex = 0;
  let lastScrollY = window.scrollY;

  // 1. Update current slide on scroll via IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.2
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pageNum = parseInt(entry.target.getAttribute('data-page'), 10);
        if (!isNaN(pageNum)) {
          currentSlideIndex = pageNum - 1;
          const formatted = pageNum.toString().padStart(2, '0');
          if (currentSlideNumEl) {
            currentSlideNumEl.textContent = formatted;
          }
          // Highlight TOC item
          tocItems.forEach((item, idx) => {
            if (idx === currentSlideIndex) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      }
    });
  }, observerOptions);

  slides.forEach((slide) => slideObserver.observe(slide));

  // 2. Navigation buttons
  function scrollToSlide(index) {
    if (index >= 0 && index < slides.length) {
      currentSlideIndex = index;
      slides[currentSlideIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      scrollToSlide(Math.max(0, currentSlideIndex - 1));
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      scrollToSlide(Math.min(slides.length - 1, currentSlideIndex + 1));
    });
  }

  // 3. Keyboard navigation
  window.addEventListener('keydown', (e) => {
    // If modal or drawer is open, let Escape close it
    if (e.key === 'Escape') {
      if (mediaModal && mediaModal.classList.contains('active')) {
        closeVideoModal();
        return;
      }
      if (tocBackdrop && tocBackdrop.classList.contains('active')) {
        closeToc();
        return;
      }
    }

    // Ignore keyboard shortcuts if user is focusing an input
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault();
      scrollToSlide(Math.min(slides.length - 1, currentSlideIndex + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault();
      scrollToSlide(Math.max(0, currentSlideIndex - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSlide(slides.length - 1);
    }
  });

  // 3b. Touch swipe navigation for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  window.addEventListener('touchstart', (e) => {
    // If modal or TOC drawer is open, ignore slide swipe
    if ((mediaModal && mediaModal.classList.contains('active')) ||
        (tocBackdrop && tocBackdrop.classList.contains('active'))) {
      return;
    }
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if ((mediaModal && mediaModal.classList.contains('active')) ||
        (tocBackdrop && tocBackdrop.classList.contains('active'))) {
      return;
    }
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const duration = Date.now() - touchStartTime;

      // Thresholds:
      // Minimum horizontal distance: 48px
      // Horizontal swipe must dominate vertical swipe (horizontal > vertical * 1.4)
      // Duration must be quick gesture: under 650ms
      if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4 && duration < 650) {
        if (deltaX < 0) {
          // Swiped left -> advance to next slide
          scrollToSlide(Math.min(slides.length - 1, currentSlideIndex + 1));
        } else {
          // Swiped right -> go to previous slide
          scrollToSlide(Math.max(0, currentSlideIndex - 1));
        }
      }
    }
  }, { passive: true });

  // 4. TOC Drawer functionality
  function openToc() {
    if (tocBackdrop) {
      tocBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeToc() {
    if (tocBackdrop) {
      tocBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnOpenToc) btnOpenToc.addEventListener('click', openToc);
  if (btnCloseToc) btnCloseToc.addEventListener('click', closeToc);
  const deckCounter = document.getElementById('deckCounter');
  if (deckCounter) deckCounter.addEventListener('click', openToc);

  if (tocBackdrop) {
    tocBackdrop.addEventListener('click', (e) => {
      if (e.target === tocBackdrop) {
        closeToc();
      }
    });
  }

  tocItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      closeToc();
    });
  });

  // 5. Fullscreen toggle
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err.message);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // 6. Video Modal for YouTube links
  function openVideoModal(videoId) {
    if (!mediaModal || !modalBody) return;
    modalBody.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;
    mediaModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!mediaModal || !modalBody) return;
    mediaModal.classList.remove('active');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeVideoModal);
  if (mediaModal) {
    mediaModal.addEventListener('click', (e) => {
      if (e.target === mediaModal) closeVideoModal();
    });
  }

  // Intercept podcast cards with data-video to play in modal
  const podcastCards = document.querySelectorAll('.p18-ep-card[data-video]');
  podcastCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const videoId = card.getAttribute('data-video');
      if (videoId) {
        e.preventDefault();
        openVideoModal(videoId);
      }
    });
  });

  // 7. Auto hide/reveal top bar on scroll
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (topNav) {
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        topNav.style.transform = 'translateY(-100%)';
      } else {
        topNav.style.transform = 'translateY(0)';
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  // 8. Contact links copy feedback toast
  const contactLinks = document.querySelectorAll('.direct-contact-link');
  contactLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Let mailto: and tel: proceed, but also copy clean text to clipboard
      const textToCopy = link.textContent.trim();
      navigator.clipboard?.writeText(textToCopy).then(() => {
        showToast(`Copied ${textToCopy} to clipboard!`);
      }).catch(() => {});
    });
  });

  function showToast(msg) {
    let toast = document.getElementById('deckToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'deckToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #ffe410;
        color: #0e0e0e;
        font-family: var(--font-heading);
        font-weight: 800;
        font-size: 13px;
        padding: 10px 24px;
        border-radius: 9999px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 5000;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2400);
  }

  console.log('Amantha Perera Creator Deck Website initialized with 24 pages.');
});
