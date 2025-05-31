const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const basePath = path.join(__dirname, "../public/attached_assets");

router.get("/:deckName", (req, res) => {
  const deckName = req.params.deckName;
  const deckPath = path.join(basePath, deckName);
  const suits = ["Major_Arcana", "Cups", "Swords", "Wands", "Pentacles"];

  const cards = [];

  suits.forEach(suit => {
    const suitPath = path.join(deckPath, suit);
    if (fs.existsSync(suitPath)) {
      const files = fs.readdirSync(suitPath).filter(f => f.endsWith(".png"));
      files.forEach(card => {
        cards.push({ suit, card });
      });
    }
  });

  res.json({ deck: deckName, cards });
});

module.exports = router;
