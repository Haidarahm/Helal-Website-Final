import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "antd";
import { CheckCircle, BookOpen, Home } from "lucide-react";
import "./courses.css";

export default function CourseSuccess() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackCourses = () => {
    navigate("/my-courses");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-white min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Success Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center course-success-content">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-green-500 to-green-600 rounded-full mb-8 course-success-icon">
            <CheckCircle className="w-20 h-20 text-white" />
          </div>

          {/* Success Title */}
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-6">
            {t("courses.success.title")}
          </h1>

          {/* Success Subtitle */}
          <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-text-primary mb-6">
            {t("courses.success.subtitle")}
          </h2>

          {/* Success Message */}
          <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-12 message-box">
            <p className="text-text-secondary text-lg xl:text-xl 2xl:text-2xl leading-relaxed">
              {t("courses.success.message")}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12 shadow-md contact-info">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl xl:text-2xl font-bold text-primary mb-4">
              {isRTL ? "ماذا بعد؟" : "What's Next?"}
            </h3>
            <ul
              className={`text-left ${
                isRTL ? "text-right" : "text-left"
              } space-y-3`}
            >
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 shrink-0"></span>
                <span className="text-text-secondary">
                  {isRTL
                    ? "تحقق من بريدك الإلكتروني للحصول على رابط الوصول إلى الدورة"
                    : "Check your email for course access link"}
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 shrink-0"></span>
                <span className="text-text-secondary">
                  {isRTL
                    ? "ابدأ بالتعلم من المواد التدريبية المتاحة"
                    : "Start learning from available course materials"}
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 shrink-0"></span>
                <span className="text-text-secondary">
                  {isRTL
                    ? "تابع التقدم وأكمل الوحدات حسب وتيرة الخاصة بك"
                    : "Track progress and complete modules at your own pace"}
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="primary"
              size="large"
              onClick={handleBackCourses}
              className="bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary border-none px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              icon={<BookOpen className="w-5 h-5" />}
            >
              {t("courses.success.back_courses")}
            </Button>
            <Button
              size="large"
              onClick={handleBackHome}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              icon={<Home className="w-5 h-5" />}
            >
              {t("courses.success.back_home")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
