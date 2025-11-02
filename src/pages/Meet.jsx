import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Video } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Meet() {
  const { url } = useParams();
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [url]);

  // Construct Jitsi Meet URL from route parameter
  const jitsiMeetUrl = url ? `https://meet.jit.si/${url}` : "";

  return (
    <div className="w-full px-4 md:px-6  lg:px-8 py-6 md:py-8 flex items-center justify-center">
      <div className="w-full max-w-7xl  mt-12 bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="w-full bg-secondary text-accent px-4 md:px-6 py-3 md:py-4 border-b border-secondary-light flex items-center justify-between shrink-0">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="flex items-center gap-2">
              <Video size={18} className="text-primary" />
              <h1
                className={`text-sm md:text-base font-semibold ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                Meeting: {url || "Loading..."}
              </h1>
            </div>
          </div>
        </header>

        {/* Main Container - Jitsi Meet iframe */}
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden">
          {jitsiMeetUrl ? (
            <iframe
              src={jitsiMeetUrl}
              allow="camera; microphone; fullscreen; speaker; display-capture"
              className="w-full h-full border-0"
              title="Jitsi Meet Video Conference"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-accent px-4">
                <Video size={64} className="mx-auto mb-4 text-primary" />
                <p className="text-lg">Invalid meeting URL</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
