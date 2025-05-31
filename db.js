const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/tarot-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB подключен");
  } catch (err) {
    console.error("Ошибка подключения к MongoDB", err);
  }
};

module.exports = connectDB;
