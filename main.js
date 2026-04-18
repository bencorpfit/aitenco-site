/* -- LOGO INTRO DISMISS -- */
(function () {
  var intro = document.getElementById('logoIntro');
  if (!intro) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    intro.classList.add('done');
    return;
  }
  setTimeout(function () {
    intro.classList.add('done');
    setTimeout(function () { intro.remove(); }, 1000);
  }, 2400);
})();

/* -- WORKFLOW DEMO ANIMATION -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.wf-item-out').forEach(function (el) { el.classList.add('active'); });
    return;
  }

  var inputs = document.querySelectorAll('.wf-item-in');
  var outputs = document.querySelectorAll('.wf-item-out');
  if (!inputs.length) return;

  function runCycle() {
    inputs.forEach(function (el) { el.classList.remove('struck'); });
    outputs.forEach(function (el) { el.classList.remove('active'); });

    inputs.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('struck'); }, 800 + i * 600);
    });

    outputs.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('active'); }, 1600 + i * 600);
    });

    setTimeout(runCycle, 8000);
  }

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      runCycle();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(document.querySelector('.workflow-demo'));
})();

/* -- NEURAL NETWORK CANVAS (INTERACTIVE) -- */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const mql = window.matchMedia('(max-width: 768px)');
  if (mql.matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;
  let mouse = { x: -1000, y: -1000 };
  let pulseWave = 0;

  canvas.parentElement.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  function initNodes(count) {
    count = count || 70;
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        ox: 0, oy: 0,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2
      });
      nodes[i].ox = nodes[i].x;
      nodes[i].oy = nodes[i].y;
    }
  }

  function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pulseWave += 0.015;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          var baseAlpha = (1 - dist / 160) * 0.25;
          var midX = (nodes[i].x + nodes[j].x) / 2;
          var midY = (nodes[i].y + nodes[j].y) / 2;
          var waveDist = Math.sqrt((midX - canvas.width * ((pulseWave % 1))) * (midX - canvas.width * ((pulseWave % 1))) + (midY - canvas.height / 2) * (midY - canvas.height / 2));
          var waveBoost = Math.max(0, 1 - waveDist / 200) * 0.4;
          var alpha = Math.min(baseAlpha + waveBoost, 0.7);

          ctx.beginPath();
          if (waveBoost > 0.05) {
            ctx.strokeStyle = 'rgba(232,200,106,' + alpha + ')';
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = 'rgba(201,168,76,' + alpha + ')';
            ctx.lineWidth = 0.8;
          }
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(function (n) {
      var dmx = n.x - mouse.x;
      var dmy = n.y - mouse.y;
      var mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      var repelRadius = 120;

      if (mouseDist < repelRadius && mouseDist > 0) {
        var force = (1 - mouseDist / repelRadius) * 2.5;
        n.x += (dmx / mouseDist) * force;
        n.y += (dmy / mouseDist) * force;
      } else {
        n.x += (n.ox - n.x) * 0.01;
        n.y += (n.oy - n.y) * 0.01;
      }

      n.pulse += 0.04;
      var glowAlpha = 0.5 + Math.sin(n.pulse) * 0.3;
      var r = n.r * (0.9 + Math.sin(n.pulse) * 0.2);

      var nearMouse = mouseDist < 150;

      ctx.beginPath();
      ctx.arc(n.x, n.y, r + (nearMouse ? 8 : 4), 0, Math.PI * 2);
      ctx.fillStyle = nearMouse ? 'rgba(232,200,106,0.08)' : 'rgba(201,168,76,0.04)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, nearMouse ? r * 1.3 : r, 0, Math.PI * 2);
      ctx.fillStyle = nearMouse ? 'rgba(232,200,106,' + (glowAlpha + 0.2) + ')' : 'rgba(201,168,76,' + glowAlpha + ')';
      ctx.shadowBlur = nearMouse ? 16 : 8;
      ctx.shadowColor = nearMouse ? 'rgba(232,200,106,0.7)' : 'rgba(201,168,76,0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      n.ox += n.vx;
      n.oy += n.vy;
      n.x += n.vx;
      n.y += n.vy;
      if (n.ox < 0 || n.ox > canvas.width) n.vx *= -1;
      if (n.oy < 0 || n.oy > canvas.height) n.vy *= -1;
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

/* -- ANIMATED COUNTERS (HERO STATS) -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function animateValue(el, start, end, suffix, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * (end - start) + start);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statEls = document.querySelectorAll('.stat-val');
  var observed = false;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !observed) {
        observed = true;
        statEls.forEach(function (el) {
          var text = el.textContent.trim();
          if (text === '20+') {
            el.textContent = '0+';
            animateValue(el, 0, 20, '+', 1500);
          }
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (statEls.length) observer.observe(statEls[0]);
})();

/* -- HERO TEXT REVEAL -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var h1 = document.querySelector('h1');
  if (!h1) return;

  var children = Array.from(h1.childNodes);
  h1.innerHTML = '';
  h1.classList.add('hero-text-reveal');

  var delay = 200;
  children.forEach(function (node) {
    if (node.nodeType === 3) {
      var words = node.textContent.split(/(\s+)/);
      words.forEach(function (w) {
        if (w.match(/^\s+$/)) {
          h1.appendChild(document.createTextNode(w));
          return;
        }
        if (!w) return;
        var s = document.createElement('span');
        s.textContent = w;
        h1.appendChild(s);
        setTimeout(function () { s.classList.add('visible'); }, delay);
        delay += 100;
      });
    } else if (node.nodeType === 1) {
      var clone = node.cloneNode(false);
      var innerWords = node.textContent.split(/(\s+)/);
      innerWords.forEach(function (w) {
        if (w.match(/^\s+$/)) {
          clone.appendChild(document.createTextNode(w));
          return;
        }
        if (!w) return;
        var s = document.createElement('span');
        s.textContent = w;
        clone.appendChild(s);
        setTimeout(function () { s.classList.add('visible'); }, delay);
        delay += 100;
      });
      h1.appendChild(clone);
    }
  });
})();

/* -- SERVICE CARD GLOW + 3D TILT -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.service-card').forEach(function (card, i) {
    card.style.setProperty('--reveal-i', i);

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var midX = rect.width / 2;
      var midY = rect.height / 2;
      var rotateY = ((x - midX) / midX) * 4;
      var rotateX = ((midY - y) / midY) * 4;

      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.setProperty('--rx', rotateX + 'deg');
      card.style.setProperty('--ry', rotateY + 'deg');
    });

    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
})();

/* -- STAGGERED REVEAL INDEX -- */
(function () {
  document.querySelectorAll('.principles-grid .principle-card').forEach(function (el, i) {
    el.style.setProperty('--reveal-i', i);
  });
  document.querySelectorAll('.impact-grid .impact-card').forEach(function (el, i) {
    el.style.setProperty('--reveal-i', i);
  });
})();

/* -- COMPARISON TABLE HIGHLIGHT ON SCROLL -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var diffCol = document.querySelector('.diff-col:last-child');
  if (!diffCol) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        diffCol.classList.add('highlighted');
        var items = diffCol.querySelectorAll('.diff-item');
        items.forEach(function (item, i) {
          setTimeout(function () {
            item.classList.add('highlight');
          }, 300 + i * 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(diffCol);
})();

/* -- IMPACT NUMBERS ANIMATE -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function animateImpact(el, end, suffix, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * end);
      el.textContent = (suffix === '%' ? '-' : '') + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var impactSection = document.getElementById('impact');
  if (!impactSection) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var nums = impactSection.querySelectorAll('.impact-num');
        nums.forEach(function (el) {
          var text = el.textContent.trim();
          if (text === '-40%') { el.textContent = '0%'; animateImpact(el, 40, '%', 1200); }
          else if (text === '-60%') { el.textContent = '0%'; animateImpact(el, 60, '%', 1400); }
          else if (text === '-30%') { el.textContent = '0%'; animateImpact(el, 30, '%', 1000); }
          else if (text === '2x') { el.textContent = '0x'; animateImpact(el, 2, 'x', 800); }
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(impactSection);
})();

/* -- DASHBOARD APPROACH ANIMATION -- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.dash-layer').forEach(function (el) { el.classList.add('active'); });
    return;
  }

  var steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  var dashAudit = document.getElementById('dashAudit');
  var dashDesign = document.getElementById('dashDesign');
  var dashLive = document.getElementById('dashLive');
  dashAudit.classList.remove('active');
  dashDesign.classList.remove('active');
  dashLive.classList.remove('active');

  var triggered = { 0: false, 1: false, 3: false };

  function animateNumber(el, target, suffix, duration) {
    var startTime = null;
    function tick(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      if (suffix === '$') {
        el.innerHTML = '$' + val.toLocaleString() + '<span class="dash-unit">/mo</span>';
      } else {
        el.innerHTML = val + '<span class="dash-unit">' + suffix + '</span>';
      }
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function activateStep(index) {
    if (index === 0 && !triggered[0]) {
      triggered[0] = true;
      dashAudit.classList.add('active');
      animateNumber(document.getElementById('dashHours'), 47, 'hrs/week', 1200);
      animateNumber(document.getElementById('dashWasted'), 18800, '$', 1400);
    }
    if ((index === 1 || index === 2) && !triggered[1]) {
      triggered[1] = true;
      dashDesign.classList.add('active');
      animateNumber(document.getElementById('dashSavings'), 11200, '$', 1200);
      setTimeout(function () {
        document.getElementById('dashPayback').innerHTML = '6<span class="dash-unit">weeks</span>';
      }, 800);
    }
    if (index === 3 && !triggered[3]) {
      triggered[3] = true;
      dashLive.classList.add('active');
    }
  }

  var dashPreview = document.getElementById('dashPreview');
  if (!dashPreview) return;

  function startDashAnimation() {
    activateStep(0);
    setTimeout(function () { activateStep(1); }, 1500);
    setTimeout(function () { activateStep(3); }, 3000);
  }

  var rect = dashPreview.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    startDashAnimation();
  } else {
    var sectionObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startDashAnimation();
        sectionObs.disconnect();
      }
    }, { threshold: 0.05 });
    sectionObs.observe(dashPreview);
  }

  window.addEventListener('scroll', function dashScroll() {
    var r = dashPreview.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      startDashAnimation();
      window.removeEventListener('scroll', dashScroll);
    }
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
