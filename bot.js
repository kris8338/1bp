require('dotenv').config();

// Проверка обязательных переменных окружения
if (!process.env.BOT_TOKEN || !process.env.DATABASE_URL || !process.env.WEBAPP_URL || !process.env.ADMIN_ID) {
  console.error('Отсутствуют обязательные переменные окружения');
  process.exit(1);
}

console.log("=== BOT STARTING ===");
console.log("BOT_TOKEN:", process.env.BOT_TOKEN ? "OK" : "MISSING");
console.log("WEBAPP_URL:", process.env.WEBAPP_URL || "missing");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK" : "MISSING");
console.log("ADMIN_ID:", process.env.ADMIN_ID ? "OK" : "MISSING");

const TelegramBot = require('node-telegram-bot-api');
const { Client } = require('pg');
const express = require('express');
const path = require('path');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const webAppUrl = process.env.WEBAPP_URL;
const ADMIN_ID = process.env.ADMIN_ID;

// Улучшенная обработка ошибок поллинга
bot.on('pollingError', (error) => {
  console.error('Ошибка поллинга:', error);
  setTimeout(() => {
    bot.startPolling();
  }, 5000); // Повторная попытка через 5 секунд
});

// Подключение к PostgreSQL с улучшенной обработкой
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true // Рекомендуется использовать true для безопасности
});

async function connectToDB() {
  try {
    await client.connect();
    console.log('✅ PostgreSQL connected');
    
    // Создание таблицы
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE,
        username TEXT,
        free_spreads_left INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Таблица users готова');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  }
}

connectToDB();

// Проверка администратора
function isAdmin(userId) {
  return String(userId) === String(ADMIN_ID);
}

// Добавить или обновить пользователя
async function addOrUpdateUser(telegramId, username) {
  try {
    await client.query(
      `
      INSERT INTO users (telegram_id, username)
      VALUES ($1, $2)
      ON CONFLICT (telegram_id)
      DO UPDATE SET username = EXCLUDED.username
      `,
      [telegramId, username]
    );
  } catch (err) {
    console.error('Ошибка при добавлении пользователя:', err);
  }
}

// Получить данные пользователя
async function getUser(telegramId) {
  try {
    const res = await client.query(
      `SELECT * FROM users WHERE telegram_id = $1`,
      [telegramId]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Ошибка при получении пользователя:', err);
    return null;
  }
}

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || 'Без ника';

  try {
    await addOrUpdateUser(userId, username);
    const user = await getUser(userId);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const startData = JSON.stringify({ 
      isAdmin: isAdmin(userId), 
      freeSpreadsLeft: user.free_spreads_left 
    });

    bot.sendMessage(chatId, 'Добро пожаловать! Получи свою бесплатную Карту дня и сделай до 5 раскладов бесплатно.', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть мини-приложение',
              web_app: { url: `${webAppUrl
