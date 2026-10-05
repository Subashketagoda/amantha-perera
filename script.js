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
  const deckProgressBar = document.getElementById('deckProgressBar');
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');

  let currentSlideIndex = 0;
  let lastScrollY = window.scrollY;

  // 0. CINEMATIC PRELOADER SEQUENCE (Requirement 1 & 2)
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let preloaderFinished = false;
  function startPreloaderSequence() {
    if (preloaderFinished) return;
    preloaderFinished = true;

    if (!preloader) {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded', 'js-reveal-active');
      if (slides[0]) slides[0].classList.add('revealed');
      return;
    }

    if (isReducedMotion) {
      preloader.remove();
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded', 'js-reveal-active');
      slides.forEach((s) => s.classList.add('revealed'));
      return;
    }

    // Step 1 & 2: Logo fades in & scales (handled by CSS preloaderContentEnter)
    // Step 3: Yellow progress line expands horizontally (duration ~850ms)
    setTimeout(() => {
      if (preloaderBar) {
        preloaderBar.style.width = '100%';
      }
    }, 100);

    // Step 4 & 5: Logo and line fade out after line completes, main site reveals
    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded', 'js-reveal-active');

      if (slides[0]) {
        slides[0].classList.add('revealed');
      }

      // Cleanup preloader from DOM after 500ms fade transition
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 520);
    }, 980);
  }

  // Start preloader sequence immediately
  startPreloaderSequence();

  // 1. SCROLL REVEAL OBSERVER (Requirement 3 & 4)
  // Each PDF page smoothly enters viewport only once
  if (!isReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    slides.forEach((slide) => {
      revealObserver.observe(slide);
    });
  } else {
    slides.forEach((s) => s.classList.add('revealed'));
  }

  // 2. ACTIVE SLIDE & PROGRESS BAR OBSERVER (Requirement 10 & 11)
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
          if (currentSlideNumEl && currentSlideNumEl.textContent !== formatted) {
            currentSlideNumEl.textContent = formatted;
            currentSlideNumEl.classList.remove('anim-change');
            void currentSlideNumEl.offsetWidth; // Force reflow
            currentSlideNumEl.classList.add('anim-change');
          }

          // Update 2px progress bar width smoothly
          if (deckProgressBar) {
            const pct = (pageNum / slides.length) * 100;
            deckProgressBar.style.width = `${pct.toFixed(2)}%`;
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
      document.body.classList.add('toc-open');
      if (btnOpenToc) btnOpenToc.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeToc() {
    if (tocBackdrop) {
      tocBackdrop.classList.remove('active');
      document.body.classList.remove('toc-open');
      if (btnOpenToc) btnOpenToc.setAttribute('aria-expanded', 'false');
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

  // Inline track play button triggers Page 16 video
  const btnPlayChandi = document.getElementById('btnPlayChandiVideo');
  const videoP16 = document.getElementById('videoPage16');
  if (btnPlayChandi && videoP16) {
    btnPlayChandi.addEventListener('click', (e) => {
      e.preventDefault();
      videoP16.scrollIntoView({ behavior: 'smooth', block: 'center' });
      videoP16.muted = false; // Unmute on user interaction
      videoP16.play().catch(() => {});
    });

    btnPlayChandi.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btnPlayChandi.click();
      }
    });

    videoP16.addEventListener('play', () => {
      btnPlayChandi.classList.add('is-playing');
    });

    videoP16.addEventListener('pause', () => {
      btnPlayChandi.classList.remove('is-playing');
    });
  }

  // 7. Auto hide/reveal top bar on scroll (desktop only)
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 820) {
      if (topNav) topNav.style.transform = 'translateY(0)';
      return;
    }
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

  // 9. SUBTLE PARALLAX ON LARGE VISUAL PAGES (Requirement 5)
  // Strictly clamped between -18px and 0px, desktop only
  if (!isReducedMotion) {
    let parallaxScheduled = false;

    function applyParallax() {
      if (window.innerWidth <= 992) {
        parallaxScheduled = false;
        return;
      }

      const viewportH = window.innerHeight;
      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        if (rect.top < viewportH && rect.bottom > 0) {
          const progress = (viewportH - rect.top) / (viewportH + rect.height);
          const py = Math.max(-18, Math.min(0, (progress - 0.5) * -20));
          slide.style.setProperty('--parallax-y', `${py.toFixed(1)}px`);
        }
      });
      parallaxScheduled = false;
    }

    window.addEventListener('scroll', () => {
      if (!parallaxScheduled) {
        requestAnimationFrame(applyParallax);
        parallaxScheduled = true;
      }
    }, { passive: true });
  }

  // 10. MAGNETIC MICRO-INTERACTIONS (Requirement 13)
  // Desktop only with fine pointer, subtle 3-4px pull
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !isReducedMotion) {
    const magneticTargets = document.querySelectorAll('.btn-toc, .btn-collaborate, .btn-deck-nav');
    magneticTargets.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const pullX = Math.max(-3.5, Math.min(3.5, relX * 0.16));
        const pullY = Math.max(-3.5, Math.min(3.5, relY * 0.16));
        btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // 11. SCROLL-TRIGGERED NUMBER COUNTER ANIMATION
  // Smoothly counts up metrics & statistics when scrolled into view
  if (!isReducedMotion && 'IntersectionObserver' in window) {
    const statSelectors = [
      '.stat-num',
      '.p03-huge-stat',
      '.highlight-val',
      '.mini-card-num',
      '.p04-val',
      '.huge-number',
      '.cell-num',
      '.p10-reel-stats-box .num',
      '.strip-num'
    ].join(', ');

    const statElements = Array.from(document.querySelectorAll(statSelectors));

    function parseStat(str) {
      if (!str) return null;
      str = str.trim();
      // Skip non-scalar metrics, ranges and ratios
      if (str.includes('→') || str.includes('/') || str.includes('–') || str.includes('-')) return null;
      const m = str.match(/^([^\d.]*)(\d+(?:,\d+)*(?:\.\d+)?)(.*)$/);
      if (!m) return null;
      const prefix = m[1];
      const numStr = m[2];
      const suffix = m[3];
      const hasComma = numStr.includes(',');
      const cleanNum = numStr.replace(/,/g, '');
      const val = parseFloat(cleanNum);
      if (isNaN(val)) return null;
      const decimalParts = cleanNum.split('.');
      const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
      return { prefix, val, decimals, hasComma, suffix, original: str };
    }

    function formatNumber(data, curVal) {
      let formatted = curVal.toFixed(data.decimals);
      if (data.hasComma) {
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formatted = parts.join('.');
      }
      return data.prefix + formatted + data.suffix;
    }

    function animateCounter(el) {
      if (el.dataset.counterAnimated === 'true') return;
      const data = el._counterData || parseStat(el.textContent);
      if (!data) return;

      el.dataset.counterAnimated = 'true';
      // Set to 0 immediately upon entering viewport so animation starts cleanly
      el.textContent = formatNumber(data, 0);

      const duration = 950; // ms for a snappy, cinematic smooth glide
      let startTime = null;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          el.textContent = data.original;
          return;
        }

        // Exponential ease out for high-end feel
        const ease = 1 - Math.pow(2, -10 * progress);
        const curVal = data.val * ease;

        el.textContent = formatNumber(data, curVal);
        requestAnimationFrame(step);
      }

      requestAnimationFrame(step);

      // Fallback guarantee to ensure final text is always 100% exact original
      setTimeout(() => {
        el.textContent = data.original;
      }, duration + 100);
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    statElements.forEach((el) => {
      const data = parseStat(el.textContent);
      if (data) {
        el._counterData = data;
        counterObserver.observe(el);
      }
    });
  }

  // 12. VIDEO AUTOPLAY ON SCROLL (IntersectionObserver)
  // Videos play muted when visible, pause when scrolled away
  if ('IntersectionObserver' in window) {
    const inlineVideos = document.querySelectorAll('.deck-inline-video');

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Play when visible (muted for autoplay policy)
          video.muted = true;
          video.play().catch(() => {});
        } else {
          // Pause when not visible to save resources
          video.pause();
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.35
    });

    inlineVideos.forEach((video) => {
      videoObserver.observe(video);
    });

    // Allow unmute on user interaction (click/tap on video)
    inlineVideos.forEach((video) => {
      video.addEventListener('click', () => {
        video.muted = !video.muted;
      });
    });
  }

  console.log('Amantha Perera Creator Deck Website initialized with 24 pages.');
});

