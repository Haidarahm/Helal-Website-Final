import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function MyCourses() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to offline-courses if on base /my-courses path
  useEffect(() => {
    if (
      location.pathname === "/my-courses" ||
      location.pathname.endsWith("/my-courses")
    ) {
      navigate("/my-courses/offline", { replace: true });
    }
  }, [location.pathname, navigate]);

  const getActiveButton = () => {
    if (location.pathname.includes("/online")) return "online";
    if (location.pathname.includes("/offline")) return "offline";
    return "offline"; // default
  };

  const activeButton = getActiveButton();

  const handleButtonClick = (type) => {
    if (type === "online") {
      navigate("/my-courses/online");
    } else if (type === "offline") {
      navigate("/my-courses/offline");
    }
  };

  return (
    <div className="w-full bg-white min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Section */}
      <section className="mt-20 px-6 md:px-20 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-4">
              {t("courses.my_courses.title")}
            </h1>
            <p className="text-text-secondary text-lg xl:text-xl 2xl:text-2xl">
              {t("courses.my_courses.description")}
            </p>
          </div>

          {/* Selector Buttons */}
          <div className="max-w-4xl mx-auto flex justify-center mb-6">
            <div
              className={`flex gap-4 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <button
                onClick={() => handleButtonClick("offline")}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                  activeButton === "offline"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("courses.offline_courses") || "Offline Courses"}
              </button>
              <button
                onClick={() => handleButtonClick("online")}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                  activeButton === "online"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("courses.online_courses") || "Online Courses"}
              </button>
            </div>
          </div>

          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </section>
    </div>
  );
}
