const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// Adding CORS
app.use(cors());
app.use(bodyParser.json());

const ALIF_PAY_URL = "https://test-web.alif.tj/";

const key = "552881";
const password = "14o9Z11aceGTDha72gyW";

let callbackUrl = "http://localhost:5173/api/alif-topup-callback";
let returnUrl = "http://localhost:5173/";

app.post("", async (req, res) => {
  const { amount, phone, gate, info, email } = req.body;

  const orderId = uuidv4(); // Generate unique orderId

  const formattedPaymentAmount = parseFloat(amount).toFixed(2);

  let algoKey = CryptoJS.HmacSHA256(password, key).toString();
  console.log("AlgoKey (Password Hash):", algoKey);

  let token = CryptoJS.HmacSHA256(
    `${key}${orderId}${formattedPaymentAmount}${callbackUrl}`,
    algoKey
  ).toString();
  console.log("Generated Token:", token);

  try {
    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("token", token);
    formData.append("amount", formattedPaymentAmount); // Use formatted amount
    formData.append("orderId", orderId);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("callbackUrl", callbackUrl);
    formData.append("returnUrl", returnUrl);
    formData.append("gate", gate);
    formData.append("info", info);

    // const userPayment = {
    //   key: key,
    //   token: token,
    //   amount: formattedPaymentAmount,
    //   orderId: orderId,
    //   phone: phone,
    //   email: email,
    //   callbackUrl: callbackUrl,
    //   returnUrl: returnUrl,
    //   gate: gate,
    //   info: info,
    // };

    // console.log(userPayment);

    const paymentResponse = await fetch(ALIF_PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Content-Type": "application/json",
      },
      body: formData,
    });

    console.log("userPayment------------------:", formData);

    res.json({
      success: true,
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
