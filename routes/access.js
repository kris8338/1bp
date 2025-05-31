const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/check", async (req, res) => {
  const { telegram_id } = req.body;

  if (!telegram_id) return res.status(400).json({ error: "No telegram_id" });

  const user = await User.findOne({ telegram_id });

  if (!user || !user.accessUntil || user.accessUntil < new Date()) {
    return res.json({ access: false, remainingMinutes: 0 });
  }

  const remaining = Math.ceil((user.accessUntil - Date.now()) / 60000);

  res.json({ access: true, remainingMinutes: remaining });
});

module.exports = router;
