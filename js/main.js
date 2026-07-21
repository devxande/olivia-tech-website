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

    setupContactForm();
    setupScrollProgress();
    setupReveal();
    setupHeroParallax();
    setupNavbarState();
  });

  // --- Interações visuais --------------------------------------------------

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barra fina de progresso de rolagem no topo.
  function setupScrollProgress() {
    var bar = document.querySelector('.scroll-progress__bar');
    if (!bar) return;

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var ratio = max > 0 ? Math.min(window.pageYOffset / max, 1) : 0;
      bar.style.transform = 'scaleX(' + ratio + ')';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  // Reveal ao rolar: a classe .reveal só é adicionada aqui, então sem JS
  // o conteúdo permanece totalmente visível.
  function setupReveal() {
    var groups = [
      { sel: '.services__head' },
      { sel: '.service-card', stagger: 70 },
      { sel: '.services__cta' },
      { sel: '.about__intro' },
      { sel: '.principle', stagger: 60 },
      { sel: '.howto__head' },
      { sel: '.step-card', stagger: 80 },
      { sel: '.howto__cta' },
      { sel: '.availability-section__inner' },
      { sel: '.availability-card', stagger: 70 },
      { sel: '.contact__intro' },
      { sel: '.contact__card' }
    ];

    var targets = [];
    groups.forEach(function (g) {
      var nodes = document.querySelectorAll(g.sel);
      nodes.forEach(function (node, i) {
        node.classList.add('reveal');
        if (g.stagger) node.style.setProperty('--reveal-delay', (i * g.stagger) + 'ms');
        targets.push(node);
      });
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (t) { observer.observe(t); });
  }

  // Parallax muito leve apenas nos elementos decorativos do hero.
  function setupHeroParallax() {
    if (prefersReducedMotion) return;
    var hero = document.querySelector('.hero');
    var glow = document.querySelector('.hero__glow');
    var topo = document.querySelector('.hero__topology');
    if (!hero || (!glow && !topo)) return;

    var ticking = false;
    function update() {
      var offset = window.pageYOffset;
      // só desloca enquanto o hero está visível
      if (offset < hero.offsetHeight) {
        if (glow) glow.style.setProperty('--glow-shift', (offset * 0.12) + 'px');
        if (topo) topo.style.setProperty('--topo-shift', (offset * -0.06) + 'px');
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  // Estado do navbar: sombra/opacidade ao sair do topo.
  function setupNavbarState() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var ticking = false;
    function update() {
      navbar.classList.toggle('is-scrolled', window.pageYOffset > 8);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  // --- Contact form -------------------------------------------------------

  // Número de WhatsApp que recebe as solicitações (formato internacional, só dígitos).
  var WHATSAPP_NUMBER = '5561981399376';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setupContactForm() {
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate(form)) return;

      var url = openWhatsApp({
        name: value(form, 'name'),
        company: value(form, 'company'),
        email: value(form, 'email'),
        phone: value(form, 'phone'),
        message: value(form, 'message')
      });
      showSuccess(form, success, url);
    });

    // Limpa o erro do campo assim que o usuário começa a corrigi-lo.
    form.querySelectorAll('.field__control').forEach(function (input) {
      input.addEventListener('input', function () { clearFieldError(input); });
    });
  }

  function validate(form) {
    var ok = true;
    var required = [
      { id: 'name', msg: 'Informe seu nome.' },
      { id: 'company', msg: 'Informe o nome da empresa.' },
      { id: 'email', msg: 'Informe um e-mail.' }
    ];

    required.forEach(function (f) {
      var input = form.querySelector('#' + f.id);
      if (!input.value.trim()) {
        setFieldError(input, f.msg);
        ok = false;
      }
    });

    var email = form.querySelector('#email');
    if (email.value.trim() && !EMAIL_RE.test(email.value.trim())) {
      setFieldError(email, 'Digite um e-mail válido.');
      ok = false;
    }

    if (!ok) {
      var firstError = form.querySelector('.field__control--error');
      if (firstError) firstError.focus();
    }
    return ok;
  }

  function openWhatsApp(data) {
    var lines = [
      'Olá! Gostaria de solicitar um diagnóstico de infraestrutura.',
      '',
      'Nome: ' + data.name,
      'Empresa: ' + data.company,
      'E-mail: ' + data.email
    ];
    if (data.phone) lines.push('Telefone: ' + data.phone);
    if (data.message) lines.push('', 'Mensagem: ' + data.message);

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
    return url;
  }

  function showSuccess(form, success, url) {
    // Fallback caso o pop-up do WhatsApp tenha sido bloqueado.
    var retry = document.getElementById('contact-whatsapp-retry');
    if (retry && url) retry.href = url;

    form.classList.add('is-hidden');
    success.classList.remove('is-hidden');
    renderIcons();
  }

  // --- helpers ------------------------------------------------------------

  function value(form, id) {
    var el = form.querySelector('#' + id);
    return el ? el.value.trim() : '';
  }

  function setFieldError(input, msg) {
    input.classList.add('field__control--error');
    input.setAttribute('aria-invalid', 'true');
    var error = document.getElementById(input.id + '-error');
    if (error) {
      error.textContent = msg;
      error.hidden = false;
    }
  }

  function clearFieldError(input) {
    if (!input.classList.contains('field__control--error')) return;
    input.classList.remove('field__control--error');
    input.removeAttribute('aria-invalid');
    var error = document.getElementById(input.id + '-error');
    if (error) {
      error.textContent = '';
      error.hidden = true;
    }
  }
})();
