import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthStore } from "../../store";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Form, Input, Button } from "antd";
import "./auth.css";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { resetPassword, isLoading } = useAuthStore();
  const [form] = Form.useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const handleSubmit = async (values) => {
    try {
      await resetPassword({
        new_password: values.password,
        new_password_confirmation: values.confirmPassword,
      });
      navigate("/auth");
      form.resetFields();
    } catch (error) {
      console.error("Reset password failed:", error);
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
            <p className="text-gray-600 mb-6">{t("auth.enter_new_password")}</p>

            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="password"
                label={<span>{t("auth.password")}</span>}
                rules={[
                  { required: true, message: t("auth.placeholder_password") },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={
                    <Lock className={`auth-icon ${isRTL ? "ml-2" : "mr-2"}`} />
                  }
                  placeholder={t("auth.placeholder_password")}
                  visibilityToggle={{
                    visible: showPassword,
                    onVisibleChange: setShowPassword,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span>{t("auth.confirm_password")}</span>}
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: t("auth.placeholder_confirm_password"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={
                    <Lock className={`auth-icon ${isRTL ? "ml-2" : "mr-2"}`} />
                  }
                  placeholder={t("auth.placeholder_confirm_password")}
                  visibilityToggle={{
                    visible: showConfirmPassword,
                    onVisibleChange: setShowConfirmPassword,
                  }}
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
                  {isLoading ? t("auth.loading") : t("auth.reset_password_btn")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
