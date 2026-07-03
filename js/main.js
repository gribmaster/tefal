(function () {
  'use strict';

  const initLanding = (root) => {
    if (!root || root.dataset.landingInitialized === 'true') {
      return;
    }

    root.dataset.landingInitialized = 'true';

    const escapeHandlers = [];

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      escapeHandlers.forEach((handler) => handler());
    });

    const lockScroll = () => {
      const stored = document.body.getAttribute('data-landing-scroll-lock');

      if (stored === null) {
        document.body.setAttribute('data-landing-scroll-lock', document.body.style.overflow || '');
      }

      document.body.style.overflow = 'hidden';
    };

    const unlockScroll = () => {
      const stored = document.body.getAttribute('data-landing-scroll-lock');

      if (stored === null) {
        return;
      }

      document.body.style.overflow = stored;
      document.body.removeAttribute('data-landing-scroll-lock');
    };

    const initCarousels = () => {
      if (typeof jQuery === 'undefined' || typeof jQuery.fn.slick === 'undefined') {
        return;
      }

      jQuery(root).find('.products-carousel').each(function () {
        const $carousel = jQuery(this);

        if ($carousel.hasClass('slick-initialized')) {
          return;
        }

        $carousel.slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
          dots: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
      });
    };

    const initModal = () => {
      const modal = root.querySelector('.product-modal');

      if (!modal) {
        return;
      }

      const dialog = modal.querySelector('.product-modal__dialog');
      const overlay = modal.querySelector('.product-modal__overlay');
      const closeButton = modal.querySelector('.product-modal__close');
      const modalImage = modal.querySelector('.product-modal__image img');
      const modalTitle = modal.querySelector('.product-modal__title');
      const storeLinks = modal.querySelectorAll('.product-modal__store');

      const openModal = (card) => {
        const cardImage = card.querySelector('.product-item__img img');
        const cardTitle = card.querySelector('.product-item__title');

        if (modalImage && cardImage) {
          modalImage.src = cardImage.currentSrc || cardImage.src;
          modalImage.alt = cardImage.alt || '';
        }

        if (modalTitle && cardTitle) {
          modalTitle.textContent = cardTitle.textContent.trim();
        }

        storeLinks.forEach((link) => {
          const store = link.dataset.storeLink;
          const url = store ? card.dataset['store' + store.charAt(0).toUpperCase() + store.slice(1)] : '';

          if (url) {
            link.href = url;
            link.hidden = false;
          } else {
            link.removeAttribute('href');
            link.hidden = true;
          }
        });

        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        lockScroll();

        if (closeButton) {
          closeButton.focus();
        }
      };

      const closeModal = () => {
        if (!modal.classList.contains('is-active')) {
          return;
        }

        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        unlockScroll();
      };

      root.addEventListener('click', (event) => {
        const button = event.target.closest('.product-item__button .button');

        if (!button || !root.contains(button)) {
          return;
        }

        const card = button.closest('.product-item');

        if (!card) {
          return;
        }

        event.preventDefault();
        openModal(card);
      });

      if (closeButton) {
        closeButton.addEventListener('click', closeModal);
      }

      if (overlay) {
        overlay.addEventListener('click', closeModal);
      }

      modal.addEventListener('click', (event) => {
        if (dialog && !dialog.contains(event.target) && event.target !== closeButton) {
          closeModal();
        }
      });

      escapeHandlers.push(closeModal);
    };

    const initVideoModal = () => {
      const modal = root.querySelector('.video-modal');

      if (!modal) {
        return;
      }

      const dialog = modal.querySelector('.video-modal__dialog');
      const overlay = modal.querySelector('.video-modal__overlay');
      const closeButton = modal.querySelector('.video-modal__close');
      const iframe = modal.querySelector('.video-modal__iframe');

      const openModal = (videoId) => {
        if (!iframe) {
          return;
        }

        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';

        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        lockScroll();

        if (closeButton) {
          closeButton.focus();
        }
      };

      const closeModal = () => {
        if (!modal.classList.contains('is-active')) {
          return;
        }

        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        unlockScroll();

        if (iframe) {
          iframe.src = '';
        }
      };

      root.addEventListener('click', (event) => {
        const trigger = event.target.closest('.features-item__video');

        if (!trigger || !root.contains(trigger)) {
          return;
        }

        const videoId = trigger.dataset.youtubeId;

        if (!videoId) {
          return;
        }

        event.preventDefault();
        openModal(videoId);
      });

      if (closeButton) {
        closeButton.addEventListener('click', closeModal);
      }

      if (overlay) {
        overlay.addEventListener('click', closeModal);
      }

      modal.addEventListener('click', (event) => {
        if (dialog && !dialog.contains(event.target)) {
          closeModal();
        }
      });

      escapeHandlers.push(closeModal);
    };

    const initBurgerMenu = () => {
      const head = root.querySelector('.head');

      if (!head) {
        return;
      }

      const burger = head.querySelector('.head__burger');
      const menu = head.querySelector('.header__menu');

      if (!burger || !menu) {
        return;
      }

      const desktopQuery = window.matchMedia('(min-width: 992px)');

      const closeMenu = () => {
        if (!head.classList.contains('is-menu-open')) {
          return;
        }

        head.classList.remove('is-menu-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      };

      const openMenu = () => {
        head.classList.add('is-menu-open');
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Close menu');
      };

      burger.addEventListener('click', () => {
        if (head.classList.contains('is-menu-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      escapeHandlers.push(closeMenu);

      const handleDesktop = (event) => {
        if (event.matches) {
          closeMenu();
        }
      };

      if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', handleDesktop);
      } else {
        desktopQuery.addListener(handleDesktop);
      }
    };

    const initScrollHeader = () => {
      const head = root.querySelector('.head');

      if (!head) {
        return;
      }

      let ticking = false;

      const updateHeader = () => {
        head.classList.toggle('is-scrolled', window.scrollY > 40);
        ticking = false;
      };

      const onScroll = () => {
        if (ticking) {
          return;
        }

        ticking = true;
        window.requestAnimationFrame(updateHeader);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      updateHeader();
    };

    initCarousels();
    initModal();
    initVideoModal();
    initBurgerMenu();
    initScrollHeader();
  };

  const start = () => {
    initLanding(document.getElementById('landing-frame'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
