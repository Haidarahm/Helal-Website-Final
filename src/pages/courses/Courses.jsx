import "aos/dist/aos.css";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

import "./courses.css";

export default function Courses() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: false,
      offset: 100,
    });
  }, []);

  // Refresh AOS on route change
  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  // Redirect to online-courses if on base /courses path
  useEffect(() => {
    if (
      location.pathname === "/courses" ||
      location.pathname.endsWith("/courses")
    ) {
      navigate("/courses/online-courses", { replace: true });
    }
  }, [location.pathname, navigate]);

  const getActiveButton = () => {
    if (location.pathname.includes("/online-courses")) return "online";
    if (location.pathname.includes("/offline-courses")) return "offline";
    if (location.pathname.includes("/private-courses")) return "private";
    return "online"; // default
  };

  const activeButton = getActiveButton();

  const handleButtonClick = (type) => {
    if (type === "online") {
      navigate("/courses/online-courses");
    } else if (type === "offline") {
      navigate("/courses/offline-courses");
    } else if (type === "private") {
      navigate("/courses/private-courses");
    }
  };

  return (
    <div className="bg-white text-gray-900 py-20 px-6 md:px-20 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1
          className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-4"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          {t("courses.title")}
        </h1>
        <p
          className="text-gray-600 text-base xl:text-lg 2xl:text-xl"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          {t("courses.description")}
        </p>
      </div>

      {/* Selector Buttons */}
      <div className="max-w-4xl mx-auto flex justify-center ">
        <div
          className={`flex gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <button
            onClick={() => handleButtonClick("online")}
            className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
              activeButton === "online"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("courses.online_courses") || "Online Courses"}
          </button>
          <button
            onClick={() => handleButtonClick("offline")}
            className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
              activeButton === "offline"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("courses.offline_courses") || "Offline Courses"}
          </button>
          <button
            onClick={() => handleButtonClick("private")}
            className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
              activeButton === "private"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("courses.private_courses") || "Private Courses"}
          </button>
        </div>
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
}
