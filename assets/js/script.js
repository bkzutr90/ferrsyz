(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Tahun di footer */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Navigasi: tampilan berubah saat di-scroll */
  const nav = $('#nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Muncul perlahan saat masuk layar */
  const targets = $$('.sec-head, .toolbar, .card, .step, .contact, .ticker');
  targets.forEach((el, i) => {
    el.classList.add('rv');
    el.style.setProperty('--rd', ((i % 3) * 0.07).toFixed(2) + 's');
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('in'));
  }

  /* Hitung naik pada angka statistik */
  if (!reduceMotion) {
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const t0 = performance.now() + 400;
      const dur = 1100;
      el.textContent = '0';
      const tick = (now) => {
        const p = Math.min(1, Math.max(0, (now - t0) / dur));
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* Katalog: sorotan cahaya mengikuti kursor di kartu */
  const cards = $$('.card');
  if (finePointer && !reduceMotion) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* Katalog: saring berdasarkan kategori */
  const filters = $$('.filter');
  const count = $('#count');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      cards.forEach((card) => {
        const match = f === 'semua' || card.dataset.tags.split(' ').includes(f);
        card.hidden = !match;
        if (match) { shown++; card.classList.add('in'); }
      });
      if (count) count.textContent = shown + ' bot';
    });
  });
})();
