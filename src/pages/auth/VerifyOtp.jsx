import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthStore } from "../../store";
import { ArrowLeft } from "lucide-react";
import { Form, Input, Button } from "antd";
import "./auth.css";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { verifyOTP, isLoading } = useAuthStore();
  const [form] = Form.useForm();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.blur();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      form.setFields([{ name: "otp", errors: ["Please enter 6-digit OTP"] }]);
      return;
    }

    try {
      await verifyOTP({ otp: otpCode });
      navigate("/reset-password", { state: { email, otp: otpCode } });
    } catch (error) {
      console.error("Verify OTP failed:", error);
    }
  };

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
            <h2 className="auth-section-title">{t("auth.verify_otp")}</h2>
            <p className="text-gray-600 mb-6">{t("auth.enter_otp_code")}</p>

            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item name="otp" className="mb-4">
                <div
                  className="flex gap-2 justify-center"
                  dir={isRTL ? "ltr" : "rtl"}
                >
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      maxLength={1}
                      className="otp-input"
                    />
                  ))}
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  size="large"
                  block
                  loading={isLoading}
                  className="custom-auth-btn"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                  }}
                >
                  {isLoading ? t("auth.loading") : t("auth.verify")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
