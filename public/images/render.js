export function renderSpreadLayout(spread, deckName = "rider-waite") {
  const container = document.getElementById("cards");
  if (!container) {
    console.error("Элемент с id 'cards' не найден на странице.");
    return;
  }

  container.innerHTML = ""; // Очищаем предыдущие карты
  container.style.position = "relative"; // Для абсолютного позиционирования

  const cardBackPath = `/images/${deckName}/Back.png`;

  spread.positions.forEach(pos => {
    const card = document.createElement("img");
    card.src = cardBackPath;
    card.alt = pos.id;
    card.classList.add("card");

    card.style.position = "absolute";
    card.style.left = `${pos.x}px`;
    card.style.top = `${pos.y}px`;
    card.style.width = "60px";
    card.style.height = "100px";

    container.appendChild(card);
  });
}
