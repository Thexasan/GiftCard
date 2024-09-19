const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// Добавляем CORS
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

const ALIF_PAY_URL = "https://test-web.alif.tj/";

const key = "299669"; // Используемые ключ и пароль
const password = "rj4F7FMGDaSPXKKqmbQR";

// Генерация токена для запроса
const generateToken = (orderId, amount, callbackUrl) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const tokenString = key + orderId + formattedAmount + callbackUrl;
  const innerHash = CryptoJS.HmacSHA256(password, key).toString();
  const token = CryptoJS.HmacSHA256(tokenString, innerHash).toString();
  return token;
};

// Обработчик платежей
app.post("/process-payment", async (req, res) => {
  const { amount, orderId, phone, email, callbackUrl, returnUrl, gate, info } =
    req.body;

  // Генерация токена
  const token = generateToken(orderId, amount, callbackUrl);
  const formattedAmount = parseFloat(amount).toFixed(2);

  try {
    // Формируем запрос к Alif API
    const paymentResponse = await fetch(ALIF_PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: key,
        token: token,
        amount: formattedAmount,
        orderId: orderId,
        phone: phone,
        email: email,
        callbackUrl: callbackUrl,
        returnUrl: returnUrl,
        gate: gate,
        info: info,
      }),
    });

    const responseText = await paymentResponse.text(); // Получаем полный ответ в виде текста

    // Выводим весь текст ответа для диагностики
    console.log("Ответ от сервера Алиф:", responseText);

    // Если ответ сервера действительно JSON, попробуем его распарсить
    let paymentData;
    try {
      paymentData = JSON.parse(responseText);
    } catch (error) {
      console.error("Не удалось распарсить ответ как JSON:", error);
      return res.status(400).json({
        success: false,
        message: "Ответ сервера не является валидным JSON.",
        error: responseText, // Добавляем текст ответа для отладки
      });
    }

    if (paymentResponse.ok) {
      res.json({
        success: true,
        paymentUrl: paymentData.paymentUrl, // Возвращаем URL для перенаправления на оплату
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentData.message || "Ошибка при обработке платежа.",
        error: responseText, // Добавляем текст ответа для отладки
      });
    }
  } catch (error) {
    console.error("Ошибка при запросе к платежной системе:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при обработке платежа.",
    });
  }
});

// Запуск сервера
app.listen(3001, () => {
  console.log(`Сервер запущен на http://localhost:3001`);
});
