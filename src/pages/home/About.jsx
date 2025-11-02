import aboutImg from "../../assets/home/aboutHome.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export default function About() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section
      className={`relative flex  bg-[color:var(--color-accent)] text-[color:var(--color-text-primary)] top-12 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <img
        src={aboutImg}
        alt="About"
        className={`hidden lg:block w-2/3 helal-image absolute top-4 ${
          isRTL ? "-left-1/5" : "right-0"
        } opacity-15 h-full object-cover`}
      />
      {/* Text content */}
      <div
        className={`relative z-10 space-y-6 order-2  lg:order-1 w-full lg:w-1/2 ${
          isRTL ? "mr-0 lg:mr-10 " : "ml-0 lg:ml-10"
        } px-6 lg:px-0`}
      >
        <h2
          className={`text-3xl lg:text-4xl font-bold text-[color:var(--color-primary)] ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("about.title")}
        </h2>
        <p
          className={`text-[color:var(--color-text-secondary)] leading-relaxed ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("about.description")}
        </p>
        <div className="space-y-4">
          <h3
            className={`text-2xl font-semibold text-[color:var(--color-primary)] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("about.why_title")}
          </h3>
          <div className="space-y-2">
            <h4
              className={`text-xl font-semibold ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("about.goals_title")}
            </h4>
            <p
              className={`text-[color:var(--color-text-secondary)] leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("about.goals_description")}
            </p>
          </div>
          <div className="space-y-2">
            <h4
              className={`text-xl font-semibold ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("about.message_title")}
            </h4>
            <p
              className={`text-[color:var(--color-text-secondary)] leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("about.message_description")}
            </p>
          </div>
          <div className="space-y-2">
            <h4
              className={`text-xl font-semibold ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("about.passion_title")}
            </h4>
            <p
              className={`text-[color:var(--color-text-secondary)] leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("about.passion_description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
