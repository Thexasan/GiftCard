import React, { useState } from "react";
import PropTypes from "prop-types";
import CryptoJS from "crypto-js"; // Для генерации токена

import {
  Box,
  Grid as Grid2,
  TextField,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  RadioGroup,
  styled,
  FormControlLabel,
  useRadioGroup,
  Radio,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import { useNavigate } from "react-router-dom";

const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme }) => ({
  variants: [
    {
      props: { checked: true },
      style: {
        ".MuiFormControlLabel-label": {
          color: theme.palette.primary.main,
        },
      },
    },
  ],
}));

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  value: PropTypes.any,
};

function UseRadioGroup({ onChange, selectedValue }) {
  return (
    <RadioGroup
      name="use-radio-group"
      value={selectedValue}
      onChange={onChange}
    >
      <MyFormControlLabel
        value="first"
        label="Отправить Сразу"
        control={<Radio />}
      />
      <MyFormControlLabel
        value="second"
        label="Запланировать отправление"
        control={<Radio />}
      />
    </RadioGroup>
  );
}

const GiftForm = () => {
  const [amount, setAmount] = useState(500);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schedule, setSchedule] = useState("first");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

  const key = "299669";
  const password = "rj4F7FMGDaSPXKKqmbQR";
  const callbackUrl = "http://myshop.tj/thank_you.php";
  const orderId = "321123";

  const handleAmountChange = (event, newAmount) => {
    if (newAmount !== null) {
      setAmount(newAmount);
    }
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const generateToken = () => {
    const formattedAmount = amount.toFixed(2);
    const tokenString = key + orderId + formattedAmount + callbackUrl;
    const innerHash = CryptoJS.HmacSHA256(password, key).toString();
    const token = CryptoJS.HmacSHA256(tokenString, innerHash).toString();
    return token;
  };

  const handlePayment = async () => {
    const token = generateToken(); // Генерация токена

    const response = await fetch("http://localhost:3001/process-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toFixed(2), // Убедитесь, что сумма имеет два десятичных знака
        orderId: orderId,
        phone: "+992" + phone,
        email: email,
        token: token, // Отправляем токен
        callbackUrl: callbackUrl,
      }),
    });

    const data = await response.json();
    if (data.success) {
      window.location.href = data.paymentUrl; // Перенаправляем на форму оплаты
    } else {
      console.error("Ошибка при обработке платежа:", data.message);
      alert(data.message || "Произошла ошибка при обработке платежа.");
    }
  };

  return (
    <section className="container mx-auto pb-[100px]">
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyItems={"start"}
        gap={"30px"}
        sx={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div>
          <Typography
            sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "500" }}
            variant="h6"
            component="h2"
            gutterBottom
          >
            Выберите желаемую сумму подарка
          </Typography>
          <div className="flex items-center justify-start gap-5 w-full">
            <TextField
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
            />
            <h2>Можно ввести любую сумму от 500 до 150 000 сом</h2>
          </div>
          <ToggleButtonGroup
            value={amount}
            exclusive
            onChange={handleAmountChange}
            fullWidth
          >
            {[
              500, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000,
              150000,
            ].map((value) => (
              <ToggleButton key={value} value={value}>
                {value.toLocaleString()} сом
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <Typography
          sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "500" }}
          variant="h6"
          component="h2"
          gutterBottom
        >
          Кому отправить
        </Typography>

        <Grid2 container spacing={2}>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Имя получателя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Будет указано в сертификате"
            />
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Телефон получателя"
              value={phone}
              type="number"
              onChange={(e) => setPhone(e.target.value)}
              helperText="На этот номер отправим ссылку на сертификат. Номер должен быть зарегистрирован в РФ"
              InputProps={{
                startAdornment: "+992",
              }}
              inputProps={{ maxLength: 9 }}
              required
            />
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="E-mail получателя"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="На этот e-mail продублируем сертификат (опционально)"
            />
          </Grid2>
        </Grid2>

        <Box>
          <h2 className="font-main text-[20px]">Когда отправить</h2>
          <div>
            <UseRadioGroup
              selectedValue={schedule}
              onChange={handleScheduleChange}
            />
          </div>

          {schedule === "second" && (
            <Box>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                  <TextField
                    label="Выберите дату"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField
                    label="Выберите время"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </Box>
          )}
        </Box>
        <Box sx={{ marginTop: 3 }}>
          <h2 className="font-main text-[20px] font-normal">Что написать</h2>
          <div className="flex flex-col gap-[20px]">
            <TextField
              id="standard-basic"
              label="Имя отправителя"
              variant="outlined"
            />
            <TextareaAutosize
              style={{
                padding: 12,
                border: "1px solid gray",
                borderRadius: "10px",
              }}
              aria-label="minimum height"
              minRows={3}
              placeholder="Добавьте свои пожелания"
            />
          </div>
        </Box>
        <div>
          <Button
            onClick={() => {
              handlePayment();
              // navigate("giftcard/payment");
            }}
            variant="contained"
          >
            Оплатить {amount} сом
          </Button>
        </div>
      </Box>
    </section>
  );
};

export default GiftForm;
