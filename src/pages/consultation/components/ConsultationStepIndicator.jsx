import { Steps } from "antd";
import { useTranslation } from "react-i18next";

const ConsultationStepIndicator = ({ current }) => {
  const { t } = useTranslation();

  const items = [
    {
      title: t("consultation.steps.consultation_type"),
    },
    {
      title: t("consultation.steps.personal_info"),
    },
    {
      title: t("consultation.steps.date_time"),
    },
    {
      title: t("consultation.steps.payment"),
    },
  ];

  return (
    <Steps current={current} items={items} className="mb-8 modern-stepper" />
  );
};

export default ConsultationStepIndicator;
