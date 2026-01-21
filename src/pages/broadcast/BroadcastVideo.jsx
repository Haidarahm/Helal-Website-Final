import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useBroadcastsStore } from "../../store";
import { Button, Spin, Tag } from "antd";
import { ArrowLeft, ArrowRight, Calendar, Share2 } from "lucide-react";
import SEO from "../../components/SEO";
import AOS from "aos";
import "aos/dist/aos.css";

const BroadcastVideo = () => {
  const { broadcastId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { singleBroadcast, isLoading, fetchBroadcastById } = useBroadcastsStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBroadcastById(broadcastId, i18n.language);
    AOS.init({
      duration: 800,
      easing: "ease-out-back",
      once: true,
    });
  }, [broadcastId, i18n.language, fetchBroadcastById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <Spin size="large" tip={t("broadcast.loading")} />
      </div>
    );
  }

  if (!singleBroadcast && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-accent text-center px-4">
        <h2 className="text-2xl font-bold text-secondary mb-4">{t("broadcast.no_broadcasts")}</h2>
        <Button 
          type="primary" 
          onClick={() => navigate("/broadcasts")}
          className="h-12 px-8 rounded-xl font-bold"
        >
          {isRTL ? <ArrowRight className="ml-2 w-5 h-5" /> : <ArrowLeft className="mr-2 w-5 h-5" />}
          {isRTL ? "العودة للقائمة" : "Back to Broadcasts"}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-24 px-4 md:px-10 lg:px-20" dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title={singleBroadcast?.title}
        description={singleBroadcast?.description}
        type="video.other"
      />

      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/broadcasts")}
          className="group mb-10 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm"
          data-aos="fade-right"
        >
          {isRTL ? <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /> : <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />}
          {isRTL ? "الرجوع للقائمة" : "Back to List"}
        </button>

        {/* Content Header Section - Vertical Layout */}
        <div className="mb-12 flex flex-col items-start text-start">
          <div className="flex flex-wrap items-center gap-4 mb-6" data-aos="fade-up">
            <Tag color="#f9943c" className="px-4 py-1.5 rounded-full font-bold border-none shadow-sm uppercase tracking-wider text-[10px]">
              {t("broadcast.subtitle") || "Exclusive Broadcast"}
            </Tag>
            <div className="flex items-center gap-2 text-text-light text-sm font-medium">
              <Calendar className="w-4 h-4 text-primary" />
              {singleBroadcast?.date}
            </div>
          </div>

          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary mb-8 leading-tight w-full"
            data-aos="fade-up"
          >
            {singleBroadcast?.title}
          </h1>

          <div 
            className="w-full p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-secondary/5 relative overflow-hidden mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/30"></div>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed italic">
              {singleBroadcast?.description}
            </p>
          </div>
        </div>

        {/* Full Width Video Section */}
        <div 
          className="relative w-full aspect-video md:aspect-[2/1] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-black/5"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <iframe
            src={singleBroadcast?.video_url}
            title={singleBroadcast?.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Action Footer */}
        <div className="mt-12 flex justify-between items-center py-8 border-t border-secondary/10" data-aos="fade-up">
          <div className="flex items-center gap-4">
            <span className="text-secondary/50 font-bold text-xs uppercase tracking-widest">{isRTL ? "مشاركة" : "Share"}</span>
            <button className="p-3 bg-white rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/20">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button className="group text-secondary font-bold flex items-center gap-2 hover:text-primary transition-colors">
            {isRTL ? "التالي" : "Next"}
            {isRTL ? <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastVideo;
