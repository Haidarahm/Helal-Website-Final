import { useState, useEffect } from "react";
import { Select, Button, Card, InputNumber } from "antd";
import { FaCalculator, FaDollarSign, FaPercentage } from "react-icons/fa";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

const { Option } = Select;

const currencyPairs = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
  "EUR/CHF",
];

const accountCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "NZD",
];

// Standard lot sizes for major pairs
const lotSizes = {
  "EUR/USD": 100000,
  "GBP/USD": 100000,
  "USD/JPY": 100000,
  "USD/CHF": 100000,
  "AUD/USD": 100000,
  "USD/CAD": 100000,
  "EUR/GBP": 100000,
  "EUR/JPY": 100000,
  "GBP/JPY": 100000,
  "EUR/CHF": 100000,
};

export const Calculator = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const [currency, setCurrency] = useState("USD");
  const [balance, setBalance] = useState("");
  const [currencyPair, setCurrencyPair] = useState("EUR/USD");
  const [riskPercentage, setRiskPercentage] = useState("2");
  const [stopLoss, setStopLoss] = useState("");
  const [contractSize, setContractSize] = useState(100000);
  const [result, setResult] = useState(null);

  // Auto-calculate when values change
  useEffect(() => {
    calculatePositionSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, currency, currencyPair, riskPercentage, stopLoss, contractSize]);

  // Auto-fill contract size when pair changes
  useEffect(() => {
    if (currencyPair && lotSizes[currencyPair]) {
      setContractSize(lotSizes[currencyPair]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyPair]);

  const calculatePositionSize = () => {
    if (!balance || !riskPercentage || !stopLoss || !contractSize) {
      setResult(null);
      return;
    }

    const balanceNum = parseFloat(balance);
    const riskPercent = parseFloat(riskPercentage) / 100;
    const stopLossPips = parseFloat(stopLoss);
    const contractSizeNum = parseFloat(contractSize);

    if (
      isNaN(balanceNum) ||
      isNaN(riskPercent) ||
      isNaN(stopLossPips) ||
      isNaN(contractSizeNum) ||
      balanceNum <= 0 ||
      riskPercent <= 0 ||
      stopLossPips <= 0 ||
      contractSizeNum <= 0
    ) {
      setResult(null);
      return;
    }

    // Calculate risk amount
    const riskAmount = balanceNum * riskPercent;

    // Calculate lot size based on pip value
    // For standard lots, pip value = $10 per pip for major pairs
    const pipValue = 10;
    const positionSize = riskAmount / (stopLossPips * pipValue);

    // Calculate units (contracts)
    const units = positionSize * contractSizeNum;

    setResult({
      money: riskAmount,
      units: units.toFixed(0),
      positionSize: positionSize.toFixed(4),
    });
  };

  const resetForm = () => {
    setBalance("");
    setRiskPercentage("2");
    setStopLoss("");
    setContractSize(lotSizes[currencyPair]);
    setResult(null);
  };

  const handleBalanceChange = (value) => {
    setBalance(value);
  };

  const handleRiskChange = (value) => {
    setRiskPercentage(value);
  };

  const handleStopLossChange = (value) => {
    setStopLoss(value);
  };

  const handleContractSizeChange = (value) => {
    setContractSize(value);
  };

  return (
    <div
      className="min-h-screen bg-white pt-24 pb-12 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-primary to-primary-dark rounded-full mb-6 shadow-lg">
            <FaCalculator className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("calculator.title")}
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("calculator.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <h2 className="text-2xl font-bold mb-6">{t("calculator.title")}</h2>

            <div className="space-y-6">
              {/* Account Currency */}
              <div className="pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("calculator.account_currency")}
                </label>
                <Select
                  value={currency}
                  onChange={setCurrency}
                  className="w-full calculator-select"
                  size="large"
                >
                  {accountCurrencies.map((curr) => (
                    <Option key={curr} value={curr}>
                      {curr}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Account Balance */}
              <div className="pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("calculator.account_balance")}
                </label>
                <InputNumber
                  value={balance}
                  onChange={handleBalanceChange}
                  placeholder={t("calculator.placeholder_balance")}
                  className="w-full calculator-input"
                  size="large"
                  prefix={<FaDollarSign />}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </div>

              {/* Currency Pair */}
              <div className="pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("calculator.currency_pair")}
                </label>
                <Select
                  value={currencyPair}
                  onChange={setCurrencyPair}
                  className="w-full calculator-select"
                  size="large"
                >
                  {currencyPairs.map((pair) => (
                    <Option key={pair} value={pair}>
                      {pair}
                    </Option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  {t("calculator.standard_contract_size")}:{" "}
                  {lotSizes[currencyPair].toLocaleString()}{" "}
                  {t("calculator.units")}
                </p>
              </div>

              {/* Risk and Stop Loss in grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                {/* Risk Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("calculator.risk_percentage")} (%)
                  </label>
                  <InputNumber
                    value={riskPercentage}
                    onChange={handleRiskChange}
                    placeholder={t("calculator.placeholder_risk")}
                    className="w-full calculator-input"
                    size="large"
                    prefix={<FaPercentage />}
                    min={0}
                    max={100}
                    decimalSeparator="."
                  />
                </div>

                {/* Stop Loss Pips */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("calculator.stop_loss")} ({t("calculator.pips")})
                  </label>
                  <InputNumber
                    value={stopLoss}
                    onChange={handleStopLossChange}
                    placeholder={t("calculator.placeholder_stop_loss")}
                    className="w-full calculator-input"
                    size="large"
                    min={0}
                    decimalSeparator="."
                  />
                </div>
              </div>

              {/* Contract Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("calculator.contract_size")} ({t("calculator.units")})
                </label>
                <InputNumber
                  value={contractSize}
                  onChange={handleContractSizeChange}
                  placeholder={`${t("calculator.placeholder_contract")}: ${
                    lotSizes[currencyPair]
                  }`}
                  className="w-full calculator-input"
                  size="large"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t("calculator.auto_filled")}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  size="large"
                  onClick={resetForm}
                  className="w-full font-semibold"
                  block
                >
                  {t("calculator.reset")}
                </Button>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  <strong>{t("calculator.note")}:</strong>{" "}
                  {t("calculator.auto_update")}
                </p>
              </div>
            </div>
          </Card>

          {/* Results */}
          <Card className="shadow-lg">
            <h2 className="text-2xl font-bold mb-6">
              {t("calculator.results")}
            </h2>

            {result ? (
              <div className="space-y-6">
                {/* Risk Amount */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FiTrendingDown className="text-gray-600 text-2xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("calculator.risk_amount")}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {result.money.toFixed(2)} {currency}
                  </p>
                </div>

                {/* Position Size */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FiTrendingUp className="text-gray-600 text-2xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("calculator.position_size")}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {result.positionSize} {t("calculator.lots")}
                  </p>
                </div>

                {/* Units */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FaDollarSign className="text-gray-600 text-2xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("calculator.contract_units")}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {result.units} {t("calculator.units")}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>{t("calculator.note")}:</strong>{" "}
                    {t("calculator.note_text")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FaCalculator className="text-6xl mb-4" />
                <p className="text-lg">{t("calculator.fill_fields")}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
