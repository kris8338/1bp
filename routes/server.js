require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Проверка initData от Telegram
function checkTelegramAuth(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = [...urlParams.entries()]
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", botToken)
    .update("WebAppData")
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === hash;
}

// Пример обработчика для проверки доступа
app.post("/api/access/check", async (req, res) => {
  const { telegram_id, initData } = req.body;

  if (!checkTelegramAuth(initData, process.env.BOT_TOKEN)) {
    return res.status(403).json({ access: false, error: "Invalid initData" });
  }

  // Здесь твоя логика доступа. Пример:
  const access = true; // Или получи из БД
  const remainingMinutes = 120;

  res.json({ access, remainingMinutes });
});

// Сервер слушает
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

app.post("/api/access/check", async (req, res) => {
  const { telegram_id, initData } = req.body;

  const isValid = checkTelegramAuth(initData, process.env.BOT_TOKEN);
  if (!isValid) {
    return res.status(403).json({ error: "Доступ запрещён" });
  }

  const access = await getUserAccess(telegram_id); // твоя логика
  res.json({ access });
});

const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Секрет ЮMoney для проверки подписи
const YOOMONEY_SECRET = process.env.YOOMONEY_SECRET || 'ваш_секрет';
const RECEIVER = process.env.YOOMONEY_RECEIVER || '41001...'; // ваш кошелёк или shop_id

// Главная страница (тестовая)
app.get('/', (req, res) => {
  res.send('ЮMoney сервер работает!');
});

// Генерация платёжной ссылки
app.post('/api/payments/pay', async (req, res) => {
  const { chat_id, hours } = req.body;

  const label = `user_${chat_id}_${Date.now()}`;
  const amount = getAmountByHours(hours);

  const paymentUrl = `https://yoomoney.ru/quickpay/confirm.xml?receiver=${RECEIVER}&label=${label}&quickpay-form=button&targets=Подписка&sum=${amount}&paymentType=AC`;

  // Можно сохранить label в БД, чтобы потом проверить на callback
  res.json({ ok: true, url: paymentUrl });
});

// Обработка уведомлений от ЮMoney
app.post('/api/payments/callback', (req, res) => {
  const {
    notification_type,
    operation_id,
    amount,
    currency,
    datetime,
    sender,
    codepro,
    label,
    sha1_hash
  } = req.body;

  // Проверка подписи
  const hashString = [
    notification_type,
    operation_id,
    amount,
    currency,
    datetime,
    sender,
    codepro,
    YOOMONEY_SECRET,
    label
  ].join('&');

  const calculatedHash = crypto.createHash('sha1').update(hashString).digest('hex');

  if (calculatedHash === sha1_hash) {
    console.log(`Платёж подтверждён от ${sender} на сумму ${amount}`);
    // Обнови доступ пользователю в БД по label

    res.status(200).send('OK');
  } else {
    console.warn('Неверная подпись!');
    res.status(403).send('Invalid signature');
  }
});

function getAmountByHours(hours) {
  const pricing = {
    1: 68,
    2: 110,
    6: 333,
    24: 888
  };
  return pricing[hours] || 68;
}

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

const { createPayment } = require('./yoomoney');

app.post('/api/payments/pay', (req, res) => {
  const { chat_id, hours } = req.body;

  const label = `user_${chat_id}_${Date.now()}`;
  const amount = getAmountByHours(hours);
  const { url } = createPayment(amount, label);

  res.json({ ok: true, url });
});
