export function renderSpreadLayout(spread, deck = "light-seers") {
  const container = document.getElementById("cards");
  container.innerHTML = "";
  container.style.position = "relative";

  spread.positions.forEach(pos => {
    const card = document.createElement("img");
    card.src = `/images/${deck}/Back.png`; // Путь из public/
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
