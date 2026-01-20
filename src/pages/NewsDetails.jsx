import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useNewsStore } from "../store";
import SEO from "../components/SEO";

export const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { singleNews, isLoading, error, fetchNewsById } = useNewsStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 700,
      easing: "ease-out-quart",
      once: true,
      offset: 0,
      delay: 0,
      disable: false,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (id) {
      fetchNewsById(id, i18n.language);
    }
  }, [id, i18n.language, fetchNewsById]);

  // Show loading while fetching or if we have an id but haven't fetched yet
  if (isLoading || (id && !singleNews && !error)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Only show error after loading is complete and we have a response
  if (!isLoading && (error || !singleNews)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            News Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The requested news article could not be found."}
          </p>
          <button
            onClick={() => navigate("/news")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  const structuredData = singleNews ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": singleNews.title,
    "description": singleNews.description,
    "image": singleNews.images && singleNews.images.length > 0 ? singleNews.images : undefined,
    "author": {
      "@type": "Person",
      "name": "Helal Al Jabri"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Helal Al Jabri"
    }
  } : null;

  return (
    <div
      className="min-h-screen bg-white py-20 px-4 md:px-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {singleNews && (
        <SEO
          title={singleNews.title}
          description={singleNews.description || singleNews.subtitle}
          image={singleNews.images && singleNews.images.length > 0 ? singleNews.images[0] : undefined}
          type="article"
          structuredData={structuredData}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/news")}
          className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>Back to News</span>
        </button>

        {/* Detail View */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Images - Scrollable */}
          <motion.div
            className="h-[calc(100vh-12rem)] overflow-y-auto hide-scrollbar pr-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {singleNews.images && singleNews.images.length > 0 ? (
                singleNews.images.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={`${singleNews.title} ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-2xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  />
                ))
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                  No images available
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Content - Sticky */}
          <motion.div
            className="sticky top-4 h-fit"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {singleNews.title}
            </h1>

            <p className="text-xl text-primary font-semibold mb-8">
              {singleNews.subtitle}
            </p>

            <div className="space-y-6 mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {singleNews.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
