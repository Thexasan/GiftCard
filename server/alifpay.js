const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// Adding CORS
app.use(cors({ origin: "http://localhost:5173" }));

const ALIF_PAY_URL = "https://test-web.alif.tj/";

const key = "299669";
const password = "rj4F7FMGDaSPXKKqmbQR";

let callbackUrl = "https://testonline-api.omuz.tj/api/alif-topup-callback";
let returnUrl = "https://testonline.omuz.tj/";

app.post("", async (req, res) => {
  const { amount, phone, gate, info, email } = req.body;

  const formattedAmount = parseFloat(amount).toFixed(2);

  const uniqueId = uuidv4(); // Generate unique orderId

  let constructedString = key + uniqueId + formattedAmount + callbackUrl;

  console.log("String for token:", constructedString);

  let algoKey = CryptoJS.HmacSHA256(password, key).toString();
  console.log("AlgoKey (Password Hash):", algoKey);

  let token = CryptoJS.HmacSHA256(constructedString, algoKey).toString();
  console.log("Generated Token:", token);

  try {
    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("token", token);
    formData.append("amount", formattedAmount); // Use formatted amount
    formData.append("orderId", uniqueId);
    formData.append("phone", "+992" + phone);
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
      body: formData,
    });

    console.log("Form------------------:", formData);

    const responseText = await paymentResponse.text();
    console.log("AlifPay Response:", responseText);

    const tokenMatch = responseText.match(/<meta name="stk" content="([^"]+)"/);

    if (tokenMatch && tokenMatch[1]) {
      // const extractedToken = tokenMatch[1]; // Extracted token from HTML response

      res.json({
        success: true,
        key: key,
        orderId: uniqueId,
        phone: phone,
        amount: formattedAmount,
        callbackUrl: callbackUrl,
        returnUrl: returnUrl,
        info: info,
        email: email,
        token: token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Token not found in the response.",
        responseText: responseText,
      });
    }
  } catch (error) {
    console.error("Error when requesting payment system:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing payment.",
    });
  }
});

app.listen(3001, () => {
  console.log(`Server started at http://localhost:3001`);
});
