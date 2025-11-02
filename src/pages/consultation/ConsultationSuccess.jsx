import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "antd";
import { CheckCircle, Home } from "lucide-react";
import "./consultation.css";

export default function ConsultationSuccess() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-white min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Success Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center consultation-success-content">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-green-500 to-green-600 rounded-full mb-8 consultation-success-icon">
            <CheckCircle className="w-20 h-20 text-white" />
          </div>

          {/* Success Title */}
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-6">
            {t("consultation.success.title")}
          </h1>

          {/* Success Subtitle */}
          <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-text-primary mb-6">
            {t("consultation.success.subtitle")}
          </h2>

          {/* Success Message */}
          <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-12 message-box">
            <p className="text-text-secondary text-lg xl:text-xl 2xl:text-2xl leading-relaxed">
              {t("consultation.success.message")}
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 contact-info">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-text-light mb-1">Email</p>
              <p className="text-text-primary font-semibold">
                He779@hotmail.com
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <p className="text-sm text-text-light mb-1">Phone</p>
              <p className="text-text-primary font-semibold">
                +971 509 590 444
              </p>
            </div>
          </div>

          {/* Back to Home Button */}
          <Button
            type="primary"
            size="large"
            onClick={handleBackHome}
            className="bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary border-none px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            icon={<Home className="w-5 h-5" />}
          >
            {t("consultation.success.back_home")}
          </Button>
        </div>
      </section>
    </div>
  );
}
