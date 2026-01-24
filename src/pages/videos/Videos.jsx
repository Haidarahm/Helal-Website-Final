import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useVideosStore } from "../../store";
import { Pagination, Card } from "antd";
import { FiPlay } from "react-icons/fi";
import SEO from "../../components/SEO";

export const Videos = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { courseVideos, pagination, isLoading, fetchCourseVideos } =
    useVideosStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (courseId) {
      window.scrollTo(0, 0);
      fetchCourseVideos(courseId, i18n.language, currentPage, 6);
    }
  }, [courseId, i18n.language, currentPage, fetchCourseVideos]);

  // Fake videos data (fallback if courseId is not provided)
  const allVideos = [
    {
      id: 1,
      title:
        i18n.language === "ar"
          ? "مقدمة في التداول الأساسي"
          : "Introduction to Basic Trading",
      subtitle:
        i18n.language === "ar"
          ? "ابدأ رحلتك في عالم التداول"
          : "Start Your Trading Journey",
      description:
        i18n.language === "ar"
          ? "تعلم الأساسيات الأولى للتداول والمفاهيم الأساسية للأسواق المالية"
          : "Learn the basics of trading and fundamental concepts of financial markets",
      cover_image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450",
    },
    {
      id: 2,
      title:
        i18n.language === "ar"
          ? "إدارة المخاطر في الاستثمار"
          : "Risk Management in Investment",
      subtitle:
        i18n.language === "ar"
          ? "حماية رأس المال بشكل فعال"
          : "Effectively Protect Your Capital",
      description:
        i18n.language === "ar"
          ? "فهم كيفية إدارة المخاطر وحماية استثماراتك من الخسائر الكبيرة"
          : "Understand how to manage risks and protect your investments from major losses",
      cover_image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450",
    },
    {
      id: 3,
      title:
        i18n.language === "ar"
          ? "التحليل الفني للمبتدئين"
          : "Technical Analysis for Beginners",
      subtitle:
        i18n.language === "ar"
          ? "قراءة الرسوم البيانية بسهولة"
          : "Reading Charts with Ease",
      description:
        i18n.language === "ar"
          ? "تعلم كيفية قراءة الرسوم البيانية واستخدام المؤشرات الفنية"
          : "Learn how to read charts and use technical indicators",
      cover_image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450",
    },
    {
      id: 4,
      title:
        i18n.language === "ar"
          ? "تطوير مشروعك الناشئ"
          : "Developing Your Startup",
      subtitle:
        i18n.language === "ar"
          ? "من الفكرة إلى النجاح"
          : "From Idea to Success",
      description:
        i18n.language === "ar"
          ? "أساسيات ريادة الأعمال وكيفية تطوير مشروعك الناشئ"
          : "Fundamentals of entrepreneurship and how to develop your startup",
      cover_image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=450",
    },
    {
      id: 5,
      title:
        i18n.language === "ar"
          ? "القيادة والتواصل الفعال"
          : "Leadership and Effective Communication",
      subtitle:
        i18n.language === "ar"
          ? "إلهام وإدارة الفريق"
          : "Inspire and Manage Your Team",
      description:
        i18n.language === "ar"
          ? "مهارات القيادة والتواصل الناجح مع الفريق والعملاء"
          : "Leadership skills and successful communication with team and clients",
      cover_image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450",
    },
    {
      id: 6,
      title:
        i18n.language === "ar"
          ? "التسويق الرقمي للمبتدئين"
          : "Digital Marketing for Beginners",
      subtitle:
        i18n.language === "ar"
          ? "بناء وجودك على الإنترنت"
          : "Build Your Online Presence",
      description:
        i18n.language === "ar"
          ? "تعلم أساسيات التسويق الرقمي وكيفية الوصول للجمهور المستهدف"
          : "Learn the basics of digital marketing and how to reach your target audience",
      cover_image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450",
    },
    {
      id: 7,
      title:
        i18n.language === "ar"
          ? "الاستثمار الشخصي الذكي"
          : "Smart Personal Investment",
      subtitle:
        i18n.language === "ar"
          ? "بناء الثروة تدريجياً"
          : "Build Wealth Gradually",
      description:
        i18n.language === "ar"
          ? "استراتيجيات الاستثمار الشخصي وإدارة الأموال الذكية"
          : "Personal investment strategies and smart money management",
      cover_image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450",
    },
    {
      id: 8,
      title:
        i18n.language === "ar"
          ? "بناء العلامة التجارية الشخصية"
          : "Building Personal Brand",
      subtitle:
        i18n.language === "ar" ? "تميز في السوق" : "Stand Out in the Market",
      description:
        i18n.language === "ar"
          ? "كيفية بناء علامة تجارية شخصية قوية وجذابة"
          : "How to build a strong and attractive personal brand",
      cover_image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=450",
    },
    {
      id: 9,
      title:
        i18n.language === "ar"
          ? "تخطيط المشاريع الناجح"
          : "Successful Project Planning",
      subtitle:
        i18n.language === "ar"
          ? "من التخطيط إلى التنفيذ"
          : "From Planning to Execution",
      description:
        i18n.language === "ar"
          ? "تعلم كيفية تخطيط وإدارة المشاريع بشكل فعال"
          : "Learn how to plan and manage projects effectively",
      cover_image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450",
    },
  ];

  // Use API data if courseId is provided, otherwise use fallback data
  const videos = courseId ? courseVideos : allVideos;
  const totalItems = courseId ? pagination?.total || 0 : allVideos.length;
  const totalPages = courseId
    ? pagination?.last_page || 1
    : Math.ceil(totalItems / 6);
  const itemsPerPage = courseId ? pagination?.per_page || 6 : 6;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <SEO
        title={t("videos.title", "Videos") || (isRTL ? "الفيديوهات" : "Videos")}
        description={
          isRTL
            ? "شاهد أحدث الفيديوهات التدريبية والدروس في التداول والاستثمار والتطوير الذاتي"
            : "Watch our latest training videos and tutorials in trading, investment, and personal development"
        }
      />
      <div
        className="min-h-screen bg-white py-20 px-4 md:px-20 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-6"
            data-aos="fade-up"
          >
            {t("videos.title", "Videos")}
          </h1>
          <p
            className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t(
              "videos.description",
              "Watch our latest training videos and tutorials."
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">Loading videos...</div>
          </div>
        )}

        {/* Videos Grid */}
        {!isLoading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {videos.map((video) => (
              <div
                key={video.id}
                role="button"
                tabIndex={0}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() =>
                  navigate(
                    courseId
                      ? `/my-courses/${courseId}/videos/${video.id}`
                      : `/videos/${video.id}`
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(courseId ? `/my-courses/${courseId}/videos/${video.id}` : `/videos/${video.id}`);
                  }
                }}
                aria-label={t("videos.play", "Play") + ": " + (video.title || "")}
              >
                {/* Image Container with Play Button */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.cover || video.cover_image}
                    alt={video.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      <FiPlay className="w-6 h-6 text-primary ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-4 ${isRTL ? "text-right" : "text-left"}`}>
                  <h2 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {video.title}
                  </h2>
                  {video.subTitle && (
                    <p className="text-primary text-xs font-medium mb-2 line-clamp-1">
                      {video.subTitle}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No videos available</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} ${t("videos.of", "of")} ${total}`
              }
              locale={{ prev_page: "Previous page", next_page: "Next page" }}
              style={{
                direction: isRTL ? "rtl" : "ltr",
              }}
            />
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Videos;
