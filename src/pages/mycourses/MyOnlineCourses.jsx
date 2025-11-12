import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useOnlineCoursesStore } from "../../store";
import { AiFillStar } from "react-icons/ai";
import { Card } from "antd";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myOnlineCourses.map((course) => (
            <Card
              key={course.enroll_id}
              className="my-courses-card group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-primary"
              bordered
              onClick={() => {
                if (course.meet_url) {
                  window.open(course.meet_url, "_blank", "noopener");
                }
              }}
            >
              {/* Course Image */}
              <div className="relative h-36 overflow-hidden">
                {course.cover_image && (
                  <img
                    src={course.cover_image}
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                {!course.cover_image && (
                  <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-primary/10 to-primary/5">
                    <AiFillStar className="w-12 h-12 text-primary/30" />
                  </div>
                )}

                {/* Enrolled Badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-green-500 shadow-md">
                    ✓ {t("courses.my_courses.badge")}
                  </span>
                </div>

                {/* Live Badge */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-black/70 shadow-md">
                    {t("courses.my_courses.live")}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-4 bg-white">
                {/* Course Title */}
                <h3
                  className={`text-base font-bold text-primary mb-1 leading-tight line-clamp-2 ${
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
                  <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">
                        {t("courses.my_courses.date")}
                      </span>
                      <span>{formatDate(course.appointment.date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {t("courses.my_courses.time")}
                      </span>
                      <span>
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
                    <span className="text-lg font-bold text-primary">
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
                <div className="pt-2 border-t border-gray-100">
                  {course.meet_url ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(course.meet_url, "_blank", "noopener");
                      }}
                      className="w-full bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-xs transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {t("courses.my_courses.join_now")}
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="text-xs text-gray-500 italic">
                        {t("courses.my_courses.course_not_started")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Card>
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
