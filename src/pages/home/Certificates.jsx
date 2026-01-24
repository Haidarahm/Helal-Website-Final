import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import cert1 from "../../assets/certificates/1.jpg";
import cert2 from "../../assets/certificates/2.jpg";
import cert3 from "../../assets/certificates/3.jpg";
import cert4 from "../../assets/certificates/4.jpg";
import cert5 from "../../assets/certificates/5.jpg";
import cert6 from "../../assets/certificates/6.png";
import cert7 from "../../assets/certificates/7.png";
import cert8 from "../../assets/certificates/8.png";
import cert9 from "../../assets/certificates/9.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export const Certificates = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full bg-secondary py-14 md:py-20 px-4 md:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(800px 400px at 10% 10%, rgba(249,148,60,0.18), transparent 60%), radial-gradient(700px 500px at 90% 80%, rgba(174,70,7,0.12), transparent 60%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className={`text-center ${isRTL ? "rtl" : ""}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-light">
            {t("certificates.title")}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-accent-muted leading-relaxed">
            {t("certificates.description")}
          </p>
        </div>

        <div className="mt-10 md:mt-14">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination]}
            effect="coverflow"
            centeredSlides
            grabCursor
            loop
            slidesPerView={"auto"}
            spaceBetween={24}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 160,
              modifier: 2.2,
              slideShadows: false,
            }}
            autoplay={{
              delay: 2600,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            a11y={{
              enabled: true,
              prevSlideMessage: "Previous certificate",
              nextSlideMessage: "Next certificate",
              firstSlideMessage: "This is the first certificate",
              lastSlideMessage: "This is the last certificate",
              paginationBulletMessage: "Go to certificate {{index}}",
            }}
            className="!px-2"
          >
            {[
              cert1,
              cert2,
              cert3,
              cert4,
              cert5,
              cert6,
              cert7,
              cert8,
              cert9,
            ].map((src, index) => (
              <SwiperSlide
                key={index}
                className="!w-[260px] sm:!w-[320px] md:!w-[380px] lg:!w-[420px]"
              >
                <div className="w-full h-[300px] sm:h-[360px] md:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 flex items-center justify-center">
                  <img
                    src={src}
                    alt={`certificate-${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
