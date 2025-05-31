const tg = window.Telegram.WebApp;
tg.expand();

const initData = tg.initData;
const userId = tg.initDataUnsafe?.user?.id;

// ===== Темы =====
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-theme");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark-theme");
  } else {
    if (tg.colorScheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    }
  }
}

applySavedTheme();

document.getElementById("toggle-theme-btn")?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-theme");
  const isDark = document.documentElement.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== Загрузчик =====
function showLoader() {
  document.getElementById("loader")?.classList.add("show");
}

function hideLoader() {
  document.getElementById("loader")?.classList.remove("show");
}

// ===== Кэш доступа =====
function getCachedAccess(userId) {
  try {
    const data = JSON.parse(localStorage.getItem("access_" + userId));
    return data || null;
  } catch {
    return null;
  }
}

function setCachedAccess(userId, access, durationMinutes) {
  const expiresAt = Date.now() + durationMinutes * 60 * 1000;
  localStorage.setItem("access_" + userId, JSON.stringify({ access, expiresAt }));
}

// ===== Доступ =====
function checkAccess(telegram_id) {
  fetch("https://yourserver.com/api/access/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegram_id, initData })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access) {
        document.body.classList.add("access-allowed");
        toggleAccessUI(true);
      } else {
        document.body.classList.add("access-denied");
        toggleAccessUI(false);
      }

      setCachedAccess(telegram_id, data.access, data.remainingMinutes);
    });
}

if (userId) {
  const cached = getCachedAccess(userId);
  if (cached && cached.expiresAt > Date.now()) {
    toggleAccessUI(cached.access);
  } else {
    checkAccess(userId);
  }
}

// ===== Интерфейс при доступе =====
function toggleAccessUI(allowed) {
  const selectors = [
    "#deck-select", "#spread-select", "#query-input-spread",
    "#draw-btn", "#cards", "#reveal-btn", "#card-of-day-btn"
  ];
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.disabled = !allowed;
  });

  if (!allowed && !document.getElementById("lock-msg")) {
    const lockMessage = document.createElement("p");
    lockMessage.id = "lock-msg";
    lockMessage.innerText = "Чтобы использовать гадание, оплатите доступ.";
    document.body.appendChild(lockMessage);
  }
}

// ===== Тарифы =====
const tariffs = {
  card: [
    { hours: 1, price: 68 },
    { hours: 2, price: 110 },
    { hours: 6, price: 333 },
    { hours: 24, price: 888 }
  ],
  stars: [
    { hours: 1, stars: 110 },
    { hours: 2, stars: 190 },
    { hours: 6, stars: 580 },
    { hours: 24, stars: 1300 }
  ]
};

// ===== Рендер кнопок тарифов =====
const container = document.getElementById("tariff-list");

tariffs.card.forEach((tariff, i) => {
  const div = document.createElement("div");
  div.style.marginBottom = "15px";

  const text = `${tariff.hours} ч. — ${tariff.price}₽ / ${tariffs.stars[i].stars} звёзд`;
  div.innerHTML = `<strong>${text}</strong><br/>`;

  const cardBtn = createButton("Оплатить картой", () => payByCard(tariff.hours));
  const starBtn = createButton("Оплатить звёздами", () => payByStars(tariff.hours));
  starBtn.style.marginLeft = "10px";

  div.append(cardBtn, starBtn);
  container?.appendChild(div);
});

function createButton(text, handler) {
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.onclick = handler;
  btn.classList.add("pay-btn");
  return btn;
}

// ===== Оплата картой =====
function payByCard(hours) {
  showLoader();
  const user = tg.initDataUnsafe.user;

  fetch("https://yourserver.com/api/payments/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: user.id, hours })
  })
    .then(res => res.json())
    .then(data => {
      hideLoader();
      if (data.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Ошибка: " + data.error);
      }
    })
    .catch(err => {
      hideLoader();
      alert("Ошибка оплаты: " + err.message);
    });
}

// ===== Оплата звёздами =====
function payByStars(hours) {
  const slug = {
    1: "1hour_star",
    2: "2hour_star",
    6: "6hour_star",
    24: "24hour_star"
  }[hours];

  if (slug) {
    tg.openInvoice({ slug });
  }
}

// ===== Интерпретация карт =====
function getInterpretation(question, cards) {
  showLoader();
  fetch("/api/cards/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, cards })
  })
    .then(res => res.json())
    .then(data => {
      hideLoader();
      if (data.success) {
        displayInterpretation(data.interpretation);
        if (data.voiceBase64) playVoice(data.voiceBase64);
      } else {
        console.error("Ошибка:", data.error);
      }
    })
    .catch(err => {
      hideLoader();
      console.error("Ошибка запроса:", err);
    });
}

function displayInterpretation(text) {
  const result = document.getElementById("spread-result");
  if (result) result.textContent = text;
}

function playVoice(base64) {
  new Audio(`data:audio/ogg;base64,${base64}`).play();
}
