import { Pagination, Spin, Empty } from "antd";
import { Clock, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ConsultationTypeStep = ({
  consultationTypes,
  selectedConsultation,
  onSelect,
  isTypesLoading,
  pagination,
  onPageChange,
  getAvailableCurrencies,
}) => {
  const { t } = useTranslation();

  if (isTypesLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (consultationTypes.length === 0) {
    return (
      <Empty description={t("consultation.step_content.no_consultations")} />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {consultationTypes.map((consultation) => {
          const { hasAED, hasUSD } = getAvailableCurrencies(consultation);

          const isSelected = selectedConsultation?.id === consultation.id;

          const price = hasAED
            ? consultation.price_aed
            : hasUSD
            ? consultation.price_usd
            : null;
          const currency = hasAED ? "AED" : hasUSD ? "USD" : null;

          return (
            <div
              key={consultation.id}
              className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "bg-linear-to-br from-primary/10 to-primary/5 border-2 border-primary shadow-lg scale-[1.02]"
                  : "bg-white border border-gray-200 hover:border-primary/40 hover:shadow-md"
              }`}
              onClick={() => onSelect(consultation)}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900 pr-8">
                  {consultation.type}
                </h4>

                {consultation.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {consultation.duration}{" "}
                      {t("consultation.step_content.duration_min")}
                    </span>
                  </div>
                )}

                {price && currency ? (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {price}
                      </span>
                      <span className="text-sm text-gray-600">{currency}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {t("consultation.step_content.pricing_not_available")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center">
          <Pagination
            current={pagination.current_page}
            total={pagination.total}
            pageSize={pagination.per_page}
            onChange={onPageChange}
            showSizeChanger={false}
            disabled={isTypesLoading}
          />
        </div>
      )}
    </div>
  );
};

export default ConsultationTypeStep;
