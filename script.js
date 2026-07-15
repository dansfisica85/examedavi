const searchInput = document.querySelector('#search');
const cards = [...document.querySelectorAll('.document-card')];
const emptyState = document.querySelector('#empty-state');

const normalize = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

searchInput.addEventListener('input', (event) => {
  const query = normalize(event.target.value);
  let visible = 0;

  cards.forEach((card) => {
    const content = normalize(`${card.dataset.search} ${card.textContent}`);
    const matches = content.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  emptyState.hidden = visible !== 0;
});
