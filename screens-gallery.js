/* BASNIN ECOGENESIS — real app screenshots gallery */
(() => {
  const root = document.querySelector('.real-screens');
  if (!root) return;
  const image = root.querySelector('#screens-active-image');
  const title = root.querySelector('#screens-active-title');
  const description = root.querySelector('#screens-active-desc');
  const counter = root.querySelector('#screens-counter');
  const tabs = [...root.querySelectorAll('.screens-tab')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(item => {
        item.classList.toggle('is-active', item === tab);
        item.setAttribute('aria-pressed', String(item === tab));
      });
      image.src = 'assets/screenshots/app-screen-' + tab.dataset.screen + '.webp';
      image.alt = tab.dataset.alt;
      title.textContent = tab.dataset.title;
      description.textContent = tab.dataset.desc;
      counter.textContent = String(index + 1).padStart(2, '0') + ' / 07';
    });
  });
})();
