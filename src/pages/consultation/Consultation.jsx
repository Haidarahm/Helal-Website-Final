import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Card } from "antd";
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
import SEO from "../../components/SEO";
import ConsultationStepIndicator from "./components/ConsultationStepIndicator.jsx";
import ConsultationTypeStep from "./components/ConsultationTypeStep.jsx";
import ConsultationPersonalInfoStep from "./components/ConsultationPersonalInfoStep.jsx";
import ConsultationScheduleStep from "./components/ConsultationScheduleStep.jsx";
import ConsultationPaymentStep from "./components/ConsultationPaymentStep.jsx";
export default function Consultation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const {
    isLoading,
    isTypesLoading,
    consultationTypes,
    pagination,
    createConsultationCheckout,
    fetchConsultationTypes,
  } = useConsultationStore();
  const { token, user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchConsultationTypes(currentLanguage, currentPage, 4);
    }
  }, [isModalOpen, currentLanguage, currentPage, fetchConsultationTypes]);

  useEffect(() => {
    if (!isModalOpen || !user) return;

    setFormData((prev) => ({
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
    }));
  }, [isModalOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookConsultation = async (currency) => {
    if (!selectedConsultation) {
      toast.error(t("consultation.errors.select_consultation"));
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(t("consultation.errors.fill_personal_info"));
      return;
    }

    if (!selectedDate || !selectedStartTime) {
      toast.error(t("consultation.errors.select_date_time"));
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/consultation-success`;
      const cancelUrl = `${baseUrl}/consultation`;

      const response = await createConsultationCheckout(
        formData.name,
        formData.email,
        formData.phone,
        currency,
        returnUrl,
        cancelUrl,
        selectedConsultation?.id,
        selectedDate,
        selectedStartTime
      );

      // Handle new response structure with nested data
      const redirectUrl =
        response?.data?.redirect_url || response?.redirect_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error(t("consultation.errors.payment_failed"));
      }
    } catch (error) {
      console.error("Error creating consultation checkout:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t("consultation.errors.booking_failed");
      toast.error(errorMessage);
    }
  };

  const getAvailableCurrencies = (consultation) => {
    const hasAED =
      consultation?.price_aed &&
      !Number.isNaN(parseFloat(consultation.price_aed)) &&
      parseFloat(consultation.price_aed) > 0;
    const hasUSD =
      consultation?.price_usd &&
      !Number.isNaN(parseFloat(consultation.price_usd)) &&
      parseFloat(consultation.price_usd) > 0;

    return { hasAED, hasUSD };
  };

  const handleOpenModal = () => {
    if (!token) {
      navigate("/auth", { state: { initialForm: "signup" } });
      return;
    }
    setCurrentPage(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStep(0);
    setSelectedConsultation(null);
    setFormData({ name: "", email: "", phone: "" });
    setSelectedDate(null);
    setSelectedStartTime(null);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Step 1: Validate consultation selection
      if (!selectedConsultation) {
        toast.error(t("consultation.errors.select_consultation"));
        return;
      }
    } else if (currentStep === 1) {
      // Step 2: Validate personal information
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error(t("consultation.errors.fill_personal_info"));
        return;
      }
    } else if (currentStep === 2) {
      // Step 3: Validate date and time
      if (!selectedDate || !selectedStartTime) {
        toast.error(t("consultation.errors.select_date_time"));
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const benefits = t("consultation.benefits", { returnObjects: true }) || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isRTL ? "استشارات مالية واستثمارية" : "Financial & Investment Consultation",
    description: isRTL
      ? "احصل على استشارة شخصية مع هلال الجابري في مجال التداول والاستثمار"
      : "Get personalized consultation with Helal Al Jabri in trading and investment",
    provider: {
      "@type": "Person",
      name: "Helal Al Jabri",
    },
    serviceType: "Consultation",
    areaServed: "Worldwide",
  };

  return (
    <>
      <SEO
        title={t("consultation.title") || (isRTL ? "الاستشارات" : "Consultation")}
        description={
          isRTL
            ? "احصل على استشارة شخصية مع هلال الجابري في مجال التداول والاستثمار والتطوير الذاتي"
            : "Get personalized consultation with Helal Al Jabri in trading, investment, and personal development"
        }
        structuredData={structuredData}
      />
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
                {t("consultation.cta.title")}
              </h3>
              <p className="text-text-secondary text-lg mb-8">
                {t("consultation.cta.description")}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleOpenModal}
                className="bg-primary  hover:bg-primary-dark border-none px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
        style={{ maxWidth: "800px" }}
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
        <ConsultationStepIndicator current={currentStep} />

        <div className="min-h-[300px]">
          {currentStep === 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">
                {t("consultation.step_content.select_consultation_type")}
              </h3>
              <ConsultationTypeStep
                consultationTypes={consultationTypes}
                selectedConsultation={selectedConsultation}
                onSelect={setSelectedConsultation}
                isTypesLoading={isTypesLoading}
                pagination={pagination}
                onPageChange={handlePaginationChange}
                getAvailableCurrencies={getAvailableCurrencies}
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <h3
                className="text-xl font-semibold text-primary mb-6"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("consultation.step_content.your_personal_info")}
              </h3>
              <ConsultationPersonalInfoStep
                formData={formData}
                onChange={handleInputChange}
                t={t}
                isRTL={isRTL}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <h3
                className="text-xl font-semibold text-primary mb-6"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("consultation.step_content.select_date_time")}
              </h3>
              <ConsultationScheduleStep
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedStartTime={selectedStartTime}
                onTimeChange={setSelectedStartTime}
                isRTL={isRTL}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3
                className="text-xl font-semibold text-primary mb-6"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("consultation.step_content.select_payment")}
              </h3>
              <ConsultationPaymentStep
                selectedConsultation={selectedConsultation}
                selectedDate={selectedDate}
                selectedStartTime={selectedStartTime}
                getAvailableCurrencies={getAvailableCurrencies}
                onPay={handleBookConsultation}
                isLoading={isLoading}
                isRTL={isRTL}
              />
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 ">
          <Button
            onClick={currentStep === 0 ? handleCloseModal : handlePrev}
            size="large"
          >
            {currentStep === 0
              ? t("consultation.buttons.cancel")
              : t("consultation.buttons.previous")}
          </Button>
          {currentStep < 3 && (
            <Button
              type="primary"
              onClick={handleNext}
              size="large"
              className="hover:opacity-95 active:opacity-90 transition-all duration-200"
            >
              {t("consultation.buttons.next")}
            </Button>
          )}
        </div>
      </Modal>
    </div>
    </>
  );
}
