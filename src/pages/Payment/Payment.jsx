import React, { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Payment = () => {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 минут в секундах
  const [isTimeUp, setIsTimeUp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Очищаем интервал при размонтировании компонента
    } else {
      setIsTimeUp(true); // Когда время вышло, показываем сообщение
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <>
      <div className="container m-auto mt-[20px]">
        <Button
          variant="text"
          onClick={() => {
            navigate("/");
          }}
          color="secondary"
          startIcon={<KeyboardBackspaceIcon />}
        >
          {" "}
          Назад
        </Button>
      </div>
      <section className="container m-auto flex items-center">
        <div class="flex flex-col justify-around bg-gray-800 p-4 border border-white border-opacity-30 rounded-lg shadow-md  mx-auto">
          <div class="flex flex-row items-center justify-between mb-3">
            <input
              class="w-full h-10 border outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2 mb-3 mr-2 rounded-md flex-grow"
              type="text"
              name="cardName"
              id="cardName"
              placeholder="Full Name"
            />
          </div>
          <div class="flex flex-col space-y-3">
            <input
              class="w-full h-10 border outline-none text-sm bg-gray-800 text-white rounded-md font-semibold caret-orange-500 pl-2"
              type="text"
              name="cardNumber"
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
            />
            <div class="flex flex-row gap-2 justify-between">
              <input
                class="w-full h-10 border outline-none rounded-md text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2"
                type="text"
                name="expiryDate"
                id="expiryDate"
                placeholder="MM/AA"
              />
              <input
                class="w-full h-10 border rounded-md outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2"
                type="text"
                name="cvv"
                id="cvv"
                placeholder="CVV"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-2">
          <div className="border border-gray-300 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-semibold mb-4">Оплата заказа</h1>

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Заказ №</p>
              <p className="font-medium">15180123800</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Сумма заказа</p>
              <p className="font-medium">5 000 сом</p>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg mb-4">
              Оплатить 5 000 ₽
            </button>

            {!isTimeUp ? (
              <p className="text-right text-gray-500 text-sm mb-4">
                До отмены заказа осталось {formatTime(timeLeft)}
              </p>
            ) : (
              <p className="text-red-500 text-sm mb-4">
                Время для оплаты заказа вышло. Отмена заказа недоступна.
              </p>
            )}

            {/* <p className="text-red-500 text-sm">
              Неизвестная платёжная система.
            </p> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Payment;
