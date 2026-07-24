// Olivia Tech — Home page behavior

(function () {
  'use strict';

  function scrollToContact() {
    var el = document.getElementById('contato');
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', function () {
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
    setupHeroVideo();
    setupHeroMesh();
    setupBandParallax();
    setupSpotlight();
    setupNavbarState();
    setupMobileNav();
    setupWhatsappLinks();
    setupFooterYear();
  });

  // Ano do rodapé (movido do HTML inline para permitir CSP sem 'unsafe-inline').
  function setupFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

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
      { sel: '.services__diagram' },
      { sel: '.services__cta' },
      { sel: '.media-card', stagger: 80 },
      { sel: '.about__intro' },
      { sel: '.media--about' },
      { sel: '.principle', stagger: 60 },
      { sel: '.band__head' },
      { sel: '.band__item', stagger: 90 },
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

  // Vídeo de fundo do hero — opt-in por data-hero-video no .hero__bg.
  // Sem o atributo (estado atual do site) nada é criado nem baixado.
  function setupHeroVideo() {
    var bg = document.querySelector('.hero__bg');
    var hero = document.querySelector('.hero');
    if (!bg || !hero) return;

    var base = bg.getAttribute('data-hero-video');
    if (!base) return;
    if (prefersReducedMotion) return;
    // telas pequenas ficam no fundo estático: o vídeo nem chega a ser pedido
    if (!window.matchMedia || !window.matchMedia('(min-width: 900px)').matches) return;

    // respeita economia de dados e conexões lentas
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || ''))) return;

    var video = document.createElement('video');
    video.className = 'hero__video';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'auto';
    video.poster = base + '-poster.jpg';

    // O evento de erro de um <source> não borbulha até o <video>: é preciso
    // ouvir cada um e só desistir quando todos os formatos falharem.
    var formats = [['webm', 'video/webm'], ['mp4', 'video/mp4']];
    var failed = 0;
    formats.forEach(function (fmt) {
      var source = document.createElement('source');
      source.src = base + '.' + fmt[0];
      source.type = fmt[1];
      source.addEventListener('error', function () {
        failed++;
        if (failed === formats.length) removeVideo();
      });
      video.appendChild(source);
    });

    function removeVideo() {
      hero.classList.remove('is-video-on');
      if (video.parentNode) video.parentNode.removeChild(video);
    }

    // o véu entra junto com o vídeo, não antes: sem isso a aurora escureceria à toa
    video.addEventListener('canplay', function () {
      video.classList.add('is-ready');
      hero.classList.add('is-video-on');
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () {});
    }, { once: true });

    video.addEventListener('error', removeVideo);

    bg.insertBefore(video, bg.firstChild);
    pauseWhenOffscreen(hero, function () { video.play().catch(function () {}); }, function () { video.pause(); });
  }

  // Malha de rede animada no hero: nós que derivam, arestas por proximidade
  // e um pulso ocasional percorrendo uma delas.
  function setupHeroMesh() {
    if (prefersReducedMotion) return;

    var hero = document.querySelector('.hero');
    var canvas = document.querySelector('.hero__mesh');
    if (!hero || !canvas || !canvas.getContext) return;
    // no mobile a topologia estática já resolve, e sem canvas se economiza bateria
    if (!window.matchMedia || !window.matchMedia('(min-width: 900px)').matches) return;

    var ctx = canvas.getContext('2d');
    var LINK = 170;              // distância máxima entre nós conectados
    var LINK2 = LINK * LINK;
    var FRAME = 1000 / 30;       // teto de 30 fps: suficiente para um movimento lento
    var PULSE_EVERY = 2200;

    var nodes = [];
    var pulses = [];
    var w = 0, h = 0;
    var rafId = 0, last = 0, sincePulse = 0, visible = true;

    function resize() {
      var rect = hero.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var target = Math.max(18, Math.min(44, Math.round(w * h / 26000)));
      nodes = [];
      for (var i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - .5) * .20,
          vy: (Math.random() - .5) * .20,
          r: Math.random() < .18 ? 2.6 : 1.5
        });
      }
      pulses = [];
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        // rebate nas bordas em vez de reaparecer do outro lado (menos "saltos")
        if (n.x < 0 || n.x > w) { n.vx *= -1; n.x = Math.max(0, Math.min(w, n.x)); }
        if (n.y < 0 || n.y > h) { n.vy *= -1; n.y = Math.max(0, Math.min(h, n.y)); }
      }
    }

    // escolhe um par ainda conectado, a partir de um ponto aleatório da lista
    function spawnPulse() {
      var n = nodes.length;
      if (n < 2) return;
      var start = Math.floor(Math.random() * n);
      for (var k = 0; k < n; k++) {
        var i = (start + k) % n;
        for (var j = 0; j < n; j++) {
          if (i === j) continue;
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < LINK2) {
            pulses.push({ a: i, b: j, t: 0 });
            return;
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // arestas
      ctx.lineWidth = 1;
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          var alpha = (1 - Math.sqrt(d2) / LINK) * .32;
          ctx.strokeStyle = 'rgba(79, 216, 224, ' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // nós
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = n.r > 2 ? 'rgba(79, 216, 224, .75)' : 'rgba(79, 216, 224, .42)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulsos percorrendo as arestas
      for (var p = pulses.length - 1; p >= 0; p--) {
        var pulse = pulses[p];
        var a = nodes[pulse.a];
        var b = nodes[pulse.b];
        if (!a || !b || pulse.t >= 1) { pulses.splice(p, 1); continue; }
        var x = a.x + (b.x - a.x) * pulse.t;
        var y = a.y + (b.y - a.y) * pulse.t;
        var fade = Math.sin(pulse.t * Math.PI);
        ctx.fillStyle = 'rgba(79, 216, 224, ' + (fade * .9).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(now) {
      rafId = window.requestAnimationFrame(loop);
      if (!last) last = now;
      var dt = now - last;
      if (dt < FRAME) return;
      last = now;

      sincePulse += dt;
      if (sincePulse >= PULSE_EVERY) { sincePulse = 0; spawnPulse(); }
      for (var p = 0; p < pulses.length; p++) pulses[p].t += dt / 1400;

      step();
      draw();
      hero.classList.add('is-mesh-on');
    }

    function start() {
      if (rafId || !visible) return;
      last = 0;
      rafId = window.requestAnimationFrame(loop);
    }
    function stop() {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    resize();
    start();

    // fora da viewport ou em aba escondida, a malha não gasta nada
    pauseWhenOffscreen(hero, function () { visible = true; start(); }, function () { visible = false; stop(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    var resizeTimer = 0;
    function scheduleResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 200);
    }
    // ResizeObserver e não só window.resize: a altura do hero muda sozinha
    // quando as fontes terminam de carregar, e o canvas ficaria esticado.
    if ('ResizeObserver' in window) {
      new ResizeObserver(scheduleResize).observe(hero);
    } else {
      window.addEventListener('resize', scheduleResize, { passive: true });
    }
  }

  // Deslocamento leve da arte de fundo da faixa "Operação" durante a rolagem.
  function setupBandParallax() {
    if (prefersReducedMotion) return;
    var band = document.querySelector('.band');
    var media = document.querySelector('.band__media');
    if (!band || !media) return;

    var ticking = false;
    function update() {
      var rect = band.getBoundingClientRect();
      var span = window.innerHeight + rect.height;
      // -1 quando a faixa entra por baixo, 1 quando sai por cima
      var progress = (window.innerHeight - rect.top) / span * 2 - 1;
      media.style.transform = 'translate3d(0, ' + (progress * -18).toFixed(1) + 'px, 0) scale(1.08)';
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

  // Liga/desliga um efeito conforme o elemento entra e sai da viewport.
  function pauseWhenOffscreen(el, onEnter, onLeave) {
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) onEnter(); else onLeave();
      });
    }, { threshold: 0 }).observe(el);
  }

  // Spotlight que segue o cursor nos cards (só em ponteiro fino, com hover real).
  function setupSpotlight() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var cards = document.querySelectorAll('.media-card, .service-card, .step-card');
    if (!cards.length) return;

    var pending = null;
    function apply() {
      if (pending) {
        pending.el.style.setProperty('--mx', pending.x + 'px');
        pending.el.style.setProperty('--my', pending.y + 'px');
        pending = null;
      }
    }
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var queued = pending !== null;
        pending = { el: card, x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) };
        if (!queued) window.requestAnimationFrame(apply);
      }, { passive: true });
    });
  }

  // Menu mobile: abre/fecha o painel de navegação e mantém o ARIA em sincronia.
  function setupMobileNav() {
    var navbar = document.querySelector('.navbar');
    var toggle = document.querySelector('.navbar__toggle');
    var panel = document.getElementById('primary-nav');
    if (!navbar || !toggle || !panel) return;

    function open() {
      navbar.classList.add('is-nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
    }
    function close() {
      navbar.classList.remove('is-nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }
    function isOpen() { return navbar.classList.contains('is-nav-open'); }

    toggle.addEventListener('click', function () {
      if (isOpen()) close(); else open();
    });

    // escolher um destino fecha o menu (o clique inside navbar não dispara o
    // fechamento por clique-fora, então basta fechar aqui)
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    // Escape fecha e devolve o foco ao botão
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { close(); toggle.focus(); }
    });

    // clique fora da barra fecha
    document.addEventListener('click', function (e) {
      if (isOpen() && !navbar.contains(e.target)) close();
    });

    // ao voltar para o desktop, garante que o estado não fique preso em aberto
    if (window.matchMedia) {
      var mq = window.matchMedia('(min-width: 901px)');
      var onChange = function (ev) { if (ev.matches) close(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
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

  // Fonte única do número de WhatsApp (formato internacional, só dígitos).
  // Para trocar o número, altere APENAS esta linha: o setupWhatsappLinks()
  // preenche todos os links marcados com data-wa a partir dela, e o formulário
  // monta a URL com a mensagem usando a mesma constante. Os href no HTML são
  // apenas fallback para o caso raro de o JS não rodar.
  var WHATSAPP_NUMBER = '5561981399376';

  // Preenche os links simples de WhatsApp (data-wa) a partir da constante acima.
  function setupWhatsappLinks() {
    var url = 'https://wa.me/' + WHATSAPP_NUMBER;
    document.querySelectorAll('a[data-wa]').forEach(function (a) {
      a.setAttribute('href', url);
    });
  }

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
