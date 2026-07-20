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
  });

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
