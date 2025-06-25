export function renderSpreadLayout(spread, deck = "light-seers") {
  const container = document.getElementById("cards");
  container.innerHTML = "";
  container.style.position = "relative";

  // Отношение от базового размера (можно менять)
  const scale = Math.min(window.innerWidth / 600, window.innerHeight / 800);

  spread.positions.forEach(pos => {
    const card = document.createElement("img");
    card.src = `/images/${deck}/Back.png`;
    card.alt = pos.id;
    card.classList.add("card");

    const cardWidth = 60 * scale;
    const cardHeight = 100 * scale;

    card.style.position = "absolute";
    card.style.left = `${pos.x * scale}px`;
    card.style.top = `${pos.y * scale}px`;
    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;

    container.appendChild(card);
  });
}
