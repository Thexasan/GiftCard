import GiftForm from "./GiftForm";
import ImageSwiper from "./ImageSwiper";

const ChooseCertificate = () => {
  return (
    <>
      <section className="container  m-auto flex items-start flex-col justify-center">
        <h1 className=" text-[24px] text-start md:text-[36px] font-semibold font-[Montserrat,sans-serif]">
          Электронный подарочный сертификат
        </h1>
      </section>
      <ImageSwiper />
      <GiftForm />
    </>
  );
};

export default ChooseCertificate;
