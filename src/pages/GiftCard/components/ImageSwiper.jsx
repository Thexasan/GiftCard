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
    accessibility: true, // Включение встроенной доступности
    initialSlide: currentSlide,
    afterChange: (index) => setCurrentSlide(index),
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    mainSlider.current.slickGoTo(index);
  };

  return (
    <section className="container mx-auto px-4">
      <h2 className="underline cursor-pointer items-center flex gap-3 text-[14px] sm:text-[16px] font-semibold mt-3">
        <span>
          <RemoveRedEyeOutlinedIcon />
        </span>
        Посмотреть пример
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-2/3 mx-auto">
          <Slider
            {...settingsMain}
            ref={mainSlider}
            className="main-slider"
            aria-hidden={false} // Убедитесь, что сам слайдер доступен
          >
            {images.map((el, index) => (
              <div
                key={index}
                aria-hidden={currentSlide !== index} // Применяйте aria-hidden только к неактивным слайдам
                inert={currentSlide !== index} // Используйте inert для исключения фокуса
              >
                <img
                  src={el.src}
                  alt={`Slide ${index}`}
                  className="w-full h-[200px] sm:h-[250px] md:h-[420px] object-cover rounded-2xl"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Thumbnail Section */}
        <div className="w-full md:w-1/3 md:shadow-2xl md:h-[420px] md:overflow-y-scroll p-4 md:p-6 rounded-2xl">
          <h2 className="text-[16px] sm:text-[20px] hidden md:block font-main font-semibold">
            Дизайн сертификата
          </h2>

          {/* Horizontal Scroll Thumbnails */}
          <div className="flex gap-3 overflow-x-scroll md:overflow-x-hidden scroll-smooth py-2 mt-2 md:grid md:grid-cols-3">
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
                  className="min-w-24 md:min-w-0 w-full h-[70px] md:w-full  rounded-xl object-cover"
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
