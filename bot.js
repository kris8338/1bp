require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Client } = require('pg');

// Инициализация бота без polling
const bot = new TelegramBot(process.env.BOT_TOKEN);
const webAppUrl = process.env.WEBAPP_URL;
const ADMIN_ID = process.env.ADMIN_ID;

// Подключение к PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ PostgreSQL connected');
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
  });

// ======== Обработка обновлений через webhook ========

function isAdmin(userId) {
  return String(userId) === String(ADMIN_ID);
}

async function addOrUpdateUser(telegramId, username) {
  await client.query(`
    INSERT INTO users (telegram_id, username)
    VALUES ($1, $2)
    ON CONFLICT (telegram_id)
    DO UPDATE SET username = EXCLUDED.username
  `, [telegramId, username]);
}

async function getUser(telegramId) {
  const res = await client.query(`SELECT * FROM users WHERE telegram_id = $1`, [telegramId]);
  return res.rows[0];
}

async function handleTelegramUpdate(update) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const userId = message.from.id;
  const username = message.from.username || 'Без ника';

  if (message.text === '/start') {
    try {
      await addOrUpdateUser(userId, username);
      const user = await getUser(userId);
      const startData = JSON.stringify({
        isAdmin: isAdmin(userId),
        freeSpreadsLeft: user.free_spreads_left
      });

      await bot.sendMessage(chatId, 'Добро пожаловать! Получи свою бесплатную Карту дня и сделай до 5 раскладов бесплатно.', {
        reply_markup: {
          inline_keyboard: [[{
            text: 'Открыть мини-приложение',
            web_app: { url: `${webAppUrl}?data=${encodeURIComponent(startData)}` }
          }]]
        }
      });
    } catch (err) {
      console.error('Ошибка в /start:', err);
      await bot.sendMessage(chatId, 'Произошла ошибка, попробуйте позже.');
    }
  } else if (message.text === '/admin') {
    if (isAdmin(userId)) {
      await bot.sendMessage(chatId, 'Добро пожаловать, админ!');
    } else {
      await bot.sendMessage(chatId, 'У вас нет доступа к этой команде.');
    }
  } else {
    await bot.sendMessage(chatId, 'Бот работает! Напиши /start, чтобы начать.');
  }
}

module.exports = { bot, handleTelegramUpdate };

