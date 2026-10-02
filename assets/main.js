(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // theme toggle
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  document.getElementById('themeBtn').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  // mobile menu
  const pill = document.querySelector('.pill');
  document.getElementById('menuBtn').addEventListener('click', () => pill.classList.toggle('open'));
  pill.querySelectorAll('a').forEach(a => a.addEventListener('click', () => pill.classList.remove('open')));

  // active nav link
  const links = [...pill.querySelectorAll('a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });

  // typing headline
  const typed = document.getElementById('typed');
  const words = ['clean dashboards', 'SQL insights', 'automated reports', 'decisions'];
  if (reduce) { typed.textContent = words[0]; }
  else {
    let w = 0, i = 0, del = false;
    (function tick() {
      const word = words[w];
      typed.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && i === 0) { del = false; w = (w + 1) % words.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 85);
    })();
  }

  // count-up
  const count = el => {
    const end = parseFloat(el.dataset.to), dec = (el.dataset.to.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = end.toFixed(dec) + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  };

  // reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-to]').forEach(count);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (el.dataset.delay || 0) + 'ms';
    io.observe(el);
  });

  // project filters
  const btns = document.querySelectorAll('.filters button');
  const cards = document.querySelectorAll('.proj');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && !c.dataset.cat.split(' ').includes(f)));
  }));

  document.getElementById('year').textContent = new Date().getFullYear();
})();
