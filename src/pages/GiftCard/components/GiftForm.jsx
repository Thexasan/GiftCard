import {
  Box,
  Button,
  FormControlLabel,
  Grid as Grid2,
  Radio,
  RadioGroup,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useRadioGroup,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useState } from "react";

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
  const [amount, setAmount] = useState(0);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schedule, setSchedule] = useState("first");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleAmountChange = (event, newAmount) => {
    if (newAmount !== null) {
      setAmount(parseFloat(newAmount)); // Явное преобразование в число
    }
  };

  const [gate, setGate] = useState(2);

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_APP_API_URL + "pays",
        {
          email: email,
          phone: phone,
          amount: +amount,
          cardType: gate,
        }
      );
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const form = doc.querySelector("form");
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="container mx-auto pb-[100px] pt-[20px] md:pt-2">
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
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
            />
            <h2 className="text-[14px] md:text-[18px]">
              Можно ввести любую сумму от 100 до 20 000 сом
            </h2>
          </div>
          <ToggleButtonGroup
            value={amount}
            exclusive
            className="flex md:block gap-3 overflow-x-scroll md:overflow-hidden scroll-smooth"
            onChange={handleAmountChange}
            fullWidth
          >
            {[100, 300, 500, 700, 1000, 1500, 2000].map((value) => (
              <ToggleButton
                sx={{
                  minWidth: {
                    xs: "120px", // для телефонов
                    md: "100px", // для десктопов
                  },
                }}
                key={value}
                value={value}
              >
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
          <Grid2 item xs={12} md={4}>
            <TextField
              fullWidth
              label="Имя получателя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Будет указано в сертификате"
            />
          </Grid2>
          <Grid2 item xs={12} md={4}>
            <TextField
              fullWidth
              label="Телефон получателя"
              value={phone}
              type="text"
              onChange={(e) => setPhone(e.target.value)}
              helperText="На этот номер отправим ссылку на сертификат. Номер должен быть зарегистрирован в РФ"
              InputProps={{
                startAdornment: "+992",
              }}
              inputProps={{ maxLength: 9 }}
              required
            />
          </Grid2>
          <Grid2 item xs={12} md={4}>
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
        {/* <Box sx={{ marginTop: 3 }}>
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
        </Box> */}

        <div className="space-y-4">
          <h2 className="font-main text-[20px]">Что написать</h2>
          <TextField
            label="Имя отправителя"
            variant="outlined"
            size="small"
            fullWidth
          />
          <div className="relative">
            <TextField
              multiline
              rows={4}
              placeholder="Добавьте свои пожелания"
              variant="outlined"
              fullWidth
              onChange={(e) => setMessage(e.target.value)}
            />
            <span className="absolute bottom-2 right-2 text-sm text-gray-500">
              0/200
            </span>
          </div>
        </div>
        <Box sx={{ marginTop: 3 }}>
          <Button onClick={handlePayment} variant="contained">
            Оплатить {amount} сом
          </Button>
        </Box>
      </Box>
    </section>
  );
};

export default GiftForm;
