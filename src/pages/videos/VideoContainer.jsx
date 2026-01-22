import { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useVideosStore } from "../../store";
import SEO from "../../components/SEO";

function getYouTubeEmbedUrl(input) {
  if (!input) return null;
  try {
    const url = new URL(input);
    const host = url.hostname.replace("www.", "");

    // Already an embed URL
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname.startsWith("/embed/")) {
        return `${url.origin}${url.pathname}?rel=0&modestbranding=1&playsinline=1`;
      }
      // Watch URL
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
      }
      // Shorts URL
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/")[2];
        if (id)
          return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
      }
    }

    // youtu.be short link
    if (host === "youtu.be") {
      const id = url.pathname.replace("/", "");
      if (id)
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    }
  } catch {
    // Not a URL; maybe it's a raw ID
    const maybeId = String(input).trim();
    if (maybeId) {
      return `https://www.youtube.com/embed/${maybeId}?rel=0&modestbranding=1&playsinline=1`;
    }
  }
  return null;
}

export const VideoContainer = () => {
  const { videoId, id: courseId } = useParams();
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { currentVideo, isLoading, fetchVideo } = useVideosStore();

  useEffect(() => {
    if (videoId) {
      window.scrollTo(0, 0);
      fetchVideo(videoId, i18n.language);
    }
  }, [videoId, i18n.language, fetchVideo]);

  // Prevent right-click and context menu on video
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("contextmenu", handleContextMenu);
      return () => video.removeEventListener("contextmenu", handleContextMenu);
    }
  }, [currentVideo]);

  // Determine video source
  const videoUrl = currentVideo?.youtube_path || currentVideo?.path;
  const youTubeEmbedUrl = currentVideo?.youtube_path
    ? getYouTubeEmbedUrl(currentVideo.youtube_path)
    : null;

  return (
    <>
      <SEO
        title={currentVideo?.title || (isRTL ? "مشاهدة الفيديو" : "Watch Video")}
        description={
          currentVideo?.description ||
          (isRTL
            ? "شاهد فيديو تدريبي في التداول والاستثمار"
            : "Watch a training video in trading and investment")
        }
        image={currentVideo?.cover}
        type="video.other"
      />
      <div
        className="min-h-screen bg-white pt-20 pb-8 md:pt-24 md:pb-12 lg:py-20 px-4 md:px-8 lg:px-20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto">
          {/* Back to My Courses */}
        <div className="mb-4 md:mb-6 flex justify-start">
          <button
            type="button"
            onClick={() => navigate("/my-courses")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            aria-label={t("nav.menu.my_courses")}
          >
            {isRTL ? "العودة إلى دوراتي" : "Back to My Courses"}
          </button>
        </div>
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-40">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-text-secondary">{t("courses.loading")}</p>
            </div>
          </div>
        )}

        {/* Video Container with Sidebar */}
        {!isLoading && currentVideo && (
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Video Section */}
            <div className="relative bg-black rounded-lg md:rounded-xl overflow-hidden shadow-xl md:shadow-2xl w-full lg:flex-1 order-2 lg:order-1">
              {/* YouTube Video */}
              {youTubeEmbedUrl ? (
                <div className="w-full aspect-video">
                  <iframe
                    src={youTubeEmbedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                </div>
              ) : (
                /* Regular Video Player */
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full aspect-video object-cover"
                  controls
                  controlsList="nodownload"
                />
              )}

              {/* Protection Overlay */}
              <div className="absolute inset-0 pointer-events-none" />
            </div>

            {/* Sidebar */}
            <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-lg w-full lg:w-80 xl:w-96 order-1 lg:order-2">
              <div className="p-4 md:p-6">
                {/* Header */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                  {isRTL ? "تفاصيل الفيديو" : "Video Details"}
                </h3>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                  {currentVideo.title}
                </h2>

                {/* Subtitle */}
                {currentVideo.subTitle && (
                  <p className="text-primary font-semibold mb-3 md:mb-4 text-sm md:text-base">
                    {currentVideo.subTitle}
                  </p>
                )}

                {/* Description */}
                <div className="border-t border-gray-200 pt-3 md:pt-4">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    {isRTL ? "الوصف" : "Description"}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {currentVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !currentVideo && (
          <div className="text-center py-40">
            <p className="text-gray-500 text-lg">Video not found</p>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default VideoContainer;
