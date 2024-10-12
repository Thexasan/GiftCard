const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
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
let callbackUrl = "https://testonline-api.omuz.tj/api/alif-topup-callback";
let returnUrl = "https://testonline.omuz.tj/";
// Обработчик платежей
app.post("", async (req, res) => {
  const { amount, phone, gate, info, email } = req.body;
  const uniqueId = uuidv4();
  let constructedString = key + uniqueId + amount + callbackUrl;
  let algoKey = CryptoJS.HmacSHA256(password, key).toString();
  let token = CryptoJS.HmacSHA256(constructedString, algoKey).toString();

  console.log(
    "token",
    token,
    "algoKey",
    algoKey,
    "constructedString",
    constructedString
  );

  try {
    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("token", token);
    formData.append("amount", amount);
    formData.append("orderId", uniqueId);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("callbackUrl", callbackUrl);
    formData.append("returnUrl", returnUrl);
    formData.append("gate", gate);
    formData.append("info", info);

    const paymentResponse = await fetch(ALIF_PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("forma--------------------------", formData);

    // Get the response as text
    const responseText = await paymentResponse.text();
    console.log("Ответ от сервера Алиф:", responseText);

    // Extract token from the HTML response
    const tokenMatch = responseText.match(/<meta name="stk" content="([^"]+)"/);

    if (tokenMatch && tokenMatch[1]) {
      const extractedToken = tokenMatch[1]; // The extracted token

      // Send the extracted token back as a response
      res.json({
        success: true,
        key: key,
        orderId: uniqueId,
        phone: phone,
        amount: amount,
        callbackUrl: callbackUrl,
        returnUrl: returnUrl,
        info: info,
        email: email,
        token: extractedToken.slice(8),
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Token not found in the response.",
        responseText: responseText, // Include the full response for debugging
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
