import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import a1 from "../assets/s1.webp";
import a2 from "../assets/s2.webp";
import a3 from "../assets/s3.webp";
import a4 from "../assets/s4.webp";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const ImageSwiper = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainSlider = useRef(null);

  const images = [
    { src: a1 },
    { src: a2 },
    { src: a3 },
    { src: a4 },
    { src: a1 },
    { src: a2 },
    { src: a3 },
    { src: a4 },
    { src: a1 },
    { src: a2 },
    { src: a3 },
    { src: a4 },
  ];

  const settingsMain = {
    arrows: false,
    fade: true,
    initialSlide: currentSlide,
    afterChange: (index) => setCurrentSlide(index),
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    mainSlider.current.slickGoTo(index);
  };

  return (
    <div className="flex container items-center gap-10 m-auto mt-10">
      {/* Основное изображение */}
      <div className="w-2/3">
        <h2 className="underline cursor-pointer items-center flex gap-3 text-[16px] font-semibold my-3">
          {" "}
          <span>
            <RemoveRedEyeOutlinedIcon />
          </span>{" "}
          Посмотреть пример
        </h2>
        <Slider {...settingsMain} ref={mainSlider} className="main-slider">
          {images.map((el, index) => (
            <div key={index}>
              <img
                src={el.src}
                alt={`Slide ${index}`}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Миниатюры в сетке */}
      <div className="shadow-2xl w-1/3 p-6 rounded-2xl ">
        <h2 className="text-[20px] font-main font-semibold">
          Дизайн сертификата
        </h2>
        <div className=" rounded-2xl mt-[10px] grid grid-cols-3 items-center gap-2">
          {images.map((el, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`thumbnail-item cursor-pointer ${
                currentSlide === index
                  ? "border-2 border-pink-500 rounded-2xl"
                  : ""
              }`}
            >
              <img
                src={el.src}
                alt={`Thumbnail ${index}`}
                className="w-full rounded-2xl h-20"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSwiper;
