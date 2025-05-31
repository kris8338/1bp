const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegram_id: { type: Number, required: true, unique: true },
  accessUntil: { type: Date, default: null }
});

module.exports = mongoose.model("User", userSchema);
