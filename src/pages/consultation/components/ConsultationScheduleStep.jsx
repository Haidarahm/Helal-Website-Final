import { useEffect, useMemo } from "react";
import { DatePicker } from "antd";
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

  // Generate time slots from 1:00 to 24:00
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 1; hour <= 24; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00`;
      slots.push(timeStr);
    }
    return slots;
  }, []);

  // Handle time selection
  const handleTimeSelect = (timeStr) => {
    onTimeChange(timeStr);
  };

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
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {timeSlots.map((timeStr) => {
              const isSelected = selectedStartTime === timeStr;

              return (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => handleTimeSelect(timeStr)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isSelected
                        ? "bg-primary text-white shadow-md scale-105"
                        : "bg-white text-text-primary border border-gray-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
                    }
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                >
                  {timeStr}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationScheduleStep;
