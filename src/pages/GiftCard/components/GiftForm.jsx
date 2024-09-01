import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid2,
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
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

function UseRadioGroup() {
  return (
    <RadioGroup name="use-radio-group" defaultValue="first">
      <MyFormControlLabel value="first" label="First" control={<Radio />} />
      <MyFormControlLabel value="second" label="Second" control={<Radio />} />
    </RadioGroup>
  );
}

const GiftForm = () => {
  const [amount, setAmount] = useState(500);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAmountChange = (event, newAmount) => {
    if (newAmount !== null) {
      setAmount(newAmount);
    }
  };

  return (
    <section className="container m-auto">
      <Box sx={{ fontFamily: "Montserrat, sans-serif" }}>
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

        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" color="primary" fullWidth>
            Отправить подарок
          </Button>
        </Box>

        <Box sx={{ marginTop: 3 }}>
          <h2 className="font-main text-[20px]">Когда отправить</h2>
          <div>
            <UseRadioGroup />
          </div>
        </Box>
      </Box>
    </section>
  );
};

export default GiftForm;
