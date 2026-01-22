import { useEffect, useState, useRef, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useBroadcastsStore } from "../../store";
import { Link } from "react-router-dom";
import { Card, Empty, Spin } from "antd";
import SEO from "../../components/SEO";

const Broadcasts = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { broadcasts, isLoading, pagination, fetchBroadcasts } = useBroadcastsStore();
  const [page, setPage] = useState(1);
  const observer = useRef();

  // Reset and load first page on language change
  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    fetchBroadcasts(i18n.language, 1, 6);
    AOS.init({
      duration: 700,
      easing: "ease-out-quart",
      once: true,
    });
  }, [i18n.language, fetchBroadcasts]);

  // Load next page when page state changes (not on initial mount as handled above)
  useEffect(() => {
    if (page > 1) {
      fetchBroadcasts(i18n.language, page, 6);
    }
  }, [page, i18n.language, fetchBroadcasts]);

  // Infinite Scroll Callback
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination && pagination.current_page < pagination.last_page) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, pagination]
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Series",
    "name": t("broadcast.page_title") || "Broadcasts",
    "description": t("broadcast.page_description") || "Watch and listen to our latest educational content and market insights."
  };

  return (
    <div
      className="min-h-screen bg-accent py-24 px-4 md:px-10 "
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO
        title={t("broadcast.page_title") || "Broadcasts"}
        description={t("broadcast.page_description") || "Watch and listen to our latest educational content and market insights."}
        type="website"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-primary mb-6 leading-tight">
            {t("broadcast.page_title") || "Broadcasts"}
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t("broadcast.page_description") || "Discover a wealth of knowledge and insights through our exclusive broadcasts. Join thousands of listeners who are transforming their financial future."}
          </p>
          <div className="mt-10 flex justify-center">
            <div className="h-1.5 w-24 bg-primary rounded-full shadow-sm shadow-primary/20"></div>
          </div>
        </div>

        {/* Content List - Alternating Horizontal Layout */}
        <div className="space-y-16 md:space-y-24">
          {broadcasts.length > 0 ? (
            broadcasts.map((item, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === broadcasts.length - 1;
              
              return (
                <div
                  key={item.id}
                  ref={isLast ? lastElementRef : null}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-10 md:gap-12 lg:gap-20 items-center`}
                  data-aos={isEven ? "fade-right" : "fade-left"}
                >
                  {/* Image Section - Wider */}
                  <div className="w-full md:w-[70%] group">
                    <div className="relative aspect-video md:aspect-16/10 overflow-hidden rounded-3xl shadow-xl shadow-black/5 ring-1 ring-black/5 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10">
                      <img
                        alt={item.title}
                        src={item.cover}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-secondary uppercase tracking-widest shadow-lg">
                        {new Date(item.created_at).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US")}
                      </div>
                    </div>
                  </div>

                  {/* Text Section - Narrower */}
                  <div className="w-full md:w-[30%] flex flex-col items-start text-start">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="h-0.5 w-8 bg-primary/60 rounded-full"></span>
                      <span className="text-primary font-bold text-sm tracking-widest uppercase">
                        {t("broadcast.subtitle") || "Exclusive"}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-secondary mb-5 leading-snug group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h2>
                    
                    <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                      {item.description}
                    </p>
                    
                    <Link 
                      to={`/broadcast/${item.id}`}
                      className="relative group/btn px-8 py-3.5 bg-secondary text-accent font-bold rounded-2xl hover:bg-primary transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-primary/30 flex items-center gap-3 overflow-hidden"
                    >
                      <span className="relative z-10">{t("broadcast.watch") || "Watch"}</span>
                      <span className="relative z-10 text-xl transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
                        {isRTL ? "←" : "→"}
                      </span>
                      <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            !isLoading && (
              <div className="py-20 flex justify-center" data-aos="fade-up">
                <Empty description={t("broadcast.no_broadcasts") || "No broadcasts found"} />
              </div>
            )
          )}
        </div>

        {/* Loading Indicator at Bottom */}
        {isLoading && (
          <div className="mt-20 flex flex-col items-center gap-4 py-10" data-aos="fade-up">
            <Spin size="large" />
            <span className="text-sm font-medium text-text-light tracking-widest uppercase animate-pulse">
              {t("broadcast.loading") || "Loading More..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Broadcasts;
