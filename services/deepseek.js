require("dotenv").config();
const axios = require("axios");

const apiKeys = process.env.DEEPSEEK_KEYS?.split(",").map(k => k.trim()).filter(Boolean) || [];

if (apiKeys.length === 0) {
  throw new Error("Нет доступных ключей DeepSeek в переменной DEEPSEEK_KEYS");
}

let currentIndex = 0;

async function interpretWithDeepSeek(prompt) {
  const url = "https://api.deepseek.com/v1/chat/completions";

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[currentIndex];

    try {
      const response = await axios.post(
        url,
        {
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      return response.data.choices[0].message.content;

    } catch (err) {
      console.warn(`DeepSeek ключ #${currentIndex + 1} не сработал: ${err.response?.status || err.message}`);
      currentIndex = (currentIndex + 1) % apiKeys.length;
    }
  }

  throw new Error("Все ключи DeepSeek недоступны или исчерпаны.");
}

module.exports = { interpretWithDeepSeek };
