import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

const PrivateLessonSuccess = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  return (
    <>
      <SEO
        title={isRTL ? "تم الحجز بنجاح" : "Booking Successful"}
        description={
          isRTL
            ? "تم تأكيد حجز الدرس الخاص بنجاح. ستتلقى تفاصيل إضافية عبر البريد الإلكتروني."
            : "Your private lesson has been confirmed. You will receive details via email."
        }
      />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="relative bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 px-8 py-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-400 rounded-full blur-3xl"></div>
            </div>

            {/* Success Icon */}
            <div className="relative flex justify-center mb-6">
              <div className="relative">
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
              {t("courses.private_success_title") ||
                (isRTL ? "تم إتمام الحجز بنجاح" : "Enrollment Successful!")}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-700 text-center max-w-md mx-auto leading-relaxed">
              {t("courses.private_success_desc") ||
                (isRTL
                  ? "تم تأكيد حجز الدرس الخاص. ستتلقى تفاصيل إضافية عبر البريد الإلكتروني."
                  : "Your private lesson has been confirmed. You will receive details via email.")}
            </p>
          </div>

          {/* Info Cards */}
          <div className="px-8 py-8 bg-white">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Email Notification */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {isRTL ? "تحقق من بريدك" : "Check Email"}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {isRTL ? "تفاصيل الدرس" : "Lesson details"}
                  </p>
                </div>
              </div>

              {/* Calendar */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {isRTL ? "أضف للتقويم" : "Add to Calendar"}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {isRTL ? "لا تفوت الموعد" : "Don't miss it"}
                  </p>
                </div>
              </div>

              {/* Support */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {t("common.need_help")}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t("common.were_here")}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t("courses.back_to_courses")}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t("common.thanks_note")}
        </p>
      </div>
      </div>
    </>
  );
};

export default PrivateLessonSuccess;
