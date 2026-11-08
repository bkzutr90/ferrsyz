(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = 'https://wa.me/6285773305337?text=';
  const INV = 'https://discord.com/users/473850235727249439';

  /* [nama, ringkasan, deskripsi, fitur, tag, client id (kosong = belum aktif), warna] */
  const bots = [
    ['Music Bot', 'Musik dari YouTube, link, dan playlist', 'Putar lagu dari YouTube, tautan langsung, dan playlist. Cocok untuk server yang ingin ada musik kapan saja.', ['Mode 24/7', 'Autoplay', 'Loop', 'Shuffle', 'Playlist'], 'aktif komunitas', '1561467218208759808', '#B9B9FF'],
    ['Ticket Bot', 'Sistem tiket bantuan untuk server', 'Member membuka tiket dari sebuah panel, memilih kategori, lalu mengisi form. Staf bisa mengambil (claim) tiket dan menentukan prioritasnya.', ['Panel tiket', 'Kategori kustom', 'Form kustom', 'Claim', 'Prioritas'], 'aktif komunitas', '1566112578814611467', '#FFD23F'],
    ['Community Bot', 'Semua kebutuhan dasar server komunitas', 'Satu bot untuk mengurus sambutan member baru, role mandiri, voice sementara, level, statistik server, sampai pelacakan undangan.', ['Welcome', 'Selfrole panel', 'Temp voice', 'Leveling', 'Server stats', 'Rank', 'Leaderboard', 'Invite tracker'], 'aktif komunitas', '1561446462657798285', '#79E0B3'],
    ['Game Kata', 'Lima permainan kata dan tebakan', 'Kumpulan game untuk menghidupkan obrolan server: sambung kata, tebak kata, tebak gambar, susun kata, dan tebak lagu.', ['Sambung kata', 'Tebak kata', 'Tebak gambar', 'Susun kata', 'Tebak lagu'], 'aktif game', '1565753628487188500', '#FF5C8A'],
    ['Game Werewolf', 'Main Werewolf bareng teman di Discord', 'Mainkan Werewolf langsung di dalam Discord, lengkap dengan banyak peran yang membuat tiap ronde berbeda.', ['Werewolf', 'Seer', 'Guardian', 'Witch', 'Hunter', 'Mayor', 'Lycan', 'Villager'], 'aktif game', '1561194019042631770', '#FF5C8A'],
    ['Security Bot', 'Perlindungan server dari raid dan scam', 'Menjaga server dari serangan massal dan tautan berbahaya, ditambah moderasi otomatis agar staf tidak kewalahan.', ['Anti-raid', 'Anti-nuke', 'Anti-scam link', 'Auto moderation'], 'komunitas', '', '#B9B9FF'],
    ['Bot AFK Voice', 'Menjaga durasi voice tetap berjalan', 'Menjaga durasi voice agar tidak tereset saat kamu keluar dari voice channel. Berguna untuk server dengan sistem level berbasis waktu voice.', ['Durasi voice terjaga', 'Tidak reset saat keluar'], 'utilitas', '', '#79E0B3'],
    ['Bot Ngobrol', 'Ngobrol anonim dengan orang baru', 'Bertemu dan ngobrol anonim dengan orang baru, langsung lewat pesan pribadi (DM) tanpa perlu membuka identitas.', ['Anonim', 'Lewat DM', 'Teman baru'], 'aktif komunitas', '1563696807043797014', '#FFD23F'],
    ['AI Community Assistant', 'Asisten AI untuk member dan moderator', 'Asisten AI yang membantu anggota menjawab pertanyaan dan membantu moderator menangani pekerjaan harian di server.', ['Bantu member', 'Bantu moderator'], 'utilitas komunitas', '', '#79E0B3'],
    ['Game Pet Virtual', 'Adopsi dan rawat hewan peliharaan virtual', 'Pendamping virtual untuk member: adopsi pet, beri makan, latih, dan rawat sampai tumbuh bersama.', ['Adopsi', 'Beri makan', 'Latih', 'Rawat'], 'aktif game', '1565820958927880354', '#FF5C8A']
  ];

  const grid = $('#grid');
  grid.innerHTML = bots.map(([name, sum, desc, chips, tags, id, color]) => {
    const wa = WA + encodeURIComponent('Halo Ferrsyz, saya tertarik dengan ' + name + '.');
    return `<li data-tags="${tags}"><article class="card" style="--c:${color}">
      <header><h3>${name}</h3><span class="badge${id ? ' on' : ''}">${id ? 'Aktif' : 'Siap dipesan'}</span></header>
      <p class="sum">${sum}</p><p>${desc}</p>
      <ul class="chips">${chips.map((c) => `<li>${c}</li>`).join('')}</ul>
      <div class="acts">${id
        ? `<a class="btn sm" href="${INV + id}" target="_blank" rel="noopener">Undang ke server</a><a class="link" href="${wa}" target="_blank" rel="noopener">Pesan versi custom</a>`
        : `<a class="btn sm" href="${wa}" target="_blank" rel="noopener">Pesan bot ini</a>`}</div>
    </article></li>`;
  }).join('');

  /* Saring katalog */
  const items = $$('li', grid), filters = $$('.filter'), count = $('#count');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.f;
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    let shown = 0;
    items.forEach((li) => {
      const ok = f === 'semua' || li.dataset.tags.split(' ').includes(f);
      li.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown + ' bot';
  }));

  /* Percakapan hero: pesan muncul satu per satu, sekali saat halaman dibuka */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('#chat .msg').forEach((m, i) => reduce ? m.classList.add('in') : setTimeout(() => m.classList.add('in'), 500 + i * 900));

  $('#year').textContent = new Date().getFullYear();

  /* Salin nomor WhatsApp */
  const toast = $('#toast');
  let timer;
  const show = (t) => {
    toast.textContent = t;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  $('#copy-wa').addEventListener('click', async () => {
    const n = '085773305337';
    try { await navigator.clipboard.writeText(n); show('Nomor WhatsApp tersalin'); }
    catch (e) { show('Gagal menyalin. Nomornya: ' + n); }
  });
})();
