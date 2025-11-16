import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { usePrivateCoursesStore } from "../../store";
import { Pagination } from "antd";

const PrivateCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { lessons, pagination, isLoading, fetchPrivateLessons } =
    usePrivateCoursesStore();
  const [page, setPage] = useState(1);
  const lang = useMemo(
    () => (i18n.language?.startsWith("ar") ? "ar" : "en"),
    [i18n.language]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPrivateLessons({ lang, page, per_page: 5 });
  }, [lang, page, fetchPrivateLessons]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-6 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-gray-500">
          {t("loading") || (isRTL ? "جاري التحميل..." : "Loading...")}
        </div>
      ) : lessons.length === 0 ? (
        <div className="py-24 text-center text-gray-500">
          {isRTL
            ? "لا توجد دورات خاصة متاحة حالياً"
            : "No private courses available at the moment"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] w-full bg-accent-muted">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg transition-colors hover:bg-primary-dark"
                  >
                    {t("courses.enroll") || (isRTL ? "سجل الآن" : "Enroll")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-center mt-10">
          <Pagination
            current={pagination.current_page || page}
            pageSize={pagination.per_page || 5}
            total={pagination.total || lessons.length}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default PrivateCourses;
