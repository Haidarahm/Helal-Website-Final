import React, { useEffect } from "react";
import story from "../../assets/home/story.webp";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export const Story = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
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
  return (
    <section
      className={`relative flex ${
        isRTL ? "md:flex-row-reverse" : "md:flex-row"
      } flex-col h-[75vh] md:h-screen w-full overflow-hidden bg-[color:var(--color-secondary)] text-white`}
    >
      {/* Left Content */}
      <div
        className="flex-1 flex items-center justify-center px-6 md:px-16 py-10 z-10"
        data-aos="fade-up"
      >
        <div className="max-w-xl">
          <h2
            className={`text-3xl md:text-5xl font-bold text-[color:var(--color-primary)] mb-6 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("story.title")}
          </h2>
          {/* Mobile: shorter summary */}
          <p
            className={`text-base text-[color:var(--color-accent-muted)] leading-relaxed md:hidden ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("story.mobile")}
          </p>
          {/* Desktop/tablet: full text */}
          <p
            className={`hidden md:block md:text-lg text-[color:var(--color-accent-muted)] leading-relaxed ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("story.desktop")}
          </p>
        </div>
      </div>

      {/* Right Image Background */}
      <div
        className="flex-1 relative"
        data-aos="fade-left"
        data-aos-delay="100"
      >
        <img
          src={story}
          alt="Success Story Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
    </section>
  );
};
