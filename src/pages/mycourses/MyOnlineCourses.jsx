import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useOnlineCoursesStore } from "../../store";
import { AiFillStar } from "react-icons/ai";

const MyOnlineCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { myOnlineCourses, isMyCoursesLoading, getMyOnlineCourses } =
    useOnlineCoursesStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    getMyOnlineCourses(i18n.language);
  }, [i18n.language, getMyOnlineCourses]);

  const formatDate = (value) => {
    if (!value) return t("courses.my_courses.not_scheduled");
    return new Date(value).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "--";
    return new Date(`1970-01-01T${value}Z`).toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Loading State */}
      {isMyCoursesLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin"></div>
            <p className="text-text-secondary">{t("courses.loading")}</p>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      {!isMyCoursesLoading && myOnlineCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {myOnlineCourses.map((course) => (
            <div
              key={course.enroll_id}
              className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              onClick={() => {
                if (course.meet_url) {
                  window.open(course.meet_url, "_blank", "noopener");
                }
              }}
            >
              {/* Course Image */}
              <div className="relative h-40 overflow-hidden bg-gray-50">
                {course.cover_image && (
                  <img
                    src={course.cover_image}
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
                {!course.cover_image && (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <AiFillStar className="w-10 h-10 text-gray-300" />
                  </div>
                )}

                {/* Enrolled Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-white bg-green-500/90 backdrop-blur-sm">
                    ✓ {t("courses.my_courses.badge")}
                  </span>
                </div>

                {/* Live Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-white bg-black/70 backdrop-blur-sm">
                    {t("courses.my_courses.live")}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-4">
                {/* Course Title */}
                <h3
                  className={`text-sm font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {course.name}
                </h3>

                {/* Course Description */}
                <p
                  className={`text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {course.description}
                </p>

                {/* Appointment Info */}
                {course.appointment && (
                  <div className="mb-3 rounded-md bg-gray-50 px-2.5 py-2 text-xs text-gray-600">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-gray-500">
                        {t("courses.my_courses.date")}
                      </span>
                      <span className="text-gray-700">
                        {formatDate(course.appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">
                        {t("courses.my_courses.time")}
                      </span>
                      <span className="text-gray-700">
                        {`${formatTime(
                          course.appointment.start_time
                        )} - ${formatTime(course.appointment.end_time)}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className={`mb-3 ${isRTL ? "text-right" : "text-left"}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-primary">
                      {course.price_aed && parseFloat(course.price_aed) > 0
                        ? `${course.price_aed} ${t("courses.currency.aed")}`
                        : course.price_usd && parseFloat(course.price_usd) > 0
                        ? `${course.price_usd} ${t("courses.currency.usd")}`
                        : t("courses.free")}
                    </span>
                    {course.price_usd &&
                      parseFloat(course.price_usd) > 0 &&
                      course.price_aed &&
                      parseFloat(course.price_aed) > 0 && (
                        <span className="text-xs text-gray-500">
                          (~{course.price_usd} {t("courses.currency.usd")})
                        </span>
                      )}
                  </div>
                </div>

                {/* Meet URL Section */}
                <div className="pt-3 border-t border-gray-50">
                  {course.meet_url ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(course.meet_url, "_blank", "noopener");
                      }}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-xs flex items-center justify-center gap-2"
                    >
                      {t("courses.my_courses.join_now")}
                    </button>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-xs text-gray-400">
                        {t("courses.my_courses.course_not_started")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isMyCoursesLoading && myOnlineCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-primary/10 to-primary/5 rounded-full mb-6">
            <AiFillStar className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4">
            {t("courses.my_courses.no_courses_title")}
          </h3>
          <p className="text-text-secondary text-lg mb-8">
            {t("courses.my_courses.no_courses_description")}
          </p>
        </div>
      )}
    </>
  );
};

export default MyOnlineCourses;
