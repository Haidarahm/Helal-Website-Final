import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthStore } from "../../store";
import { Mail, ArrowLeft } from "lucide-react";
import { Form, Input, Button } from "antd";
import "./auth.css";

export const OtpEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { sendOTP, isLoading } = useAuthStore();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await sendOTP({ email: values.email });
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (error) {
      console.error("Send OTP failed:", error);
    }
  };

  return (
    <div
      className="auth-page flex items-center justify-center px-4 py-12 auth-container"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="auth-back-btn mb-6 px-4 py-2 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
          <span>{t("auth.back")}</span>
        </button>

        {/* Form Container */}
        <div className="auth-card overflow-hidden">
          <div className="p-8">
            <h2 className="auth-section-title">{t("auth.reset_password")}</h2>
            <p className="text-gray-600 mb-6">
              {t("auth.enter_email_to_reset")}
            </p>

            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="email"
                label={<span>{t("auth.email_address")}</span>}
                rules={[
                  { required: true, message: t("auth.placeholder_email") },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={
                    <Mail className={`auth-icon ${isRTL ? "ml-2" : "mr-2"}`} />
                  }
                  placeholder={t("auth.placeholder_email")}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading}
                  className="custom-auth-btn"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                  }}
                >
                  {isLoading ? t("auth.loading") : t("auth.send_otp")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
