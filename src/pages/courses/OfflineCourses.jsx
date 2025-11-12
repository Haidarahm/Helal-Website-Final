import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { AiFillStar } from "react-icons/ai";
import { useCoursesStore } from "../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const OfflineCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { courses, isLoading, enrollCourse, fetchCourses } = useCoursesStore();
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourses(i18n.language);
  }, [i18n.language, fetchCourses]);

  const handleEnrollClick = async (course) => {
    try {
      setEnrollingCourseId(course.id);

      // Determine currency based on course price
      const currency = course.price_usd ? "usd" : "usd";

      // Build return and cancel URLs
      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/Helal-Aljaberi/course-success`;
      const cancelUrl = `${baseUrl}/Helal-Aljaberi/courses`;

      const response = await enrollCourse(
        course.id,
        currency,
        returnUrl,
        cancelUrl
      );

      // Check if response has redirect_url and redirect
      if (response?.redirect_url) {
        window.location.href = response.redirect_url;
      } else {
        // Show error toast if no redirect URL
        toast.error("Failed to process enrollment. Please try again.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      // Show error toast
      if (error?.response?.status === 401) {
        navigate("/auth", { state: { initialForm: "signup" } });
        setEnrollingCourseId(null);
        return;
      }
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to enroll in course. Please try again.";
      toast.error(errorMessage);
    } finally {
      setEnrollingCourseId(null);
    }
  };
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-20 text-gray-600 text-lg">
          {t("courses.no_courses") || "No courses available"}
        </div>
      )}
      {isLoading && courses.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {courses.map((course, index) => (
        <div
          key={course.id}
          className="courses-card-modern group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 border border-gray-100"
          data-aos="fade-up"
          data-aos-delay={`${index * 100}`}
        >
          {/* Image Container */}
          <div className="relative h-40 overflow-hidden bg-linear-to-br from-primary/10 to-primary/5">
            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Category Tag */}
            <div className="absolute top-3 right-3">
              <span className="bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                {t("courses.category")}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col p-4 gap-3">
            <h3
              className={`text-lg xl:text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {course.title}
            </h3>

            {/* Price */}
            <div className={`${isRTL ? "text-right" : "text-left"}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  {course.price_aed
                    ? `${course.price_aed} ${t("courses.currency.aed")}`
                    : t("courses.free")}
                </span>
                {course.price_usd && (
                  <span className="text-sm text-gray-500">
                    (~{course.price_usd} {t("courses.currency.usd")})
                  </span>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="flex items-center gap-0.5">
                <AiFillStar className="text-yellow-400 text-lg" />
                <AiFillStar className="text-yellow-400 text-lg" />
                <AiFillStar className="text-yellow-400 text-lg" />
                <AiFillStar className="text-yellow-400 text-lg" />
                <AiFillStar className="text-yellow-400 text-lg" />
              </div>
              <span className="text-gray-600 text-xs">
                ({course.reviews} {t("courses.reviews")})
              </span>
            </div>

            <p
              className={`text-gray-600 text-xs xl:text-sm leading-relaxed line-clamp-2 grow ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {course.description}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => handleEnrollClick(course)}
              disabled={enrollingCourseId === course.id || isLoading}
              className="w-full bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-xs xl:text-sm transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {enrollingCourseId === course.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-white">{t("courses.enroll_button")}</span>
              )}
            </button>
          </div>

          {/* Hover Effect Glow */}
          <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none shadow-lg"></div>

          {/* Bottom Border Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};
export default OfflineCourses;
