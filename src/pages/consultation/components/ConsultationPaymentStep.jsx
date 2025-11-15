import { useTranslation } from "react-i18next";

const ConsultationPaymentStep = ({
  selectedConsultation,
  selectedDate,
  selectedStartTime,
  getAvailableCurrencies,
  onPay,
  isRTL,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (!selectedConsultation) return null;

  const { hasAED, hasUSD } = getAvailableCurrencies(selectedConsultation);

  const currencyButtonBase =
    "w-full flex items-center justify-between px-6 py-4 rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const renderCurrencyButtons = () => {
    const buttons = [];

    if (hasAED) {
      buttons.push(
        <button
          key="AED"
          onClick={() => onPay("AED")}
          disabled={isLoading}
          className={`${currencyButtonBase} border-gray-200`}
        >
          <span className="text-gray-900 font-semibold text-lg">
            {selectedConsultation.price_aed}{" "}
            <span className="text-sm font-normal text-gray-500">AED</span>
          </span>
          <span className="text-primary font-medium text-sm">
            {t("consultation.step_content.pay_now")}
          </span>
        </button>
      );
    }

    if (hasUSD) {
      buttons.push(
        <button
          key="USD"
          onClick={() => onPay("USD")}
          disabled={isLoading}
          className={`${currencyButtonBase} border-gray-200`}
        >
          <span className="text-gray-900 font-semibold text-lg">
            {selectedConsultation.price_usd}{" "}
            <span className="text-sm font-normal text-gray-500">USD</span>
          </span>
          <span className="text-primary font-medium text-sm">
            {t("consultation.step_content.pay_now")}
          </span>
        </button>
      );
    }

    if (buttons.length === 0) {
      return (
        <div className="text-center text-gray-500 py-5 text-sm">
          {t("consultation.step_content.no_pricing")}
        </div>
      );
    }

    return <div className="space-y-3">{buttons}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm" dir={isRTL ? "rtl" : "ltr"}>
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              {selectedConsultation.type}
            </h4>
            {selectedConsultation.duration && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedConsultation.duration}{" "}
                {t("consultation.step_content.duration_min")}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {selectedDate} {selectedStartTime && `• ${selectedStartTime}`}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div>
        <p className="text-sm text-gray-600 mb-3" dir={isRTL ? "rtl" : "ltr"}>
          {t("consultation.step_content.select_currency")}
        </p>
        {renderCurrencyButtons()}
      </div>
    </div>
  );
};

export default ConsultationPaymentStep;
