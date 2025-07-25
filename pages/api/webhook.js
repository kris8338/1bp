// pages/api/webhook.js

import { bot, handleTelegramUpdate } from '../../bot';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await handleTelegramUpdate(req.body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('❌ Ошибка обработки webhook:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
