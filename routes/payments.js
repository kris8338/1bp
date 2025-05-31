const express = require("express");
const router = express.Router();
const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/User");

const botToken = "YOUR_BOT_TOKEN";
const providerToken = "PAYMENT_PROVIDER_TOKEN";
const bot = new TelegramBot(botToken, { polling: false });

const tariffs = {
  card: [
    { hours: 1, price: 68 },
    { hours: 2, price: 110 },
    { hours: 6, price: 333 },
    { hours: 24, price: 888 },
  ]
};

router.post("/pay", async (req, res) => {
  const { chat_id, hours } = req.body;
  const tariff = tariffs.card.find(t => t.hours === hours);

  if (!tariff) return res.status(400).json({ error: "Invalid tariff" });

  const payload = `access_${chat_id}_${hours}_${Date.now()}`;
  const prices = [{ label: `${hours} ч.`, amount: tariff.price * 100 }];

  try {
    await bot.sendInvoice(
      chat_id,
      "Оплата доступа",
      `${hours} ч. доступа к гаданию`,
      payload,
      providerToken,
      "RUB",
      prices
    );

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Webhook: обработка успешной оплаты
router.post("/payment-success", async (req, res) => {
  const payment = req.body; // Убедись, что Webhook Telegram настроен сюда
  const { telegram_payment_charge_id, payload } = payment;

  const parts = payload.split("_");
  const telegram_id = Number(parts[1]);
  const hours = Number(parts[2]);

  const now = new Date();
  const extraTime = hours * 60 * 60 * 1000;

  let user = await User.findOne({ telegram_id });

  if (!user) {
    user = new User({
      telegram_id,
      accessUntil: new Date(now.getTime() + extraTime)
    });
  } else {
    const currentAccess = user.accessUntil > now ? user.accessUntil : now;
    user.accessUntil = new Date(currentAccess.getTime() + extraTime);
  }

  await user.save();

  console.log(`Пользователю ${telegram_id} начислено ${hours} ч.`);
  res.sendStatus(200);
});

module.exports = router;
