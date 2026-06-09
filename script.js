// ===== スクロール フェードイン =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// ===== ハンバーガーメニュー =====
const toggle   = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
  });
});

// ===== StandFM 最新エピソード（RSS） =====
async function loadStandFM() {
  const rssUrl    = 'https://stand.fm/rss/67f0d8a087fe90ae17859979';
  const proxyUrl  = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
  const container = document.getElementById('standfm-episodes');
  if (!container) return;

  try {
    const res   = await fetch(proxyUrl);
    const data  = await res.json();
    const xml   = new DOMParser().parseFromString(data.contents, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item')).slice(0, 5);

    if (!items.length) {
      container.innerHTML = '<p class="episodes-loading">エピソードが見つかりませんでした。</p>';
      return;
    }

    container.innerHTML = items.map((item) => {
      const title   = item.querySelector('title')?.textContent?.trim() ?? '';
      const pubDate = item.querySelector('pubDate')?.textContent ?? '';
      const link    = item.querySelector('guid')?.textContent?.trim() ?? '#';

      const date    = new Date(pubDate);
      const dateStr = isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });

      return `<a href="${link}" class="episode-item" target="_blank" rel="noopener noreferrer">
        <span class="episode-title">${title}</span>
        <span class="episode-date">${dateStr}</span>
      </a>`;
    }).join('');
  } catch {
    container.innerHTML = '<p class="episodes-loading">読み込みに失敗しました。</p>';
  }
}

loadStandFM();
