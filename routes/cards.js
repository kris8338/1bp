const express = require("express");
const router = express.Router();
const { interpretWithDeepSeek } = require("../services/deepseek");
const { textToSpeech } = require("../services/speech");

router.post("/interpret", async (req, res) => {
  const { question, cards } = req.body;
  const prompt = `Пользователь задал вопрос: "${question}". Выпали карты: ${cards.join(", ")}. Дай подробную трактовку.`;

  try {
    const interpretation = await interpretWithDeepSeek(prompt);
    const voiceBuffer = await textToSpeech(interpretation);

    res.json({
      success: true,
      interpretation,
      voiceBase64: Buffer.from(voiceBuffer).toString("base64")
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
