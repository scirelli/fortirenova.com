(() => {
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-mobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open', !expanded);
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });

  // Mark active nav link
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach((a) => {
    const href = new URL(a.href).pathname.replace(/\/+$/, '') || '/';
    if (href === path || (path.endsWith('index.html') && href === '/')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
