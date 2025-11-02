import React, { useEffect } from "react";
import { Quote } from "lucide-react"; // npm install lucide-react
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export const Adaptation = () => {
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
    <section className="flex items-center justify-center bg-white py-24 px-6">
      <div
        className="max-w-4xl bg-[color:var(--color-secondary)] rounded-2xl shadow-lg shadow-black/20 p-10 md:p-16 text-center flex flex-col items-center"
        data-aos="fade-up"
      >
        {/* Quote Icon */}
        <Quote
          size={60}
          className="text-[color:var(--color-primary)] mb-6 opacity-90"
        />

        {/* Quote Text */}
        <p
          className={`text-xl md:text-2xl font-medium leading-relaxed text-[color:var(--color-accent-muted)] italic ${
            isRTL ? "text-right" : "text-center"
          }`}
        >
          {t("adaptation.quote")}
        </p>

        {/* Author */}
        <h4 className="mt-6 text-[color:var(--color-primary-light)] font-semibold text-lg">
          {t("adaptation.author")}
        </h4>
      </div>
    </section>
  );
};
