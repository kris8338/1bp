require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const spreads = require('./tarot/spreads');
const decks = require('./tarot/decks');
const mongoose = require('mongoose');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const webAppUrl = process.env.WEBAPP_URL;
const ADMIN_ID = process.env.ADMIN_ID;

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
