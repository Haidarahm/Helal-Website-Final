import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useCoursesStore } from "../../store";
import { AiFillStar } from "react-icons/ai";
const MyOfflineCourses = () => {
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
    <>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {enrolledCourses.map((course) => (
            <div
              key={course.enroll_id}
              className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              onClick={() => navigate(`/my-courses/${course.course_id}`)}
            >
              {/* Course Image */}
              <div className="relative h-40 overflow-hidden bg-gray-50">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
                {!course.image && (
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

                {/* Reviews Badge */}
                {course.reviews > 0 && (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1 shadow-sm">
                    <AiFillStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-700">
                      {course.reviews}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-4">
                {/* Course Title */}
                <h3
                  className={`text-sm font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {course.title}
                </h3>

                {/* Course Subtitle */}
                {course.subTitle && (
                  <p
                    className={`text-xs text-gray-500 mb-2 line-clamp-1 ${
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
                {course.enrolled_at && (
                  <div className="pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      {course.enrolled_at}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
    </>
  );
};

export default MyOfflineCourses;
