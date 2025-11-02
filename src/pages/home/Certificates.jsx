import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import cert1 from "../../assets/certificates/1.jpg";
import cert2 from "../../assets/certificates/2.jpg";
import cert3 from "../../assets/certificates/3.jpg";
import cert4 from "../../assets/certificates/4.jpg";
import cert5 from "../../assets/certificates/5.jpg";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export const Certificates = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="w-full bg-[color:var(--color-secondary)] py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Left: Texts */}
        <div className="md:order-1 order-2">
          <h2
            className={`text-3xl md:text-4xl font-bold text-[color:var(--color-primary-light)] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("certificates.title")}
          </h2>
          <p
            className={`mt-4 text-[color:var(--color-accent-muted)] leading-relaxed ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("certificates.description")}
          </p>
        </div>

        {/* Right: Swiper */}
        <div className="md:order-2 order-1">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="rounded-2xl"
          >
            {[cert1, cert2, cert3, cert4, cert5].map((src, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[320px] sm:h-[380px] md:h-[520px] bg-[color:var(--color-accent-muted)] rounded-2xl flex items-center justify-center p-3 sm:p-4 md:p-6 shadow-lg shadow-black/10">
                  <img
                    src={src}
                    alt={`certificate-${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-full object-contain rounded-lg"
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
