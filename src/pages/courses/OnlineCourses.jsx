import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLanguage } from "../../context/LanguageContext";
import { useOnlineCoursesStore } from "../../store";

const OnlineCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const {
    onlineCourses,
    pagination,
    isLoading,
    error,
    fetchOnlineCourses,
    enrollOnlineCourse,
  } = useOnlineCoursesStore();
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOnlineCourses(i18n.language, pagination.current_page);
  }, [i18n.language, fetchOnlineCourses, pagination.current_page]);

  const formatDate = (value) => {
    if (!value) return isRTL ? "غير محدد" : "Not scheduled";
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

  const handleEnrollClick = async (course) => {
    try {
      setEnrollingCourseId(course.id);

      const currency =
        course.price_usd && parseFloat(course.price_usd) > 0 ? "usd" : "aed";

      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/Helal-Aljaberi/course-success`;
      const cancelUrl = `${baseUrl}/Helal-Aljaberi/courses`;

      const response = await enrollOnlineCourse(
        course.id,
        currency,
        returnUrl,
        cancelUrl
      );

      const redirectUrl =
        response?.redirect_url ?? response?.data?.redirect_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error(
          t("courses.enroll_error") ||
            (isRTL
              ? "فشل في معالجة التسجيل. يرجى المحاولة مرة أخرى."
              : "Failed to process enrollment. Please try again.")
        );
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth", { state: { initialForm: "signup" } });
        setEnrollingCourseId(null);
        return;
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (isRTL
          ? "فشل في التسجيل في الدورة. يرجى المحاولة مرة أخرى."
          : "Failed to enroll in course. Please try again.");
      toast.error(errorMessage);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {error && (
        <div className="mb-10 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {isLoading && onlineCourses.length === 0 ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : onlineCourses.length === 0 ? (
        <div className="text-center py-32 text-gray-500 text-lg">
          {isRTL ? "لا توجد دورات متاحة حالياً" : "No online courses available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {onlineCourses.map((course) => (
            <article
              key={course.id}
              className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                    {isRTL ? "لا توجد صورة" : "No cover image"}
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                  {isRTL ? "مباشر" : "Live"}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {course.description ||
                      (isRTL ? "لا يوجد وصف" : "No description")}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Price */}
                  <div className={`${isRTL ? "text-right" : "text-left"}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
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
                          <span className="text-sm text-gray-500">
                            (~{course.price_usd} {t("courses.currency.usd")})
                          </span>
                        )}
                    </div>
                  </div>

                  {course.meet_url && (
                    <div className={`${isRTL ? "text-right" : "text-left"}`}>
                      <a
                        href={course.meet_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {isRTL ? "رابط اللقاء" : "Meeting link"}
                      </a>
                    </div>
                  )}

                  {course.appointment && (
                    <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {isRTL ? "التاريخ" : "Date"}
                        </span>
                        <span>{formatDate(course.appointment.date)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold">
                          {isRTL ? "الوقت" : "Time"}
                        </span>
                        <span>
                          {`${formatTime(
                            course.appointment.start_time
                          )} - ${formatTime(course.appointment.end_time)}`}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={() => handleEnrollClick(course)}
                      disabled={enrollingCourseId === course.id || isLoading}
                      className="w-full bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {enrollingCourseId === course.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-white">
                          {t("courses.enroll_button")}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineCourses;
