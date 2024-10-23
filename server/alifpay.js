const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const CryptoJS = require("crypto-js"); // Используем для генерации токенов
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// Adding CORS
app.use(cors());
app.use(bodyParser.json());

// URL для оплаты Алиф
const ALIF_PAY_URL = "https://test-web.alif.tj/";

// Логин и пароль (ключ) от Алиф
const key = "299669";
const password = "rj4F7FMGDaSPXKKqmbQR";

// URL для callback и возврата
let callbackUrl = "http://localhost:5173/api/alif-topup-callback";
let returnUrl = "http://localhost:5173/";

// Генерация хеша пароля по алгоритму HMAC-SHA256
function generatePasswordHash(password, key) {
  return CryptoJS.HmacSHA256(password, key).toString();
}

// Генерация токена для Алиф
function generatePaymentToken(key, orderId, amount, callbackUrl, passwordHash) {
  const concatenatedString = `${key}${orderId}${amount.toFixed(2)}${callbackUrl}`;
  return CryptoJS.HmacSHA256(concatenatedString, passwordHash).toString();
}

const passwordHash = generatePasswordHash(password, key); // Хешированный пароль
console.log("Password Hash:", passwordHash);

// Маршрут для обработки платежа
app.post("/api/payment", async (req, res) => {
  const { amount, phone, gate, info, email } = req.body;

  const orderId = uuidv4(); // Генерация уникального orderId
  const formattedPaymentAmount = parseFloat(amount).toFixed(2); // Форматируем сумму с двумя знаками после запятой

  // Генерация токена на основе данных платежа
  const token = generatePaymentToken(key, orderId, parseFloat(formattedPaymentAmount), callbackUrl, passwordHash);
  console.log("Generated Token:", token);

  try {
    // Формирование данных для отправки в виде формы
    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("token", token);
    formData.append("amount", formattedPaymentAmount);
    formData.append("orderId", orderId);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("callbackUrl", callbackUrl);
    formData.append("returnUrl", returnUrl);
    formData.append("gate", gate);
    formData.append("info", info);

    // Отправка запроса на сервер Алиф
    const paymentResponse = await fetch(ALIF_PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Передаем данные в виде формы
      },
      body: formData,
    });

    const responseText = await paymentResponse.text(); // Получаем ответ как текст
    console.log("Ответ от сервера Алиф:", responseText);

    res.json({
      success: true,
      message: "Платеж успешно отправлен на сервер Алиф.",
      key: key,
      orderId: orderId,
      phone: phone,
      amount: formattedPaymentAmount,
      callbackUrl: callbackUrl,
      returnUrl: returnUrl,
      info: info,
      email: email,
      token: token,
    });
  } catch (error) {
    console.error("Ошибка при запросе к платежной системе Алиф:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при обработке платежа.",
    });
  }
});

// Запуск сервера
app.listen(3001, () => {
  console.log(`Server started at http://localhost:3001`);
});
