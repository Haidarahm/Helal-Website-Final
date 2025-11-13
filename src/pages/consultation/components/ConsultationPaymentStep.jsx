import { Button, Card, Space } from "antd";
import { useTranslation } from "react-i18next";

const ConsultationPaymentStep = ({
  selectedConsultation,
  selectedDate,
  selectedStartTime,
  getAvailableCurrencies,
  onPay,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (!selectedConsultation) {
    return null;
  }

  const { hasAED, hasUSD } = getAvailableCurrencies(selectedConsultation);

  const renderCurrencyButtons = () => {
    if (hasAED && hasUSD) {
      return (
        <Space direction="vertical" className="w-full" size="middle">
          <Button
            type="primary"
            block
            size="large"
            disabled={isLoading}
            onClick={() => onPay("AED")}
            className="bg-primary hover:bg-primary-dark"
          >
            {`${selectedConsultation.price_aed} AED`}
          </Button>
          <Button
            type="primary"
            block
            size="large"
            disabled={isLoading}
            onClick={() => onPay("USD")}
            className="bg-primary hover:bg-primary-dark"
          >
            {`${selectedConsultation.price_usd} USD`}
          </Button>
        </Space>
      );
    }

    if (hasAED) {
      return (
        <Button
          type="primary"
          block
          size="large"
          disabled={isLoading}
          onClick={() => onPay("AED")}
          className="bg-primary hover:bg-primary-dark"
        >
          {`${selectedConsultation.price_aed} AED`}
        </Button>
      );
    }

    if (hasUSD) {
      return (
        <Button
          type="primary"
          block
          size="large"
          disabled={isLoading}
          onClick={() => onPay("USD")}
          className="bg-primary hover:bg-primary-dark"
        >
          {`${selectedConsultation.price_usd} USD`}
        </Button>
      );
    }

    return (
      <div className="text-center text-gray-500 py-4">
        {t("consultation.step_content.no_pricing")}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedConsultation.type}
            </h4>
            {selectedConsultation.duration && (
              <p className="text-sm text-gray-600">
                {t("consultation.step_content.duration_label")}{" "}
                {selectedConsultation.duration}{" "}
                {t("consultation.step_content.duration_min")}
              </p>
            )}
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              {t("consultation.step_content.date_time_label")}
            </p>
            <p className="font-medium">
              {selectedDate} {selectedStartTime && `at ${selectedStartTime}`}
            </p>
          </div>
        </div>
      </Card>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          {t("consultation.step_content.select_currency")}
        </p>
        {renderCurrencyButtons()}
      </div>
    </div>
  );
};

export default ConsultationPaymentStep;
