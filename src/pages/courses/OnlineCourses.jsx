import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useOnlineCoursesStore } from "../../store";

const OnlineCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { onlineCourses, pagination, isLoading, error, fetchOnlineCourses } =
    useOnlineCoursesStore();

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

  return (
    <div
      className="bg-white text-gray-900 py-20 px-6 md:px-20 min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        

        {error && (
          <div className="mb-10 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : onlineCourses.length === 0 ? (
          <div className="text-center py-32 text-gray-500 text-lg">
            {isRTL
              ? "لا توجد دورات متاحة حالياً"
              : "No online courses available"}
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
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-semibold text-primary text-lg">
                        {course.price
                          ? `${course.price} USD`
                          : isRTL
                          ? "مجانية"
                          : "Free"}
                      </span>
                      {course.meet_url && (
                        <a
                          href={course.meet_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {isRTL ? "رابط اللقاء" : "Meeting link"}
                        </a>
                      )}
                    </div>

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
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineCourses;
