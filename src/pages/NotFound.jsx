import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl w-full"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary opacity-20">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? "الصفحة غير موجودة" : "Page Not Found"}
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            {isRTL
              ? "عذراً، الصفحة التي تبحث عنها غير موجودة."
              : "Sorry, the page you are looking for does not exist."}
          </p>
          <p className="text-sm text-gray-500">
            {isRTL
              ? "قد تكون الصفحة قد تم نقلها أو حذفها."
              : "The page may have been moved or deleted."}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>{isRTL ? "العودة للرئيسية" : "Go to Homepage"}</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{isRTL ? "العودة للخلف" : "Go Back"}</span>
          </button>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500 mb-4">
            {isRTL ? "أو يمكنك زيارة:" : "Or you can visit:"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/courses")}
              className="text-primary hover:text-primary-dark underline text-sm transition-colors"
            >
              {isRTL ? "الدورات" : "Courses"}
            </button>
            <button
              onClick={() => navigate("/programs")}
              className="text-primary hover:text-primary-dark underline text-sm transition-colors"
            >
              {isRTL ? "البرامج" : "Programs"}
            </button>
            <button
              onClick={() => navigate("/news")}
              className="text-primary hover:text-primary-dark underline text-sm transition-colors"
            >
              {isRTL ? "الأخبار" : "News"}
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-primary hover:text-primary-dark underline text-sm transition-colors"
            >
              {isRTL ? "اتصل بنا" : "Contact Us"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
