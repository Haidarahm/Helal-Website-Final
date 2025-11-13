import helal from "../../assets/image2.webp";
import background from "../../assets/back.png";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import certPdf from "../../assets/pdf/الخبرات.pdf";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative h-[90vh] md:h-screen flex items-center overflow-hidden bg-secondary">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          className="w-full h-full object-cover"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-linear-to-r from-secondary/95 via-secondary/85 to-primary-dark/50"></div>
      </div>

      {/* Content */}
      <div
        className={`flex gap-8 flex-col w-full md:w-1/2 relative mt-10 z-20 px-6 md:px-10`}
      >
        <h1
          className={`text-4xl md:text-5xl 2xl:text-7xl  font-extrabold text-primary tracking-tight  drop-shadow-md  ${
            isRTL ? "text-right font-family-zain leading-12 md:leading-24" : "text-left"
          }`}
          data-aos="fade-up"
        >
          {t("hero.title")}
        </h1>
        <h2
          className={`text-xl md:text-2xl lg:text-3xl font-semibold text-primary-light drop-shadow ${
            isRTL ? "text-right" : "text-left"
          }`}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {t("hero.subtitle")}
        </h2>
        <p
          className={`text-base md:text-lg lg:text-xl text-accent/95 leading-relaxed md:leading-8  drop-shadow ${
            isRTL ? "text-right" : "text-left"
          }`}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {t("hero.description")}
        </p>
        <div
          className={`flex gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <button
            onClick={() => navigate("/consultation")}
            className="group relative px-7 py-3 md:px-8 md:py-4 rounded-xl bg-primary text-secondary font-semibold shadow-md shadow-black/10 transition-all duration-300 hover:bg-primary-dark"
          >
            <span className="relative z-10">{t("hero.get_consultation")}</span>
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),rgba(255,255,255,0))]"></span>
          </button>
          <a
            href={certPdf}
            download
            className="px-4  py-3 md:px-8 md:py-4 rounded-xl border-2 border-primary text-primary font-semibold transition-all duration-300 hover:bg-primary hover:text-secondary"
          >
            {t("hero.learn_more")}
          </a>
        </div>
      </div>

      {/* Image */}
      <div
        className={`right-section h-full relative z-20 w-0 md:w-1/2`}
        data-aos="fade-left"
        data-aos-delay="150"
      >
        <div className="container-image relative h-full w-full">
          <img
            src={helal}
            alt="Helal"
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover opacity-95 md:absolute md:left-12`}
          />
        </div>
      </div>
    </div>
  );
}
