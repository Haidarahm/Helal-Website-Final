import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Button, Card } from "antd";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useConsultationStore, useAuthStore } from "../../store";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
} from "lucide-react";
import "./consultation.css";
export default function Consultation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const { isLoading, createConsultationCheckout } = useConsultationStore();
  const { token } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build return and cancel URLs
      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/Helal-Aljaberi/consultation-success`;
      const cancelUrl = `${baseUrl}/Helal-Aljaberi/consultation`;

      const response = await createConsultationCheckout(
        formData.name,
        formData.email,
        formData.phone,
        "usd",
        returnUrl,
        cancelUrl
      );

      // Check if response has redirect_url and redirect
      if (response?.redirect_url) {
        window.location.href = response.redirect_url;
      } else {
        toast.error(
          currentLanguage === "ar"
            ? "فشل معالجة الدفع. يرجى المحاولة مرة أخرى."
            : "Failed to process payment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating consultation checkout:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (currentLanguage === "ar"
          ? "فشل حجز الاستشارة. يرجى المحاولة مرة أخرى."
          : "Failed to book consultation. Please try again.");
      toast.error(errorMessage);
    }
  };

  const handleOpenModal = () => {
    // Check if user is authenticated
    if (!token) {
      // Redirect to signup if not authenticated
      navigate("/auth", { state: { initialForm: "signup" } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  const benefits = t("consultation.benefits", { returnObjects: true });

  return (
    <div className="w-full bg-white min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Section */}
      <section className="mt-20 px-6 md:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-primary-dark rounded-full mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-6">
              {t("consultation.title")}
            </h1>
            <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-text-primary mb-4">
              {t("consultation.subtitle")}
            </h2>
            <p className="text-text-secondary text-lg xl:text-xl 2xl:text-2xl leading-relaxed max-w-3xl mx-auto">
              {t("consultation.description")}
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center shrink-0">
                      {index === 0 && (
                        <Target className="w-6 h-6 text-primary" />
                      )}
                      {index === 1 && <User className="w-6 h-6 text-primary" />}
                      {index === 2 && (
                        <Clock className="w-6 h-6 text-primary" />
                      )}
                      {index === 3 && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className={`flex-1 ${isRTL ? "mr-4" : "ml-4"}`}>
                      <h3 className="text-xl xl:text-2xl font-bold text-primary mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-text-secondary text-base leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl xl:text-4xl font-bold text-primary mb-4">
                {currentLanguage === "ar"
                  ? "مستعد لبدء رحلتك؟"
                  : "Ready to Start Your Journey?"}
              </h3>
              <p className="text-text-secondary text-lg mb-8">
                {currentLanguage === "ar"
                  ? "احجز استشارتك الخاصة الآن واحصل على إرشاد خبير مخصص لتحقيق أهدافك المالية."
                  : "Book your private consultation now and receive personalized expert guidance to achieve your financial goals."}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleOpenModal}
                className="bg-primary hover:bg-primary-dark border-none px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("consultation.form.title")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Consultation Form */}
      <Modal
        title={
          <div className="text-center py-4">
            <h2 className="text-3xl font-bold text-primary">
              {t("consultation.form.title")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="90%"
        style={{ maxWidth: "600px" }}
        className="consultation-modal"
        styles={{
          body: {
            backgroundColor: "white",
            padding: "32px",
          },
          header: {
            backgroundColor: "white",
            borderBottom: "1px solid #f0f0f0",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                className={`block mb-2 text-sm font-medium text-text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("consultation.form.full_name")}
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                size="large"
                prefix={<User className="text-primary" />}
                className={isRTL ? "text-right" : "text-left"}
                placeholder={t("consultation.form.name_placeholder")}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                className={`block mb-2 text-sm font-medium text-text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("consultation.form.email")}
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                size="large"
                prefix={<Mail className="text-primary" />}
                className={isRTL ? "text-right" : "text-left"}
                placeholder={t("consultation.form.email_placeholder")}
                dir="ltr"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                className={`block mb-2 text-sm font-medium text-text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("consultation.form.phone")}
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                size="large"
                prefix={<Phone className="text-primary" />}
                className={isRTL ? "text-right" : "text-left"}
                placeholder={t("consultation.form.phone_placeholder")}
                dir="ltr"
              />
            </div>

            {/* Submit Button */}
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={isLoading}
              className="w-full h-14 rounded-xl text-lg font-semibold bg-primary hover:bg-primary-dark border-none"
            >
              {isLoading
                ? t("consultation.form.loading")
                : t("consultation.form.submit_button")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
