import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { usePrivateCoursesStore } from "../../store";
import { Pagination, Modal, Steps, Radio } from "antd";
import { toast } from "react-toastify";
import ConsultationScheduleStep from "../consultation/components/ConsultationScheduleStep.jsx";

const PrivateCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const {
    lessons,
    pagination,
    isLoading,
    fetchPrivateLessons,
    getPrivateLessonOptions,
    enrollPrivateLesson,
    isOptionsLoading,
    isEnrolling,
  } = usePrivateCoursesStore();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const lang = useMemo(
    () => (i18n.language?.startsWith("ar") ? "ar" : "en"),
    [i18n.language]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPrivateLessons({ lang, page, per_page: 5 });
  }, [lang, page, fetchPrivateLessons]);

  const openEnrollModal = async (lessonId) => {
    try {
      setSelectedLessonId(lessonId);
      setIsModalOpen(true);
      setCurrentStep(0);
      setSelectedOptionId(null);
      setSelectedDate(null);
      setSelectedTime(null);
      const data = await getPrivateLessonOptions(lessonId);
      setLessonOptions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(isRTL ? "فشل تحميل الخيارات" : "Failed to load options");
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!selectedOptionId) {
        toast.error(
          isRTL ? "يرجى اختيار خيار الدرس" : "Please select a lesson option"
        );
        return;
      }
    }
    if (currentStep === 1) {
      if (!selectedDate || !selectedTime) {
        toast.error(
          isRTL ? "يرجى اختيار التاريخ والوقت" : "Please select date and time"
        );
        return;
      }
    }
    setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(0, s - 1));

  const handleConfirmEnroll = async () => {
    try {
      const option = lessonOptions.find((o) => o.id === selectedOptionId);
      if (!option) {
        toast.error(isRTL ? "خيار غير صالح" : "Invalid option");
        return;
      }
      const baseUrl = window.location.origin;
      const currency =
        (option.price_usd && parseFloat(option.price_usd) > 0 && "usd") ||
        (option.price_aed && parseFloat(option.price_aed) > 0 && "aed") ||
        "usd";
      const payload = {
        private_information_id: selectedOptionId,
        currency,
        return_url: `${baseUrl}/Helal-Aljaberi/private-lesson-success`,
        cancel_url: `${baseUrl}/Helal-Aljaberi/courses`,
        date: selectedDate, // expected format "DD-MM-YYYY"
        start_time: selectedTime, // "HH:mm"
      };
      const resp = await enrollPrivateLesson(payload);
      const redirectUrl =
        resp?.redirect_url ?? resp?.data?.redirect_url ?? null;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error(
          isRTL ? "فشل في معالجة عملية التسجيل" : "Failed to process enrollment"
        );
      }
    } catch (e) {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          (isRTL ? "حدث خطأ أثناء التسجيل" : "An error occurred during enroll")
      );
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-6 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Description */}
      <div className="mb-8 text-center max-w-4xl mx-auto">
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          {t("courses.private_courses_desc")}
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : lessons.length === 0 ? (
        <div className="py-24 text-center text-gray-500">
          {t("courses.no_courses")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="aspect-16/10 w-full bg-accent-muted">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={() => openEnrollModal(item.id)}
                    className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg transition-colors hover:bg-primary-dark"
                  >
                    {t("courses.enroll_button")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-center mt-10" dir="ltr">
          <Pagination
            current={pagination.current_page || page}
            pageSize={pagination.per_page || 5}
            total={pagination.total || lessons.length}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Enroll Modal with Steps */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={820}
        destroyOnClose
        centered
        className="private-lesson-modal"
      >
        <div className="mb-8" dir={isRTL ? "rtl" : "ltr"}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t("courses.enroll_private_lesson")}
          </h2>
          <Steps
            current={currentStep}
            direction="horizontal"
            items={[
              {
                title: t("courses.select_option"),
                description:
                  currentStep === 0 ? t("courses.choose_lesson_details") : null,
              },
              {
                title: t("courses.schedule_time"),
                description:
                  currentStep === 1 ? t("courses.pick_date_time") : null,
              },
              {
                title: t("courses.confirm_booking"),
                description:
                  currentStep === 2 ? t("courses.review_details") : null,
              },
            ]}
            className="px-4"
          />
        </div>

        <div className="mt-6" dir={isRTL ? "rtl" : "ltr"}>
          {currentStep === 0 && (
            <div>
              {isOptionsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : lessonOptions.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  {t("courses.no_options")}
                </div>
              ) : (
                <Radio.Group
                  className="w-full"
                  value={selectedOptionId}
                  onChange={(e) => setSelectedOptionId(e.target.value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessonOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedOptionId === opt.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-gray-200 hover:border-primary"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Radio value={opt.id} className="mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="mb-3">
                              <div className="font-semibold text-gray-900 text-base line-clamp-1">
                                {lang === "ar"
                                  ? opt.lesson?.title_ar
                                  : opt.lesson?.title_en}
                              </div>
                              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {lang === "ar"
                                  ? opt.lesson?.description_ar
                                  : opt.lesson?.description_en}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-primary shrink-0"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">{opt.place}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-primary shrink-0"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>
                                  {opt.duration}{" "}
                                  {t("consultation.step_content.duration_min")}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-baseline gap-3">
                                  {opt.price_usd &&
                                    parseFloat(opt.price_usd) > 0 && (
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-primary">
                                          {opt.price_usd}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-600">
                                          {t("courses.currency.usd")}
                                        </span>
                                      </div>
                                    )}
                                  {opt.price_aed &&
                                    parseFloat(opt.price_aed) > 0 && (
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-semibold text-gray-700">
                                          {opt.price_aed}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500">
                                          {t("courses.currency.aed")}
                                        </span>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </Radio.Group>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <ConsultationScheduleStep
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedStartTime={selectedTime}
              onTimeChange={setSelectedTime}
              isRTL={isRTL}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
                <div className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("courses.review_booking")}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">
                        {t("courses.my_courses.date")}:
                      </span>{" "}
                      <span className="text-gray-600">{selectedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">
                        {t("courses.my_courses.time")}:
                      </span>{" "}
                      <span className="text-gray-600">{selectedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-6 py-2.5 rounded-lg border border-gray-300 font-medium transition-all ${
              currentStep === 0
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "hover:bg-gray-50 text-gray-700 hover:border-gray-400"
            }`}
          >
            {t("consultation.buttons.previous")}
          </button>
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
            >
              {t("consultation.buttons.next")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmEnroll}
              disabled={isEnrolling}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isEnrolling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("consultation.form.loading")}
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("courses.confirm_enroll")}
                </>
              )}
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PrivateCourses;
