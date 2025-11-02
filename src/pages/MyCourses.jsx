import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useCoursesStore } from "../store";
import { AiFillStar } from "react-icons/ai";
import { Card } from "antd";

export default function MyCourses() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { enrolledCourses, isLoading, fetchEnrolledCourses } =
    useCoursesStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEnrolledCourses(i18n.language);
  }, [i18n.language, fetchEnrolledCourses]);

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

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin"></div>
                <p className="text-text-secondary">{t("courses.loading")}</p>
              </div>
            </div>
          )}

          {/* Enrolled Courses Grid */}
          {!isLoading && enrolledCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrolledCourses.map((course) => (
                <Card
                  key={course.enroll_id}
                  className="my-courses-card group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-primary"
                  bordered
                  onClick={() => navigate(`/my-courses/${course.course_id}`)}
                >
                  {/* Course Image */}
                  <div className="relative h-36 overflow-hidden">
                    {course.image && (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    {!course.image && (
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

                    {/* Reviews Badge */}
                    {course.reviews > 0 && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                        <AiFillStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">
                          {course.reviews}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-4 bg-white">
                    {/* Course Title */}
                    <h3
                      className={`text-base font-bold text-primary mb-1 leading-tight line-clamp-2 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {course.title}
                    </h3>

                    {/* Course Subtitle */}
                    {course.subTitle && (
                      <p
                        className={`text-xs font-medium text-gray-600 mb-2 line-clamp-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {course.subTitle}
                      </p>
                    )}

                    {/* Course Description */}
                    <p
                      className={`text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {course.description}
                    </p>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-100">
                      {course.enrolled_at && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 rounded-full bg-primary"></span>
                          {course.enrolled_at}
                        </p>
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
          {!isLoading && enrolledCourses.length === 0 && (
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
        </div>
      </section>
    </div>
  );
}
