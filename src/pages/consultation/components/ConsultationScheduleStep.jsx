import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const ConsultationScheduleStep = ({
  selectedDate,
  onDateChange,
  selectedStartTime,
  onTimeChange,
  isRTL,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <label
          className={`block mb-2 text-sm font-medium text-text-primary ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("consultation.step_content.date")}
        </label>
        <DatePicker
          size="large"
          className="w-full"
          placeholder={t("consultation.step_content.select_date")}
          format="DD-MM-YYYY"
          value={selectedDate ? dayjs(selectedDate, "DD-MM-YYYY") : null}
          onChange={(date) => {
            if (date) {
              onDateChange(date.format("DD-MM-YYYY"));
            } else {
              onDateChange(null);
            }
          }}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />
      </div>

      <div>
        <label
          className={`block mb-2 text-sm font-medium text-text-primary ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("consultation.step_content.time")}
        </label>
        <TimePicker
          size="large"
          className="w-full"
          placeholder={t("consultation.step_content.select_time")}
          format="HH:mm"
          value={selectedStartTime ? dayjs(selectedStartTime, "HH:mm") : null}
          onChange={(time) => {
            if (time) {
              onTimeChange(time.format("HH:mm"));
            } else {
              onTimeChange(null);
            }
          }}
          minuteStep={30}
          hourStep={1}
        />
      </div>
    </div>
  );
};

export default ConsultationScheduleStep;
