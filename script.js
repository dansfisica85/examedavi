const searchInput = document.querySelector('#search');
const cards = [...document.querySelectorAll('.document-card')];
const emptyState = document.querySelector('#empty-state');

const normalize = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

searchInput?.addEventListener('input', (event) => {
  const query = normalize(event.target.value);
  let visible = 0;

  cards.forEach((card) => {
    const content = normalize(`${card.dataset.search ?? ''} ${card.textContent}`);
    const matches = content.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  if (emptyState) emptyState.hidden = visible !== 0;
});

document.querySelector('#logout')?.addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    location.replace('/login');
  }
});
