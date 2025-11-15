import { useEffect, useMemo } from "react";
import { DatePicker, Spin } from "antd";
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
  const {
    availabilities,
    fetchAvailableDates,
    availableIntervals,
    fetchAvailableIntervals,
    isIntervalsLoading,
    clearAvailableIntervals,
  } = useAvailabilityStore();

  // Fetch available dates on mount
  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  // Fetch available intervals when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableIntervals(selectedDate);
    } else {
      clearAvailableIntervals();
      onTimeChange(null);
    }
  }, [
    selectedDate,
    fetchAvailableIntervals,
    clearAvailableIntervals,
    onTimeChange,
  ]);

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

  // Generate time slots based on available intervals
  const timeSlots = useMemo(() => {
    const slots = [];

    // If no available intervals, return empty array
    if (!availableIntervals || !availableIntervals.available_intervals) {
      return slots;
    }

    const intervals = availableIntervals.available_intervals;

    // Generate all hours from 1:00 to 24:00
    const allHours = [];
    for (let hour = 1; hour <= 24; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00`;
      allHours.push(timeStr);
    }

    // Filter hours that fall within any available interval
    allHours.forEach((timeStr) => {
      const timeHour = parseInt(timeStr.split(":")[0], 10);
      const timeMinutes = 0;

      // Check if this hour falls within any available interval
      const isInInterval = intervals.some((interval) => {
        const [startHour, startMin] = interval.start.split(":").map(Number);
        const [endHour, endMin] = interval.end.split(":").map(Number);

        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        const currentTime = timeHour * 60 + timeMinutes;

        // Check if current time is within the interval (inclusive of start, exclusive of end)
        // For hour slots, we check if the hour (e.g., 05:00) is >= start and < end
        return currentTime >= startTime && currentTime < endTime;
      });

      if (isInInterval) {
        slots.push(timeStr);
      }
    });

    return slots;
  }, [availableIntervals]);

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
        {!selectedDate ? (
          <div className="p-4 text-center text-text-secondary border border-gray-200 rounded-lg bg-gray-50">
            {t("consultation.step_content.select_date_first")}
          </div>
        ) : isIntervalsLoading ? (
          <div className="flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-white">
            <Spin size="large" />
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="p-4 text-center text-text-secondary border border-gray-200 rounded-lg bg-gray-50">
            {t("consultation.step_content.no_time_slots")}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ConsultationScheduleStep;
