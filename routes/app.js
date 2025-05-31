require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(bodyParser.json());

const paymentsRouter = require("./routes/payments");
app.use("/api/payments", paymentsRouter);

app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});

const accessRouter = require("./routes/access");
app.use("/api/access", accessRouter);

const cardRoutes = require("./routes/cards");
app.use("/api/cards", cardRoutes);
