import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

const PrivateCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center py-32 text-gray-500 text-lg">
        {isRTL
          ? "لا توجد دورات خاصة متاحة حالياً"
          : "No private courses available at the moment"}
      </div>
    </div>
  );
};

export default PrivateCourses;
