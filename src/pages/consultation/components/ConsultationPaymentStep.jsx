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
        <div className="space-y-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onPay("AED")}
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl font-bold">
              {selectedConsultation.price_aed}
            </span>{" "}
            <span className="text-base font-normal">AED</span>
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onPay("USD")}
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl font-bold">
              {selectedConsultation.price_usd}
            </span>{" "}
            <span className="text-base font-normal">USD</span>
          </button>
        </div>
      );
    }

    if (hasAED) {
      return (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onPay("AED")}
          className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-2xl font-bold">
            {selectedConsultation.price_aed}
          </span>{" "}
          <span className="text-base font-normal">AED</span>
        </button>
      );
    }

    if (hasUSD) {
      return (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onPay("USD")}
          className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-2xl font-bold">
            {selectedConsultation.price_usd}
          </span>{" "}
          <span className="text-base font-normal">USD</span>
        </button>
      );
    }

    return (
      <div className="text-center text-gray-500 py-4">
        {t("consultation.step_content.no_pricing")}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">
              {selectedConsultation.type}
            </h4>
            {selectedConsultation.duration && (
              <p className="text-sm text-gray-500">
                {t("consultation.step_content.duration_label")}{" "}
                {selectedConsultation.duration}{" "}
                {t("consultation.step_content.duration_min")}
              </p>
            )}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
              {t("consultation.step_content.date_time_label")}
            </p>
            <p className="text-base font-semibold text-gray-900">
              {selectedDate} {selectedStartTime && `• ${selectedStartTime}`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">
          {t("consultation.step_content.select_currency")}
        </p>
        {renderCurrencyButtons()}
      </div>
    </div>
  );
};

export default ConsultationPaymentStep;
