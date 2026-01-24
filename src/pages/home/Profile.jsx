import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthStore } from "../../store";
import { Card, Form, Input, Button, Divider, Upload, message } from "antd";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiBookOpen,
  FiCamera,
} from "react-icons/fi";
import SEO from "../../components/SEO";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const {
    user,
    isLoading,
    isChangingPassword,
    getUser,
    changePassword,
    updateProfileImage,
  } = useAuthStore();
  const displayName = user?.name || "";
  const avatarUrl = user?.profile_image || null;
  const email = user?.email || "";
  const phone = user?.phone_number || "";

  useEffect(() => {
    // Fetch latest user info when visiting profile
    getUser?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form] = Form.useForm();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleFinish = async (values) => {
    setSubmitError("");
    setSubmitSuccess("");
    try {
      await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        new_password_confirmation: values.confirmPassword,
      });
      setSubmitSuccess(t("profile.password_updated_success"));
      form.resetFields();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        t("profile.password_update_failed");
      setSubmitError(errorMsg);
    }
  };

  const [uploading, setUploading] = useState(false);
  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      await updateProfileImage(file);
      message.success(t("profile.image_updated"));
    } catch (e) {
      message.error(t("profile.image_upload_failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <SEO
        title={t("profile.title") || (isRTL ? "الملف الشخصي" : "My Profile")}
        description={
          isRTL
            ? "إدارة معلومات حسابك الشخصي وتغيير كلمة المرور"
            : "Manage your account information and change your password"
        }
      />
      <div className="min-h-screen bg-gray-50 px-4 md:px-20 py-20">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            {t("profile.title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("profile.description")}</p>
        </div>

        {!user ? (
          <Card className="text-center py-12">
            <div className="text-gray-500">{t("profile.loading")}</div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Profile Picture & Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="text-center pb-6 profile-avatar-card" variant="outlined">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                      {getInitials(displayName)}
                    </div>
                  )}
                  <Upload
                    accept="image/*"
                    maxCount={1}
                    showUploadList={false}
                    customRequest={({ file, onSuccess }) => {
                      handleImageUpload(file);
                      onSuccess && onSuccess("ok");
                    }}
                  >
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors border-2 border-white"
                      disabled={uploading}
                      aria-label={t("profile.upload_photo", "Change profile photo")}
                    >
                      <FiCamera size={18} />
                    </button>
                  </Upload>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {displayName}
                </h2>
                <p className="text-gray-500 mb-6 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {t("profile.active_member")}
                </p>

                {/* My Courses Button */}
                <Button
                  type="primary"
                  className="w-full bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary border-none shadow-md hover:shadow-lg"
                  icon={<FiBookOpen />}
                  onClick={() => navigate("/my-courses")}
                  size="large"
                >
                  {t("profile.my_courses")}
                </Button>
              </Card>
            </div>

            {/* Right: Information & Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="profile-info-card" variant="outlined">
                <div
                  className={`flex items-center gap-3 mb-6 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-primary" />
                  </div>
                  <h3
                    className={`text-xl font-bold text-gray-900 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("profile.personal_information")}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div
                    className={`space-y-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-sm text-gray-500 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FiMail className="w-4 h-4" />{" "}
                      {t("profile.email_address")}
                    </div>
                    <div className="text-base font-medium text-gray-900 break-all">
                      {email}
                    </div>
                  </div>
                  <div
                    className={`space-y-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-sm text-gray-500 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FiPhone className="w-4 h-4" />{" "}
                      {t("profile.phone_number")}
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {phone || t("profile.not_provided")}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Change Password */}
              <Card className="profile-password-card" variant="outlined">
                <div
                  className={`flex items-center gap-3 mb-6 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-primary" />
                  </div>
                  <h3
                    className={`text-xl font-bold text-gray-900 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("profile.change_password")}
                  </h3>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFinish}
                  className="space-y-4"
                >
                  <Form.Item
                    label={t("profile.current_password_label")}
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: t("profile.current_password_required"),
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder={t("profile.current_password_placeholder")}
                      size="large"
                      prefix={<FiLock className="text-gray-400" />}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("profile.new_password_label")}
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: t("profile.new_password_required"),
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder={t("profile.new_password_placeholder")}
                      size="large"
                      prefix={<FiLock className="text-gray-400" />}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("profile.confirm_password_label")}
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                      {
                        required: true,
                        message: t("profile.confirm_password_required"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(t("profile.passwords_not_match"))
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder={t("profile.confirm_password_placeholder")}
                      size="large"
                      prefix={<FiLock className="text-gray-400" />}
                    />
                  </Form.Item>
                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600 font-medium">
                        {submitError}
                      </p>
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-green-600 font-medium">
                        {submitSuccess}
                      </p>
                    </div>
                  )}
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    loading={isChangingPassword}
                    className="bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary border-none shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    {isChangingPassword
                      ? t("profile.updating")
                      : t("profile.update_password")}
                  </Button>
                </Form>
              </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function getInitials(name) {
  if (!name) return "U";
  const trimmedName = String(name).trim();
  return trimmedName.substring(0, 2).toUpperCase() || "U";
}

export default Profile;
