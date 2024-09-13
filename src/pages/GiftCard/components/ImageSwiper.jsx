import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import a1 from "../assets/s1.webp";
import a2 from "../assets/s2.webp";
import a3 from "../assets/s3.webp";
import a4 from "../assets/s4.webp";
import a5 from "../assets/Карта Пмраи 1-01.webp";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const ImageSwiper = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainSlider = useRef(null);

  const images = [
    { src: a5 },
    { src: a2 },
    { src: a3 },
    { src: a4 },
    { src: a1 },
    { src: a2 },
    { src: a5 },
    { src: a3 },
    { src: a4 },
    { src: a2 },
    { src: a5 },
    { src: a4 },
    { src: a4 },
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
    <section className="container m-auto">
      <h2 className="underline cursor-pointer items-center flex gap-3 text-[16px] font-semibold mt-3">
        {" "}
        <span>
          <RemoveRedEyeOutlinedIcon />
        </span>{" "}
        Посмотреть пример
      </h2>
      <div className="flex items-center gap-4 ">
        <div className="w-2/3 m-auto">
          <Slider {...settingsMain} ref={mainSlider} className="main-slider">
            {images.map((el, index) => (
              <div key={index}>
                <img
                  src={el.src}
                  alt={`Slide ${index}`}
                  className="w-full h-[420px] object-fill rounded-2xl"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Миниатюры в сетке */}
        <div className="shadow-2xl w-full h-[420px] overflow-y-scroll  p-6 rounded-2xl ">
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
                    ? "border-2 border-pink-500 rounded-xl"
                    : ""
                }`}
              >
                <img
                  src={el.src}
                  alt={`Thumbnail ${index}`}
                  className="w-full rounded-xl h-[60px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSwiper;
