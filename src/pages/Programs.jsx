import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import PricingModal from "../components/PricingModal";
import img1 from "../assets/images/1.webp";
import img2 from "../assets/images/2.webp";
import img3 from "../assets/images/3.webp";
import img4 from "../assets/images/4.webp";
import img5 from "../assets/images/5.webp";
import img6 from "../assets/images/6.webp";
import img7 from "../assets/images/7.webp";

export default function Programs() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 700,
      easing: "ease-out-quart",
      once: false,
      offset: 0,
      delay: 0,
      disable: false,
    });
    AOS.refresh();
  }, []);

  const handleEnrollClick = () => {
    setIsPricingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPricingModalOpen(false);
  };

  const images = [img1, img2, img3, img4, img5, img6, img7];
  const programs = t("programs.programs", { returnObjects: true });

  const programsWithImages = programs.map((p, i) => ({
    ...p,
    image: images[i % images.length],
  }));

  return (
    <div className="bg-secondary text-accent py-16 px-6 md:px-20 overflow-hidden">
     <div className="header flex flex-col mt-6 overflow-hidden">
     <h1
        className={`text-4xl  xl:text-5xl 2xl:text-6xl font-bold text-primary text-center mb-4`}
        data-aos="fade-up"
      >
        {t("programs.title")}
      </h1>
      <p
        className={`text-text-light text-center max-w-2xl mx-auto mb-12 text-base xl:text-lg 2xl:text-xl`}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {t("programs.description")}
      </p>
     </div>
   

      <div className="space-y-16">
        {programsWithImages.map((program, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center justify-between bg-secondary-light rounded-2xl shadow-lg overflow-hidden ${
              isRTL ? "md:flex-row-reverse" : "md:flex-row"
            }`}
            data-aos={
              index % 2 === 0
                ? isRTL
                  ? "fade-left"
                  : "fade-right"
                : isRTL
                ? "fade-right"
                : "fade-left"
            }
          >
            <div
              className={`md:w-1/2 p-8 ${isRTL ? "md:order-2" : "md:order-1"}`}
            >
              <h2
                className={`text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-primary mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {program.title}
              </h2>
              <h3
                className={`text-lg xl:text-xl 2xl:text-2xl text-text-light mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {program.subtitle}
              </h3>
              <p
                className={`text-text-secondary mb-6 text-sm xl:text-base 2xl:text-lg ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {program.description}
              </p>
              <button
                onClick={handleEnrollClick}
                className={`bg-primary hover:bg-primary-dark text-accent font-medium py-2 px-5 xl:py-3 xl:px-6 2xl:py-4 2xl:px-8 rounded-xl transition text-sm xl:text-base 2xl:text-lg ${
                  isRTL ? "mr-auto" : "ml-0"
                }`}
              >
                {t("programs.enroll_button")}
              </button>
            </div>

            <div className={`md:w-1/2 ${isRTL ? "md:order-1" : "md:order-2"}`}>
              <img
                src={program.image}
                alt={program.title}
                loading="lazy"
                decoding="async"
                className={`w-full h-80 object-cover ${
                  isRTL
                    ? "md:rounded-none md:rounded-l-2xl"
                    : "md:rounded-none md:rounded-r-2xl"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
