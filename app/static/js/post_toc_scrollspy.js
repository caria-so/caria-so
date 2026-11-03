(function () {
  const toc = document.querySelector('.toc-container');
  const article = document.querySelector('.post-content.prose');
  if (!toc || !article) return;

  const links = [...toc.querySelectorAll('a[href^="#"]')];
  if (!links.length) return;

  const sections = links
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const el = document.getElementById(id);
      return el ? { link, el, id } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const scrollOffset = () => {
    const nav = document.querySelector('.theme-nav-bg');
    return (nav ? nav.getBoundingClientRect().height : 0) + 24;
  };

  let activeId = null;

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;

    links.forEach((a) => {
      const hrefId = decodeURIComponent(a.getAttribute('href').slice(1));
      const on = hrefId === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    toc.querySelectorAll('li').forEach((li) => {
      li.classList.toggle('is-active', Boolean(li.querySelector('a.is-active')));
    });
  }

  function updateFromScroll() {
    const marker = scrollOffset();
    let current = sections[0].id;

    for (const { el, id } of sections) {
      if (el.getBoundingClientRect().top <= marker) current = id;
    }

    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (nearBottom) current = sections[sections.length - 1].id;

    setActive(current);
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateFromScroll();
        ticking = false;
      });
    },
    { passive: true },
  );

  window.addEventListener('resize', updateFromScroll, { passive: true });

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - scrollOffset() + 4;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
      setActive(id);
    });
  });

  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (document.getElementById(id)) setActive(id);
  }

  updateFromScroll();
})();
