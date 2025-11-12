
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

import "./courses.css";
import OfflineCourses from "./OfflineCourses";
import OnlineCourses from "./OnlineCourses";

export default function Courses() {
  const { t, i18n } = useTranslation();



  return (
    <div className="bg-white text-gray-900 py-20 px-6 md:px-20 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1
          className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-4"
          data-aos="fade-up"
        >
          {t("courses.title")}
        </h1>
        <p
          className="text-gray-600 text-base xl:text-lg 2xl:text-xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {t("courses.description")}
        </p>
      </div>

<OnlineCourses/>      

      
    </div>
  );
}
