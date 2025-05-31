require("dotenv").config();
const axios = require("axios");

const apiKeys = process.env.YANDEX_SPEECHKIT_KEYS?.split(",").map(k => k.trim()).filter(Boolean) || [];

if (apiKeys.length === 0) {
  throw new Error("Нет ключей Yandex SpeechKit в переменной YANDEX_SPEECHKIT_KEYS");
}

let currentKeyIndex = 0;

async function textToSpeech(text, lang = "ru-RU", voice = "alena") {
  const url = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize";

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[currentKeyIndex];

    try {
      const response = await axios.post(
        url,
        new URLSearchParams({
          text,
          lang,
          voice,
          format: "oggopus",
          speed: "1.0"
        }),
        {
          headers: {
            Authorization: `Api-Key ${apiKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          responseType: "arraybuffer"
        }
      );

      return response.data;

    } catch (err) {
      console.warn(`Yandex ключ #${currentKeyIndex + 1} не сработал: ${err.response?.status || err.message}`);
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    }
  }

  throw new Error("Все ключи Yandex SpeechKit недоступны или исчерпаны.");
}

module.exports = { textToSpeech };
