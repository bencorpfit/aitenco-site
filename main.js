/* -- NEURAL NETWORK CANVAS -- */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  // Skip canvas animation on mobile (element is hidden via CSS anyway)
  const mql = window.matchMedia('(max-width: 768px)');
  if (mql.matches) return;

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;

  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  function initNodes(count) {
    count = count || 55;
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          var alpha = (1 - dist / 140) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(201,168,76,' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(function (n) {
      n.pulse += 0.04;
      var glowAlpha = 0.5 + Math.sin(n.pulse) * 0.3;
      var r = n.r * (0.9 + Math.sin(n.pulse) * 0.2);

      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,168,76,0.04)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,168,76,' + glowAlpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(201,168,76,0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    animFrame = requestAnimationFrame(drawNeural);
  }

  resizeCanvas();
  initNodes();
  drawNeural();

  window.addEventListener('resize', function () {
    if (mql.matches) {
      cancelAnimationFrame(animFrame);
      return;
    }
    resizeCanvas();
    initNodes();
  });
})();

/* -- SCROLL REVEAL -- */
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () { entry.target.classList.add('visible'); }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });
})();

/* -- NAV SCROLL SHADOW -- */
(function () {
  var nav = document.getElementById('mainNav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
})();

/* -- HAMBURGER MENU -- */
(function () {
  var btn = document.getElementById('navHamburger');
  var links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('open');
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      btn.focus();
    }
  });

  // Focus trap when menu is open
  links.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !links.classList.contains('open')) return;
    var focusable = links.querySelectorAll('a, button');
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

/* -- CONTACT FORM -- */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.btn-submit');
    var statusEl = document.getElementById('formStatus');
    var originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending...';

    var data = {
      firstName: form.firstName.value,
      email: form.email.value,
      challenge: form.challenge.value,
      website: form.website ? form.website.value : ''
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then(function () {
        statusEl.className = 'form-status success';
        statusEl.textContent = 'Sent! We will contact you within 24 hours.';
        statusEl.setAttribute('role', 'status');
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      })
      .catch(function () {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Something went wrong. Please email us at hello@aitenco.com';
        statusEl.setAttribute('role', 'alert');
        btn.textContent = originalText;
        btn.disabled = false;
      });
  });
})();

/* -- FLOATING CTA BAR -- */
(function () {
  var floatingCta = document.getElementById('floatingCta');
  var contactSection = document.getElementById('contact');
  if (!floatingCta || !contactSection) return;

  window.addEventListener('scroll', function () {
    var heroBottom = document.getElementById('hero').getBoundingClientRect().bottom;
    var contactTop = contactSection.getBoundingClientRect().top;
    var show = heroBottom < 0 && contactTop > window.innerHeight;
    floatingCta.classList.toggle('visible', show);
  });
})();

/* -- FAQ ACCORDION -- */
(function () {
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.setAttribute('aria-expanded', 'false');

    var answer = q.nextElementSibling;
    if (answer) {
      answer.setAttribute('role', 'region');
      answer.id = answer.id || 'faq-a-' + Math.random().toString(36).substring(2, 8);
      q.setAttribute('aria-controls', answer.id);
    }

    q.addEventListener('click', function () {
      var isOpen = q.parentElement.classList.toggle('open');
      q.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
