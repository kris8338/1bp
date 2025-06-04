require('dotenv').config();
console.log("=== BOT STARTING ===");
console.log("BOT_TOKEN:", process.env.BOT_TOKEN ? "OK" : "MISSING");
console.log("WEBAPP_URL:", process.env.WEBAPP_URL || "missing");
console.log("MONGO_URI:", process.env.MONGO_URI ? "OK" : "MISSING");

const TelegramBot = require('node-telegram-bot-api');
const spreads = require('./webapp/spreads');
const decks = require('./routes/decks');
const mongoose = require('mongoose');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const webAppUrl = process.env.WEBAPP_URL;
const ADMIN_ID = process.env.ADMIN_ID;

bot.on("polling_error", (err) => {
  console.log("Telegram polling error:", err.message);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // остановка, если нет подключения
  });

// Временная база пользователей
const userData = {};

// Проверка администратора
function isAdmin(userId) {
  return String(userId) === String(ADMIN_ID);
}

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!userData[chatId]) {
    userData[chatId] = { freeSpreadsLeft: 5 };
  }

  const startData = JSON.stringify({ isAdmin: isAdmin(userId) });

  bot.sendMessage(chatId, 'Добро пожаловать! Получи свою бесплатную Карту дня и сделай до 5 раскладов бесплатно.', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть мини-приложение',
            web_app: { url: `${webAppUrl}?data=${encodeURIComponent(startData)}` }
          }
        ]
      ]
    }
  });
});

// Команда /admin
bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (isAdmin(userId)) {
    bot.sendMessage(chatId, 'Добро пожаловать, админ!');
  } else {
    bot.sendMessage(chatId, 'У вас нет доступа к этой команде.');
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Бот работает! Напиши /start, чтобы начать.');
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Бот работает. Добро пожаловать!');
});

app.listen(PORT, () => {
  console.log(`Express-сервер запущен на порту ${PORT}`);
});

console.log("Бот запущен");
