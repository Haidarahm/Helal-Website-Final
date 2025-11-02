import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthStore } from "../../store";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "./auth.css";

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialForm = location.state?.initialForm || "signup";
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Auth store
  const { register, login, isLoading, isAuthenticated } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(initialForm === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update form when navigating between sign in and sign up
  useEffect(() => {
    if (location.state?.initialForm === "signin") {
      setIsSignUp(false);
    } else if (location.state?.initialForm === "signup") {
      setIsSignUp(true);
    }
  }, [location.state]);

  // Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Navigate to home page after successful auth
    }
  }, [isAuthenticated, navigate]);

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignUpChange = (field, value) => {
    setSignUpData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignInChange = (field, value) => {
    setSignInData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        name: signUpData.name,
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
        password_confirmation: signUpData.confirmPassword,
      });
      // Success handled by useEffect that watches isAuthenticated
    } catch (error) {
      console.error("Registration failed:", error);
      // Error is stored in the store and can be displayed
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: signInData.email,
        password: signInData.password,
      });
      // Success handled by useEffect that watches isAuthenticated
    } catch (error) {
      console.error("Login failed:", error);
      // Error is stored in the store and can be displayed
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center px-4 py-12 auth-container"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center gap-2"
        >
          <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
          <span>{t("auth.back")}</span>
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                isSignUp
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {t("auth.sign_up")}
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                !isSignUp
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {t("auth.sign_in")}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {isSignUp ? (
              /* Sign Up Form */
              <form onSubmit={handleSignUpSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {t("auth.create_account")}
                </h2>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.full_name")}
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type="text"
                      value={signUpData.name}
                      onChange={(e) =>
                        handleSignUpChange("name", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      }`}
                      placeholder={t("auth.placeholder_name")}
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.email_address")}
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) =>
                        handleSignUpChange("email", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      }`}
                      placeholder={t("auth.placeholder_email")}
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.phone_number")}
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type="tel"
                      value={signUpData.phone}
                      onChange={(e) =>
                        handleSignUpChange("phone", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      }`}
                      placeholder={t("auth.placeholder_phone")}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signUpData.password}
                      onChange={(e) =>
                        handleSignUpChange("password", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
                      }`}
                      placeholder={t("auth.placeholder_password")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                        isRTL ? "left-3" : "right-3"
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.confirm_password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        handleSignUpChange("confirmPassword", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
                      }`}
                      placeholder={t("auth.placeholder_confirm_password")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                        isRTL ? "left-3" : "right-3"
                      }`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-primary-dark"
                  }`}
                >
                  {isLoading
                    ? t("auth.loading") || "Loading..."
                    : t("auth.sign_up")}
                </button>
              </form>
            ) : (
              /* Sign In Form */
              <form onSubmit={handleSignInSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {t("auth.welcome_back")}
                </h2>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.email_address")}
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) =>
                        handleSignInChange("email", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      }`}
                      placeholder={t("auth.placeholder_email")}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signInData.password}
                      onChange={(e) =>
                        handleSignInChange("password", e.target.value)
                      }
                      className={`w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
                      }`}
                      placeholder={t("auth.placeholder_password")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                        isRTL ? "left-3" : "right-3"
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/otp-email")}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("auth.forgot_password")}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-primary-dark"
                  }`}
                >
                  {isLoading
                    ? t("auth.loading") || "Loading..."
                    : t("auth.sign_in")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
