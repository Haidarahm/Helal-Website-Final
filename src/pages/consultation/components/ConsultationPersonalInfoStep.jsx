import { Input } from "antd";
import { User, Mail, Phone } from "lucide-react";

const ConsultationPersonalInfoStep = ({ formData, onChange, t, isRTL }) => {
  return (
    <div className="space-y-6">
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
          onChange={onChange}
          required
          size="large"
          prefix={<User className="text-primary" />}
          className={isRTL ? "text-right" : "text-left"}
          placeholder={t("consultation.form.name_placeholder")}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

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
          onChange={onChange}
          required
          size="large"
          prefix={<Mail className="text-primary" />}
          className={isRTL ? "text-right" : "text-left"}
          placeholder={t("consultation.form.email_placeholder")}
          dir="ltr"
        />
      </div>

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
          onChange={onChange}
          required
          size="large"
          prefix={<Phone className="text-primary" />}
          className={isRTL ? "text-right" : "text-left"}
          placeholder={t("consultation.form.phone_placeholder")}
          dir="ltr"
        />
      </div>
    </div>
  );
};

export default ConsultationPersonalInfoStep;
