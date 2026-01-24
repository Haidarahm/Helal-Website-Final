import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import broadcastImage from "../../../assets/broadcastHilal.png"; // Using a placeholder from existing assets

const Broadcast = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full py-16 md:py-24 bg-accent overflow-hidden">
      <div className="container mx-auto px-6 md:px-10">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-40 ${
            isRTL ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image Section (Left) */}
          <div className="w-full lg:w-1/2 relative group" data-aos="fade-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/5">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img
                src={broadcastImage}
                alt={t("broadcast.title") || "Hilal Al Jabri Broadcasts"}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            {/* Decorative Element */}
            <div
              className={`absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10 ${
                isRTL ? "-left-6 right-auto" : ""
              }`}
            ></div>
            <div
              className={`absolute -top-6 -left-6 w-32 h-32 bg-primary-dark/10 rounded-full blur-2xl -z-10 ${
                isRTL ? "-right-6 left-auto" : ""
              }`}
            ></div>
          </div>

          {/* Content Section (Right) */}
          <div
            className="w-full lg:w-1/2 flex flex-col gap-6"
            data-aos="fade-left"
          >
            <div
              className={`flex flex-col gap-2 ${
                isRTL ? "items-end text-right" : "items-start text-left"
              }`}
            >
              <p className="text-primary font-bold tracking-wider uppercase text-sm md:text-base">
                {t("broadcast.subtitle") || "Exclusive Content"}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                {t("broadcast.title") || "Hilal Al Jabri Broadcasts"}
              </h2>
            </div>

            <p
              className={`text-text-secondary text-lg leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("broadcast.description") ||
                "Discover a wealth of knowledge and insights through our exclusive broadcasts. Join thousands of listeners who are transforming their financial future with expert advice and strategies."}
            </p>

            <div
              className={`pt-4 flex ${isRTL ? "justify-end" : "justify-start"}`}
            >
              <button
                onClick={() => navigate("/broadcasts")}
                className="group relative px-8 py-4 rounded-xl bg-linear-to-r from-primary to-primary-dark text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("broadcast.check_all") || "Check All Broadcasts"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isRTL
                        ? "group-hover:-translate-x-1 rotate-180"
                        : "group-hover:translate-x-1"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Broadcast;
