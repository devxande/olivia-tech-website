// Olivia Tech — Home page behavior

(function () {
  'use strict';

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function scrollToContact() {
    var el = document.getElementById('contato');
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderIcons();

    // CTA buttons that should jump to the contact section
    document.querySelectorAll('[data-scroll-contact]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToContact();
      });
    });

    // Contact form: show the success state on submit (no backend wired yet)
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (form && success) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.classList.add('is-hidden');
        success.classList.remove('is-hidden');
        renderIcons();
      });
    }
  });
})();
