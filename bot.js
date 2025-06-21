require('dotenv').config();
console.log("=== BOT STARTING ===");
console.log("BOT_TOKEN:", process.env.BOT_TOKEN ? "OK" : "MISSING");
console.log("WEBAPP_URL:", process.env.WEBAPP_URL || "missing");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK" : "MISSING");

const TelegramBot = require('node-telegram-bot-api');
const spreads = require('./webapp/spreads');
const decks = require('./routes/decks');
const { Client } = require('pg');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const webAppUrl = process.env.WEBAPP_URL;
const ADMIN_ID = process.env.ADMIN_ID;

bot.on("polling_error", (err) => {
  console.log("Telegram polling error:", err.message);
});

// Подключение к PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('✅ PostgreSQL connected');

    // Создание таблицы пользователей если её нет
    return client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE,
        username TEXT,
        free_spreads_left INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  })
  .then(() => {
    console.log('✅ Таблица users готова');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  });

// Проверка администратора
function isAdmin(userId) {
  return String(userId) === String(ADMIN_ID);
}

// Добавить или обновить пользователя
async function addOrUpdateUser(telegramId, username) {
  await client.query(
    `
    INSERT INTO users (telegram_id, username)
    VALUES ($1, $2)
    ON CONFLICT (telegram_id)
    DO UPDATE SET username = EXCLUDED.username
    `,
    [telegramId, username]
  );
}

// Получить данные пользователя
async function getUser(telegramId) {
  const res = await client.query(
    `SELECT * FROM users WHERE telegram_id = $1`,
    [telegramId]
  );
  return res.rows[0];
}

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || 'Без ника';

  try {
    await addOrUpdateUser(userId, username);
    const user = await getUser(userId);

    const startData = JSON.stringify({ isAdmin: isAdmin(userId), freeSpreadsLeft: user.free_spreads_left });

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
  } catch (err) {
    console.error('Ошибка в /start:', err);
    bot.sendMessage(chatId, 'Произошла ошибка, попробуйте позже.');
  }
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

// Любое сообщение
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Бот работает! Напиши /start, чтобы начать.');
});

// Express сервер
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Бот работает. Добро пожаловать!');
});

app.listen(PORT, () => {
  console.log(`Express-сервер запущен на порту ${PORT}`);
});

console.log("Бот запущен ✅");

