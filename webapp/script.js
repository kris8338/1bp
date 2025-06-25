function checkAccess(telegram_id) {
  showLoader();
  fetch("https://yourserver.com/api/access/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ telegram_id })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Access check result:", data);
      hideLoader();
    })
    .catch(err => {
      console.error("Access check error:", err);
      hideLoader();
    });
}

async function checkTelegramAuth(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = [...urlParams.entries()]
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join("\n");

  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(botToken);
  const key = await crypto.subtle.importKey(
    "raw", secretKeyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(dataCheckString)
  );

  const computedHash = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return computedHash === hash;
}

// Генерация всех 78 карт
function generateCardList(folderName) {
  const majorArcana = [
    "the_fool", "the_magician", "the_high_priestess", "the_empress", "the_emperor",
    "the_high_priest", "the_lovers", "the_chariot", "strength", "the_hermit",
    "the_wheel", "justice", "the_hanged_man", "death", "temperance",
    "the_devil", "the_tower", "the_star", "the_moon", "the_sun",
    "judgement", "the_world"
  ];

  const suits = ["wands", "cups", "swords", "pentacles"];
  const minorArcana = suits.flatMap(suit => [
    "ace_of_" + suit,
    "2_of_" + suit,
    "3_of_" + suit,
    "4_of_" + suit,
    "5_of_" + suit,
    "6_of_" + suit,
    "7_of_" + suit,
    "8_of_" + suit,
    "9_of_" + suit,
    "10_of_" + suit,
    "page_of_" + suit,
    "knight_of_" + suit,
    "queen_of_" + suit,
    "king_of_" + suit
  ]);

  const allCards = [...majorArcana, ...minorArcana];

  return allCards.map(cardId => ({
    id: cardId,
    name: formatCardName(cardId),
    image: `images/${folderName}/${cardId}.jpg`
  }));
}

function formatCardName(fileName) {
  return fileName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

const decks = {
  "everyday-witch": {
    name: "Повседневное Таро Ведьмы",
    cards: generateCardList("everyday-witch"),
    back: "images/everyday-witch/Back/back.jpg"
  },
  "light-seers": {
    name: "Светлый Провидец",
    cards: generateCardList("light-seers"),
    back: "images/light-seers/Back/back.jpg"
  },
  "rider-waite": {
    name: "Райдер-Уэйт",
    cards: generateCardList("rider-waite"),
    back: "images/rider-waite/Back/back.jpg"
  },
  "witch-taro": {
    name: "Колдовское Таро",
    cards: generateCardList("witch-taro"),
    back: "images/witch-taro/Back/back.jpg"
  }
};

// Шафл
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Заполнение селектов
function populateSelects() {
  const deckSelect = document.getElementById('deck-select');
  const spreadSelect = document.getElementById('spread-select');

  if (!deckSelect || !spreadSelect) return;

  Object.keys(decks).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = decks[key].name;
    deckSelect.appendChild(option);
  });

  Object.keys(spreads).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = spreads[key].name;
    spreadSelect.appendChild(option);
  });
}

// Основной расклад
function drawSpread() {
  const deckSelect = document.getElementById('deck-select');
  const spreadSelect = document.getElementById('spread-select');
  const resultDiv = document.getElementById('spread-result');
  const cardsContainer = document.getElementById("cards");
  const queryInput = document.getElementById('query-input');

  const deckKey = deckSelect.value;
  const spreadKey = spreadSelect.value;
  const query = queryInput.value.trim();

  if (!decks[deckKey] || !spreads[spreadKey]) return;

  const selectedDeck = decks[deckKey].cards;
  const selectedSpread = spreads[spreadKey];
  const backImage = decks[deckKey].back;
  const shuffledDeck = shuffleDeck([...selectedDeck]);

  resultDiv.innerHTML = `<h2>Результат расклада "${selectedSpread.name}"</h2>`;
  if (query) {
    resultDiv.innerHTML += `<p>Запрос: "${query}"</p>`;
  }

  cardsContainer.innerHTML = "";
  cardsContainer.style.position = "relative";

  selectedSpread.layout.forEach((pos, i) => {
    const cardData = shuffledDeck[i];

    const card = document.createElement("div");
    card.className = "card";
    card.style.position = "absolute";
    card.style.left = `${pos.x}px`;
    card.style.top = `${pos.y}px`;

    const back = document.createElement("img");
    back.className = "back";
    back.src = backImage;

    const front = document.createElement("img");
    front.className = "front";
    front.src = cardData.image;
    front.alt = cardData.name;

    card.appendChild(back);
    card.appendChild(front);
    cardsContainer.appendChild(card);

    setTimeout(() => {
      card.classList.add("flipped");
    }, i * 300);
  });
}

// Карта дня
function drawCardOfDay() {
  const deckSelect = document.getElementById('deck-select');
  const resultDiv = document.getElementById('card-of-day-result');
  const queryInput = document.getElementById('query-input');

  const deckKey = deckSelect.value;
  const query = queryInput.value.trim();

  if (!decks[deckKey]) return;

  const selectedDeck = decks[deckKey].cards;
  const cardIndex = Math.floor(Math.random() * selectedDeck.length);
  const card = selectedDeck[cardIndex];

  resultDiv.innerHTML = `<h2>Карта дня</h2>`;
  if (query) {
    resultDiv.innerHTML += `<p>Запрос: "${query}"</p>`;
  }
  resultDiv.innerHTML += `
    <div class="card">
      <strong>${card.name}</strong><br>
      <img src="${card.image}" alt="${card.name}" />
    </div>
  `;
}

// Заглушки для Loader
function showLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
}

// Кнопки
document.getElementById('card-of-day-btn').addEventListener('click', drawCardOfDay);
document.getElementById('draw-btn').addEventListener('click', drawSpread);

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', populateSelects);

