import { useEffect, useMemo } from "react";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import useAvailabilityStore from "../../../store/availabilityStore.js";

const ConsultationScheduleStep = ({
  selectedDate,
  onDateChange,
  selectedStartTime,
  onTimeChange,
  isRTL,
}) => {
  const { t } = useTranslation();
  const { availabilities, fetchAvailableDates } = useAvailabilityStore();

  // Fetch available dates on mount
  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  // Get available weekdays from availabilities
  const availableWeekdays = useMemo(() => {
    const weekdays = new Set();
    availabilities.forEach((availability) => {
      // Map day names to dayjs day numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };
      const dayNum = dayMap[availability.day];
      if (dayNum !== undefined) {
        weekdays.add(dayNum);
      }
    });
    return weekdays;
  }, [availabilities]);

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
          disabledDate={(current) => {
            if (!current) return false;
            // Disable past dates
            if (current < dayjs().startOf("day")) return true;
            // Disable dates that are not in available weekdays
            if (availableWeekdays.size > 0) {
              const dayOfWeek = current.day();
              return !availableWeekdays.has(dayOfWeek);
            }
            return false;
          }}
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
