import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Input,
  Button,
  Card,
  Popover,
  Pagination,
  Space,
  Spin,
  Empty,
  DatePicker,
  TimePicker,
  Steps,
} from "antd";
import dayjs from "dayjs";
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
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchConsultationTypes(currentLanguage, currentPage, 5);
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
      toast.error(
        currentLanguage === "ar"
          ? "يرجى اختيار نوع الاستشارة"
          : "Please select a consultation type"
      );
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(
        currentLanguage === "ar"
          ? "يرجى إدخال جميع البيانات الشخصية"
          : "Please fill in all personal information"
      );
      return;
    }

    if (!selectedDate || !selectedStartTime) {
      toast.error(
        currentLanguage === "ar"
          ? "يرجى اختيار التاريخ والوقت"
          : "Please select date and time"
      );
      return;
    }

    try {
      setOpenPopoverId(null);

      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/Helal-Aljaberi/consultation-success`;
      const cancelUrl = `${baseUrl}/Helal-Aljaberi/consultation`;

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

  const renderCurrencyOptions = () => {
    const { hasAED, hasUSD } = getAvailableCurrencies(selectedConsultation);

    return (
      <div className="p-2">
        <div className="mb-2 text-sm font-semibold text-gray-700">
          {currentLanguage === "ar"
            ? "اختر العملة للمتابعة"
            : "Select a currency to continue"}
        </div>
        <Space direction="vertical" className="w-full" size="small">
          {hasAED && (
            <Button
              type="primary"
              block
              disabled={isLoading}
              onClick={() => handleBookConsultation("AED")}
            >
              {`${selectedConsultation.price_aed} AED`}
            </Button>
          )}
          {hasUSD && (
            <Button
              type="primary"
              block
              disabled={isLoading}
              onClick={() => handleBookConsultation("USD")}
            >
              {`${selectedConsultation.price_usd} USD`}
            </Button>
          )}
        </Space>
      </div>
    );
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
    setOpenPopoverId(null);
    setFormData({ name: "", email: "", phone: "" });
    setSelectedDate(null);
    setSelectedStartTime(null);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Step 1: Validate consultation selection
      if (!selectedConsultation) {
        toast.error(
          currentLanguage === "ar"
            ? "يرجى اختيار نوع الاستشارة"
            : "Please select a consultation type"
        );
        return;
      }
    } else if (currentStep === 1) {
      // Step 2: Validate personal information
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error(
          currentLanguage === "ar"
            ? "يرجى إدخال جميع البيانات الشخصية"
            : "Please fill in all personal information"
        );
        return;
      }
    } else if (currentStep === 2) {
      // Step 3: Validate date and time
      if (!selectedDate || !selectedStartTime) {
        toast.error(
          currentLanguage === "ar"
            ? "يرجى اختيار التاريخ والوقت"
            : "Please select date and time"
        );
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePaginationChange = (page) => {
    setOpenPopoverId(null);
    setCurrentPage(page);
  };

  const benefits = t("consultation.benefits", { returnObjects: true }) || [];

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
        <Steps
          current={currentStep}
          items={[
            {
              title:
                currentLanguage === "ar"
                  ? "نوع الاستشارة"
                  : "Consultation Type",
            },
            {
              title:
                currentLanguage === "ar" ? "البيانات الشخصية" : "Personal Info",
            },
            {
              title:
                currentLanguage === "ar" ? "التاريخ والوقت" : "Date & Time",
            },
            {
              title: currentLanguage === "ar" ? "الدفع" : "Payment",
            },
          ]}
          className="mb-8 modern-stepper"
        />

        <div className="min-h-[300px]">
          {/* Step 1: Select Consultation Type */}
          {currentStep === 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">
                {currentLanguage === "ar"
                  ? "اختر نوع الاستشارة"
                  : "Select a consultation type"}
              </h3>
              {isTypesLoading ? (
                <div className="flex justify-center py-12">
                  <Spin size="large" />
                </div>
              ) : consultationTypes.length === 0 ? (
                <Empty
                  description={
                    currentLanguage === "ar"
                      ? "لا توجد استشارات متاحة حالياً"
                      : "No consultations available right now"
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultationTypes.map((consultation) => {
                    const { hasAED, hasUSD } =
                      getAvailableCurrencies(consultation);

                    const isSelected =
                      selectedConsultation?.id === consultation.id;

                    // Get the price to display
                    const price = hasAED
                      ? consultation.price_aed
                      : hasUSD
                      ? consultation.price_usd
                      : null;
                    const currency = hasAED ? "AED" : hasUSD ? "USD" : null;

                    return (
                      <div
                        key={consultation.id}
                        className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "bg-linear-to-br from-primary/10 to-primary/5 border-2 border-primary shadow-lg scale-[1.02]"
                            : "bg-white border border-gray-200 hover:border-primary/40 hover:shadow-md"
                        }`}
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Title */}
                          <h4 className="text-lg font-bold text-gray-900 pr-8">
                            {consultation.type}
                          </h4>

                          {/* Duration Badge */}
                          {consultation.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {consultation.duration}{" "}
                                {currentLanguage === "ar" ? "دقيقة" : "min"}
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          {price && currency ? (
                            <div className="pt-2 border-t border-gray-100">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">
                                  {price}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {currency}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-gray-100">
                              <span className="text-sm text-gray-500">
                                {currentLanguage === "ar"
                                  ? "السعر غير متوفر"
                                  : "Pricing not available"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={pagination.current_page}
                    total={pagination.total}
                    pageSize={pagination.per_page}
                    onChange={handlePaginationChange}
                    showSizeChanger={false}
                    disabled={isTypesLoading}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-6">
                {currentLanguage === "ar"
                  ? "بياناتك الشخصية"
                  : "Your Personal Information"}
              </h3>
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
              </div>
            </div>
          )}

          {/* Step 3: Date and Time Selection */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-6">
                {currentLanguage === "ar"
                  ? "اختر التاريخ والوقت"
                  : "Select Date and Time"}
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium text-text-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {currentLanguage === "ar" ? "التاريخ" : "Date"}
                  </label>
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder={
                      currentLanguage === "ar" ? "اختر التاريخ" : "Select Date"
                    }
                    format="DD-MM-YYYY"
                    value={
                      selectedDate ? dayjs(selectedDate, "DD-MM-YYYY") : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = date.format("DD-MM-YYYY");
                        setSelectedDate(formattedDate);
                      } else {
                        setSelectedDate(null);
                      }
                    }}
                    disabledDate={(current) => {
                      // Disable past dates
                      return current && current < dayjs().startOf("day");
                    }}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm font-medium text-text-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {currentLanguage === "ar" ? "الوقت" : "Time"}
                  </label>
                  <TimePicker
                    size="large"
                    className="w-full"
                    placeholder={
                      currentLanguage === "ar" ? "اختر الوقت" : "Select Time"
                    }
                    format="HH:mm"
                    value={
                      selectedStartTime
                        ? dayjs(selectedStartTime, "HH:mm")
                        : null
                    }
                    onChange={(time) => {
                      if (time) {
                        const formattedTime = time.format("HH:mm");
                        setSelectedStartTime(formattedTime);
                      } else {
                        setSelectedStartTime(null);
                      }
                    }}
                    minuteStep={30}
                    hourStep={1}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 3 && selectedConsultation && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-6">
                {currentLanguage === "ar"
                  ? "اختر طريقة الدفع"
                  : "Select Payment"}
              </h3>
              <div className="space-y-4">
                <Card className="border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedConsultation.type}
                      </h4>
                      {selectedConsultation.duration && (
                        <p className="text-sm text-gray-600">
                          {currentLanguage === "ar"
                            ? `المدة: ${selectedConsultation.duration} دقيقة`
                            : `Duration: ${selectedConsultation.duration} minutes`}
                        </p>
                      )}
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {currentLanguage === "ar"
                          ? "التاريخ والوقت:"
                          : "Date & Time:"}
                      </p>
                      <p className="font-medium">
                        {selectedDate}{" "}
                        {selectedStartTime && `at ${selectedStartTime}`}
                      </p>
                    </div>
                  </div>
                </Card>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    {currentLanguage === "ar"
                      ? "اختر العملة للدفع"
                      : "Select payment currency"}
                  </p>
                  {(() => {
                    const { hasAED, hasUSD } =
                      getAvailableCurrencies(selectedConsultation);

                    if (hasAED && hasUSD) {
                      return (
                        <Space
                          direction="vertical"
                          className="w-full"
                          size="middle"
                        >
                          <Button
                            type="primary"
                            block
                            size="large"
                            disabled={isLoading}
                            onClick={() => handleBookConsultation("AED")}
                            className="bg-primary hover:bg-primary-dark"
                          >
                            {`${selectedConsultation.price_aed} AED`}
                          </Button>
                          <Button
                            type="primary"
                            block
                            size="large"
                            disabled={isLoading}
                            onClick={() => handleBookConsultation("USD")}
                            className="bg-primary hover:bg-primary-dark"
                          >
                            {`${selectedConsultation.price_usd} USD`}
                          </Button>
                        </Space>
                      );
                    } else if (hasAED) {
                      return (
                        <Button
                          type="primary"
                          block
                          size="large"
                          disabled={isLoading}
                          onClick={() => handleBookConsultation("AED")}
                          className="bg-primary hover:bg-primary-dark"
                        >
                          {`${selectedConsultation.price_aed} AED`}
                        </Button>
                      );
                    } else if (hasUSD) {
                      return (
                        <Button
                          type="primary"
                          block
                          size="large"
                          disabled={isLoading}
                          onClick={() => handleBookConsultation("USD")}
                          className="bg-primary hover:bg-primary-dark"
                        >
                          {`${selectedConsultation.price_usd} USD`}
                        </Button>
                      );
                    } else {
                      return (
                        <div className="text-center text-gray-500 py-4">
                          {currentLanguage === "ar"
                            ? "لا تتوفر أسعار لهذه الاستشارة"
                            : "No pricing available for this consultation"}
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 ">
          <Button
            onClick={currentStep === 0 ? handleCloseModal : handlePrev}
            size="large"
          >
            {currentStep === 0
              ? currentLanguage === "ar"
                ? "إلغاء"
                : "Cancel"
              : currentLanguage === "ar"
              ? "السابق"
              : "Previous"}
          </Button>
          {currentStep < 3 && (
            <Button type="primary" onClick={handleNext} size="large">
              {currentLanguage === "ar" ? "التالي" : "Next"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}
