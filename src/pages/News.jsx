import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useNewsStore } from "../store";
import { Pagination } from "antd";
import SEO from "../components/SEO";

export const News = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { news, isLoading, pagination, fetchNews } = useNewsStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
  }, [i18n.language]);

  useEffect(() => {
    fetchNews(i18n.language, currentPage);
  }, [i18n.language, currentPage, fetchNews]);

  const newsData = news || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": t("news.title") || "Latest News & Updates",
    "description": t("news.description") || "Stay updated with our latest training programs, success stories, and trading insights"
  };

  return (
    <div
      className="min-h-screen bg-white py-20 px-4 md:px-20 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO
        title={t("news.title") || "Latest News & Updates"}
        description={t("news.description") || "Stay updated with our latest training programs, success stories, and trading insights"}
        type="website"
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-6"
            data-aos="fade-up"
          >
            {t("news.title")}
          </h1>
          <p
            className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t("news.description")}
          </p>
        </div>

        {/* News Items - Alternating Layout */}
        <div className="space-y-16 md:space-y-20">
          {newsData.map((news, index) => {
            const isReversed = index % 2 !== 0; // alternate left/right

            return (
              <article
                key={news.id}
                className="overflow-hidden"
                data-aos={isReversed ? "fade-left" : "fade-right"}
                data-aos-delay={index * 100}
              >
                <div
                  className={`flex flex-col ${
                    isRTL
                      ? isReversed
                        ? "md:flex-row"
                        : "md:flex-row-reverse"
                      : isReversed
                      ? "md:flex-row-reverse"
                      : "md:flex-row"
                  } items-stretch gap-6 md:gap-10 min-h-[420px]`}
                >
                  {/* Text Content */}
                  <div
                    className={`p-6 md:p-8 lg:p-12 flex flex-col justify-center flex-1 md:basis-[50%] ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {news.title}
                    </h2>
                    <p className="text-lg text-primary font-semibold mb-6 max-w-2xl">
                      {news.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-8 max-w-2xl">
                      {news.description}
                    </p>

                    {/* Read More Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/news/${news.id}`);
                      }}
                      className="w-fit px-8 py-4 bg-primary text-white rounded-[15px] font-semibold hover:bg-primary-dark transition-all duration-300 hover:scale-105 flex items-center gap-3"
                    >
                      <span>{t("news.read_more")}</span>
                      <span className="text-xl">{isRTL ? "←" : "→"}</span>
                    </button>
                  </div>

                  {/* Images - Right or Left alternating */}
                  <div
                    className={`relative overflow-hidden rounded-lg shadow-md ring-1 ring-gray-100 md:basis-[50%] md:shrink-0`}
                  >
                    {news.images.length === 1 ? (
                      <img
                        src={news.images[0]}
                        alt={news.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover min-h-[260px] md:min-h-[340px]"
                      />
                    ) : news.images.length === 2 ? (
                      <div className="grid grid-cols-2 h-full min-h-[260px] md:min-h-[340px]">
                        {news.images.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt={`${news.title} ${imgIndex + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    ) : news.images.length === 3 ? (
                      <div className="grid grid-cols-2 grid-rows-2 h-full min-h-[260px] md:min-h-[340px] gap-0">
                        <img
                          src={news.images[0]}
                          alt={`${news.title} 1`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover row-span-2"
                        />
                        <img
                          src={news.images[1]}
                          alt={`${news.title} 2`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <img
                          src={news.images[2]}
                          alt={`${news.title} 3`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 h-full min-h-[260px] md:min-h-[340px]">
                        {news.images.slice(0, 2).map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt={`${news.title} ${imgIndex + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center mt-16">
            <Pagination
              current={pagination.current_page}
              total={pagination.total}
              pageSize={pagination.per_page}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                isRTL
                  ? `${total} ${t("news.of") || "من"} ${range[0]} - ${range[1]}`
                  : `${range[0]}-${range[1]} ${t("news.of") || "of"} ${total}`
              }
              locale={{ prev_page: "Previous page", next_page: "Next page" }}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && newsData.length === 0 && (
          <div className="text-center py-20 text-gray-600 text-lg">
            {t("news.loading")}
          </div>
        )}

        {/* No News State */}
        {!isLoading && newsData.length === 0 && (
          <div className="text-center py-20 text-gray-600 text-lg">
            {t("news.no_news")}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
