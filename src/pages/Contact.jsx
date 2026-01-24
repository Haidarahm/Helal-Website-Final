import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card, Input, Button } from "antd";
import { useContactStore } from "../store";
import SEO from "../components/SEO";

export default function Contact() {
  const { t, ready } = useTranslation();
  const { isRTL } = useLanguage();
  const { isLoading, error, successMessage, sendEmail, clearMessages } =
    useContactStore();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 700,
      easing: "ease-out-quart",
      once: true,
      offset: 0,
      delay: 0,
      disable: false,
    });
    AOS.refresh();
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
    clearMessages();

    try {
      await sendEmail(
        formData.full_name,
        formData.email,
        formData.subject,
        formData.message
      );

      // Clear form on success
      setFormData({
        full_name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Error is handled by the store
    }
  };

  // Show loading state if translations aren't ready
  if (!ready) {
    return (
      <section className="w-full bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="text-text-primary">Loading...</div>
        </div>
      </section>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("contact_page.title") || "Contact Us",
    description: t("contact_page.description") || "Get in touch with us",
    mainEntity: {
      "@type": "Organization",
      name: "Helal Al Jabri",
      email: "He779@tikit.ae",
      telephone: "+971 503 338 444",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Muscat",
        addressCountry: "Oman",
      },
    },
  };

  return (
    <div className="w-full bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title={t("contact_page.title") || "Contact Us"}
        description={
          t("contact_page.description") ||
          "Ready to start your trading journey? Contact us today and let's discuss how we can help you achieve your financial goals"
        }
        type="website"
        structuredData={structuredData}
      />
      {/* Header Section */}
      <section className="mt-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1
            className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-6"
            data-aos="fade-up"
          >
            {t("contact_page.title")}
          </h1>
          <p
            className="text-text-secondary text-lg xl:text-xl 2xl:text-2xl leading-relaxed max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t("contact_page.description")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Info Section */}
          <Card
            className="contact-info-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            variant="outlined"
          >
            <div className="p-0 md:p-8">
              <div className="flex items-center mb-6">
                <div
                  className={`w-12 h-12 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center ${
                    isRTL ? "ml-4" : "mr-4"
                  }`}
                >
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl xl:text-3xl font-bold text-primary">
                  {t("contact_page.info_title")}
                </h2>
              </div>

              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                {t("contact_page.info_description")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center ${
                      isRTL ? "ml-4" : "mr-4"
                    } shrink-0`}
                  >
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">
                      {t("contact_page.email")}
                    </p>
                    <p className="text-text-primary font-semibold">
                      He779@tikit.ae
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center ${
                      isRTL ? "ml-4" : "mr-4"
                    } shrink-0`}
                  >
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">
                      {t("contact_page.phone")}
                    </p>
                    <p className="text-text-primary font-semibold">
                      +971 509 590 444
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center ${
                      isRTL ? "ml-4" : "mr-4"
                    } shrink-0`}
                  >
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">
                      {t("contact_page.location")}
                    </p>
                    <p className="text-text-primary font-semibold">
                      Muscat, Oman
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Form Section */}
          <Card
            className="contact-form-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            variant="outlined"
          >
            <div className="p-0 md:p-8">
              <div className="flex items-center mb-6">
                <div
                  className={`w-12 h-12 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center ${
                    isRTL ? "ml-4" : "mr-4"
                  }`}
                >
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl xl:text-3xl font-bold text-primary">
                  {t("contact_page.form.title")}
                </h3>
              </div>
              <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium text-text-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.full_name")}
                  </label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    size="large"
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contact_page.form.name_placeholder")}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 font-medium text-text-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.email")}
                  </label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    size="large"
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contact_page.form.email_placeholder")}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 font-medium text-text-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.subject")}
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    size="large"
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contact_page.form.subject_placeholder")}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 font-medium text-text-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.message")}
                  </label>
                  <Input.TextArea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    size="large"
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contact_page.form.message_placeholder")}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={isLoading}
                  className="w-full h-12 rounded-xl text-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>
                      {isLoading
                        ? "Sending..."
                        : t("contact_page.form.send_button")}
                    </span>
                  </div>
                </Button>

                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="mt-4 p-4 rounded-xl bg-green-100 border border-green-300 text-green-800">
                    <p className={`${isRTL ? "text-right" : "text-left"}`}>
                      {successMessage}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-100 border border-red-300 text-red-800">
                    <p className={`${isRTL ? "text-right" : "text-left"}`}>
                      {error}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
