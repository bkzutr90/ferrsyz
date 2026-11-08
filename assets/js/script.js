(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Tahun di footer */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Bintang latar, jumlahnya menyesuaikan lebar layar */
  const stars = $('.bg .stars');
  if (stars) {
    const total = innerWidth < 700 ? 34 : 72;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const s = document.createElement('i');
      const big = Math.random() > 0.9;
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.setProperty('--o', (0.25 + Math.random() * 0.6).toFixed(2));
      s.style.setProperty('--d', (2.5 + Math.random() * 5).toFixed(1) + 's');
      s.style.animationDelay = (-Math.random() * 6).toFixed(1) + 's';
      if (big) { s.style.width = s.style.height = '3px'; }
      frag.appendChild(s);
    }
    stars.appendChild(frag);
  }

  /* Cahaya biru halus yang mengikuti kursor */
  const root = document.documentElement;
  if (finePointer && !reduceMotion) {
    let tx = innerWidth * 0.7, ty = innerHeight * 0.2, x = tx, y = ty, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      root.style.setProperty('--gx', x.toFixed(1) + 'px');
      root.style.setProperty('--gy', y.toFixed(1) + 'px');
      raf = (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* Header berubah saat halaman di-scroll */
  const bar = $('#top-bar');
  const onScroll = () => bar && bar.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Orbit: hentikan animasi SVG kalau pengguna meminta gerak dikurangi */
  const orbit = $('.orbit');
  if (orbit && reduceMotion && typeof orbit.pauseAnimations === 'function') {
    orbit.pauseAnimations();
  }

  /* Katalog: buka satu bot sekali waktu */
  const items = $$('.item');
  items.forEach((item) => {
    const head = $('.item-head', item);
    head.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      items.forEach((other) => {
        other.classList.remove('open');
        $('.item-head', other).setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Katalog: saring berdasarkan kategori */
  const filters = $$('.filter');
  const count = $('#count');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      let shown = 0;
      items.forEach((item) => {
        const match = f === 'semua' || item.dataset.tags.split(' ').includes(f);
        item.hidden = !match;
        if (match) shown++;
        if (!match && item.classList.contains('open')) {
          item.classList.remove('open');
          $('.item-head', item).setAttribute('aria-expanded', 'false');
        }
      });
      if (count) count.textContent = shown + ' bot';
    });
  });

  /* Proses: garis biru terisi mengikuti scroll */
  const steps = $('#steps');
  if (steps) {
    const stepEls = $$('.step', steps);
    const update = () => {
      const rect = steps.getBoundingClientRect();
      const focus = innerHeight * 0.55;
      const p = Math.min(1, Math.max(0, (focus - rect.top) / rect.height));
      steps.style.setProperty('--p', p.toFixed(3));
      stepEls.forEach((el) => {
        el.classList.toggle('on', el.getBoundingClientRect().top < focus);
      });
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* Emblem logo: miring mengikuti kursor */
  const emblem = $('#emblem');
  if (emblem && finePointer && !reduceMotion) {
    emblem.addEventListener('pointermove', (e) => {
      const r = emblem.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      emblem.style.transform = `rotateY(${((px - 0.5) * 12).toFixed(2)}deg) rotateX(${((0.5 - py) * 12).toFixed(2)}deg)`;
      emblem.style.setProperty('--rx', (px * 100).toFixed(1) + '%');
      emblem.style.setProperty('--ry', (py * 100).toFixed(1) + '%');
    });
    emblem.addEventListener('pointerleave', () => { emblem.style.transform = ''; });
  }

  /* Salin nomor WhatsApp */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const copyBtn = $('#copy-wa');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const number = '085773305337';
      try {
        await navigator.clipboard.writeText(number);
        showToast('Nomor WhatsApp tersalin');
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = number;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast('Nomor WhatsApp tersalin');
        } catch (e) {
          showToast('Gagal menyalin. Nomornya: ' + number);
        }
        ta.remove();
      }
    });
  }
})();
