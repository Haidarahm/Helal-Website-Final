import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card, Input, Button } from "antd";
import { useContactStore } from "../../store";

export const Contact = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isLoading, error, successMessage, sendEmail, clearMessages } =
    useContactStore();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

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

  const contactItems = [
    {
      icon: Mail,
      title: t("contact.email"),
      value: "He779@hotmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      value: "+971 509 590 444",
      description: "Call us for immediate assistance",
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      value: "Muscat, Oman",
      description: "Visit our office location",
    },
  ];

  return (
    <section className="w-full bg-white pt-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-dark)] rounded-full mb-6">
            <span className="text-2xl font-bold text-white">📧</span>
          </div>
          <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[color:var(--color-primary)] mb-6">
            {t("contact.title")}
          </h2>
          <p className="text-[color:var(--color-text-secondary)] text-lg xl:text-xl 2xl:text-2xl leading-relaxed max-w-3xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group contact-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-8 pb-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[color:var(--color-primary)]/10 to-[color:var(--color-primary)]/5 rounded-2xl flex items-center justify-center group-hover:from-[color:var(--color-primary)]/20 group-hover:to-[color:var(--color-primary)]/10 transition-all duration-300">
                      <Icon className="w-8 h-8 text-[color:var(--color-primary)]" />
                    </div>
                  </div>

                  <h3 className="text-xl xl:text-2xl font-bold text-[color:var(--color-primary)] mb-3 text-center">
                    {item.title}
                  </h3>

                  <p className="text-[color:var(--color-text-primary)] font-semibold text-center mb-2 text-lg">
                    {item.value}
                  </p>

                  <p className="text-[color:var(--color-text-secondary)] text-center text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Contact Form Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <Card
            className="contact-form-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            variant="outlined"
          >
            <div className="p-0 md:p-8">
              <div className="flex items-center mb-6">
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-[color:var(--color-primary)]/10 to-[color:var(--color-primary)]/5 rounded-xl flex items-center justify-center ${
                    isRTL ? "ml-4" : "mr-4"
                  }`}
                >
                  <Send className="w-6 h-6 text-[color:var(--color-primary)]" />
                </div>
                <h3 className="text-2xl xl:text-3xl font-bold text-[color:var(--color-primary)]">
                  {t("contact_page.form.title") || "Send Us a Message"}
                </h3>
              </div>
              <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium text-[color:var(--color-text-primary)] ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.full_name") || "Full Name"}
                  </label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    size="large"
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={
                      t("contact_page.form.name_placeholder") ||
                      "Your full name"
                    }
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 font-medium text-[color:var(--color-text-primary)] ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.email") || "Email"}
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    size="large"
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={
                      t("contact_page.form.email_placeholder") ||
                      "your.email@example.com"
                    }
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 font-medium text-[color:var(--color-text-primary)] ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.subject") || "Subject"}
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    size="large"
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={
                      t("contact_page.form.subject_placeholder") ||
                      "Message subject"
                    }
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm mb-2 font-medium text-[color:var(--color-text-primary)] ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact_page.form.message") || "Message"}
                  </label>
                  <Input.TextArea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    size="large"
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    className={`mt-2 ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={
                      t("contact_page.form.message_placeholder") ||
                      "Your message"
                    }
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={isLoading}
                  className="w-full h-12 rounded-xl text-lg bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>
                      {isLoading
                        ? "Sending..."
                        : t("contact_page.form.send_button") || "Send Message"}
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

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[color:var(--color-primary)]/10 to-[color:var(--color-primary)]/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl xl:text-3xl font-bold text-[color:var(--color-primary)] mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-[color:var(--color-text-secondary)] text-lg mb-6">
              Get in touch with us today and let's discuss how we can help you
              achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-[color:var(--color-text-secondary)]">
                <span className="w-2 h-2 bg-[color:var(--color-primary)] rounded-full mr-3"></span>
                Free consultation
              </div>
              <div className="flex items-center text-[color:var(--color-text-secondary)]">
                <span className="w-2 h-2 bg-[color:var(--color-primary)] rounded-full mr-3"></span>
                Flexible scheduling
              </div>
              <div className="flex items-center text-[color:var(--color-text-secondary)]">
                <span className="w-2 h-2 bg-[color:var(--color-primary)] rounded-full mr-3"></span>
                Expert guidance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
