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

  const handleBookConsultation = async (
    consultation,
    currency,
    date,
    startTime
  ) => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(
        currentLanguage === "ar"
          ? "يرجى إدخال الاسم والبريد الإلكتروني ورقم الهاتف قبل المتابعة."
          : "Please provide your name, email, and phone number before continuing."
      );
      return;
    }

    if (!date || !startTime) {
      toast.error(
        currentLanguage === "ar"
          ? "يرجى اختيار التاريخ والوقت قبل المتابعة."
          : "Please select date and time before continuing."
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
        consultation?.id,
        date,
        startTime
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

  const renderCurrencyOptions = (consultation, date, startTime) => {
    const { hasAED, hasUSD } = getAvailableCurrencies(consultation);

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
              onClick={() =>
                handleBookConsultation(consultation, "aed", date, startTime)
              }
            >
              {`${consultation.price_aed} AED`}
            </Button>
          )}
          {hasUSD && (
            <Button
              type="primary"
              block
              disabled={isLoading}
              onClick={() =>
                handleBookConsultation(consultation, "usd", date, startTime)
              }
            >
              {`${consultation.price_usd} USD`}
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
    setOpenPopoverId(null);
    setFormData({ name: "", email: "", phone: "" });
    setSelectedDate(null);
    setSelectedStartTime(null);
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
        style={{ maxWidth: "700px" }}
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
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">
              {currentLanguage === "ar" ? "بياناتك الشخصية" : "Your Details"}
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

              {/* Date and Time Selection */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium text-text-primary ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {currentLanguage === "ar"
                    ? "اختر التاريخ والوقت"
                    : "Select Date and Time"}
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <DatePicker
                      size="large"
                      className="w-full"
                      placeholder={
                        currentLanguage === "ar"
                          ? "اختر التاريخ"
                          : "Select Date"
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
                  <div className="flex-1">
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

          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">
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
              <div className="space-y-4">
                {consultationTypes.map((consultation) => {
                  const { hasAED, hasUSD } =
                    getAvailableCurrencies(consultation);
                  const priceLines = [];

                  if (hasAED) {
                    priceLines.push(
                      `${consultation.price_aed} ${
                        currentLanguage === "ar" ? "درهم" : "AED"
                      }`
                    );
                  }

                  if (hasUSD) {
                    priceLines.push(
                      `${consultation.price_usd} ${
                        currentLanguage === "ar" ? "دولار" : "USD"
                      }`
                    );
                  }

                  return (
                    <Card
                      key={consultation.id}
                      className="border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {consultation.type}
                          </h4>
                          {consultation.duration && (
                            <span className="text-sm font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                              {currentLanguage === "ar"
                                ? `المدة: ${consultation.duration} دقيقة`
                                : `Duration: ${consultation.duration} min`}
                            </span>
                          )}
                        </div>

                        <div
                          className={`${
                            isRTL ? "text-right" : "text-left"
                          } text-sm text-gray-600`}
                        >
                          {priceLines.length > 0 ? (
                            priceLines.map((line, index) => (
                              <div key={index}>{line}</div>
                            ))
                          ) : (
                            <div>
                              {currentLanguage === "ar"
                                ? "السعر غير متوفر"
                                : "Pricing not available"}
                            </div>
                          )}
                        </div>

                        <div>
                          <Popover
                            content={renderCurrencyOptions(
                              consultation,
                              selectedDate,
                              selectedStartTime
                            )}
                            trigger="click"
                            open={
                              openPopoverId === consultation.id &&
                              hasAED &&
                              hasUSD
                            }
                            onOpenChange={(open) =>
                              setOpenPopoverId(open ? consultation.id : null)
                            }
                            placement={isRTL ? "bottomRight" : "bottomLeft"}
                          >
                            <Button
                              type="primary"
                              block
                              size="large"
                              disabled={isLoading}
                              onClick={() => {
                                if (!hasAED && !hasUSD) {
                                  toast.error(
                                    currentLanguage === "ar"
                                      ? "لا تتوفر أسعار لهذه الاستشارة"
                                      : "No pricing available for this consultation"
                                  );
                                  return;
                                }

                                if (hasAED && hasUSD) {
                                  setOpenPopoverId(consultation.id);
                                } else {
                                  handleBookConsultation(
                                    consultation,
                                    hasAED ? "aed" : "usd",
                                    selectedDate,
                                    selectedStartTime
                                  );
                                }
                              }}
                              className="bg-primary hover:bg-primary-dark border-none"
                            >
                              {isLoading &&
                              openPopoverId === consultation.id ? (
                                <Spin size="small" />
                              ) : (
                                t("consultation.form.submit_button")
                              )}
                            </Button>
                          </Popover>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center mt-6">
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
        </div>
      </Modal>
    </div>
  );
}
