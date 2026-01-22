import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Video } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";

export default function Meet() {
  const { url } = useParams();
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [url]);

  // Construct Jitsi Meet URL from route parameter
  const jitsiMeetUrl = url ? `https://meet.jit.si/${url}` : "";

  return (
    <>
      <SEO
        title={isRTL ? "اجتماع فيديو" : "Video Meeting"}
        description={
          isRTL
            ? "انضم إلى اجتماع الفيديو مع هلال الجابري"
            : "Join a video meeting with Helal Al Jabri"
        }
      />
      <div className="w-full px-4 md:px-6  lg:px-8 py-6 md:py-8 flex items-center justify-center">
      <div className="w-full mt-12 rounded-2xl  h-[400px] md:h-[500px] 2xl:h-[600px]  relative overflow-hidden">
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
    </>
  );
}
