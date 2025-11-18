import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLanguage } from "../../context/LanguageContext";
import { useOnlineCoursesStore } from "../../store";
import { Popover, Button, Space, Pagination } from "antd";

const OnlineCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const {
    onlineCourses,
    pagination,
    isLoading,
    error,
    fetchOnlineCourses,
    enrollOnlineCourse,
  } = useOnlineCoursesStore();
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = pagination?.per_page || 5;
  const isInitialLoading = isLoading && onlineCourses.length === 0;
  const isPaginating = isLoading && onlineCourses.length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
    fetchOnlineCourses(i18n.language, 1, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    fetchOnlineCourses(i18n.language, page, pageSize);
    window.scrollTo(0, 0);
  };

  const formatDate = (value) => {
    if (!value) return isRTL ? "غير محدد" : "Not scheduled";
    return new Date(value).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "--";
    return new Date(`1970-01-01T${value}Z`).toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEnrollClick = async (course, currency) => {
    try {
      setEnrollingCourseId(course.id);
      setOpenPopoverId(null);

      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/course-success`;
      const cancelUrl = `${baseUrl}/courses`;

      const response = await enrollOnlineCourse(
        course.id,
        currency,
        returnUrl,
        cancelUrl
      );

      const redirectUrl =
        response?.redirect_url ?? response?.data?.redirect_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error(
          t("courses.enroll_error") ||
            (isRTL
              ? "فشل في معالجة التسجيل. يرجى المحاولة مرة أخرى."
              : "Failed to process enrollment. Please try again.")
        );
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth", { state: { initialForm: "signup" } });
        setEnrollingCourseId(null);
        return;
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (isRTL
          ? "فشل في التسجيل في الدورة. يرجى المحاولة مرة أخرى."
          : "Failed to enroll in course. Please try again.");
      toast.error(errorMessage);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const getAvailableCurrencies = (course) => {
    const hasAED =
      course.price_aed &&
      !Number.isNaN(parseFloat(course.price_aed)) &&
      parseFloat(course.price_aed) > 0;
    const hasUSD =
      course.price_usd &&
      !Number.isNaN(parseFloat(course.price_usd)) &&
      parseFloat(course.price_usd) > 0;

    return { hasAED, hasUSD };
  };

  const renderCurrencyPopover = (course) => {
    const { hasAED, hasUSD } = getAvailableCurrencies(course);
    const isEnrolling = enrollingCourseId === course.id;
    const disableCurrencyButtons = isEnrolling || isPaginating;

    if (!hasAED && !hasUSD) {
      return (
        <div className="p-2 text-sm text-gray-600">
          {isRTL ? "لا تتوفر أسعار لهذه الدورة" : "No pricing available"}
        </div>
      );
    }

    if (hasAED && hasUSD) {
      return (
        <div className="p-2">
          <div className="mb-3 text-sm font-semibold text-gray-700">
            {isRTL ? "اختر العملة للدفع" : "Select payment currency"}
          </div>
          <Space direction="vertical" className="w-full" size="small">
            <Button
              type="primary"
              block
              onClick={() => handleEnrollClick(course, "aed")}
              className="text-left"
              disabled={disableCurrencyButtons}
              loading={isEnrolling}
            >
              {course.price_aed} {t("courses.currency.aed")} - AED
            </Button>
            <Button
              type="primary"
              block
              onClick={() => handleEnrollClick(course, "usd")}
              className="text-left"
              disabled={disableCurrencyButtons}
              loading={isEnrolling}
            >
              {course.price_usd} {t("courses.currency.usd")} - USD
            </Button>
          </Space>
        </div>
      );
    }

    const currency = hasAED ? "aed" : "usd";
    const price = hasAED ? course.price_aed : course.price_usd;
    const currencyLabel = hasAED
      ? t("courses.currency.aed")
      : t("courses.currency.usd");

    return (
      <div className="p-2">
        <div className="mb-3 text-sm text-gray-700">
          {isRTL ? "السعر" : "Price"}: {price} {currencyLabel}
        </div>
        <Button
          type="primary"
          block
          onClick={() => handleEnrollClick(course, currency)}
          disabled={disableCurrencyButtons}
          loading={isEnrolling}
        >
          {isRTL ? "المتابعة" : "Continue"}
        </Button>
      </div>
    );
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-6 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Description */}
      <div className="mb-8 text-center max-w-4xl mx-auto">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-none">
          {t("courses.online_courses_desc")}
        </p>
      </div>

      {isInitialLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : onlineCourses.length === 0 ? (
        <div className="text-center py-32 text-gray-500 text-lg">
          {isRTL ? "لا توجد دورات متاحة حالياً" : "No online courses available"}
        </div>
      ) : (
        <div className="relative">
          {isPaginating && (
            <div className="absolute inset-0 rounded-2xl bg-white/75 z-10 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 font-medium">
                {isRTL ? "جاري تحميل الصفحة..." : "Loading page..."}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {onlineCourses.map((course) => {
              return (
                <article
                  key={course.id}
                  className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {course.cover_image ? (
                      <img
                        src={course.cover_image}
                        alt={course.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                        {isRTL ? "لا توجد صورة" : "No cover image"}
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                      {isRTL ? "مباشر" : "Live"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {course.name}
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {course.description ||
                          (isRTL ? "لا يوجد وصف" : "No description")}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Price */}
                      <div className={`${isRTL ? "text-right" : "text-left"}`}>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {course.price_aed &&
                            parseFloat(course.price_aed) > 0
                              ? `${course.price_aed} ${t(
                                  "courses.currency.aed"
                                )}`
                              : course.price_usd &&
                                parseFloat(course.price_usd) > 0
                              ? `${course.price_usd} ${t(
                                  "courses.currency.usd"
                                )}`
                              : t("courses.free")}
                          </span>
                          {course.price_usd &&
                            parseFloat(course.price_usd) > 0 &&
                            course.price_aed &&
                            parseFloat(course.price_aed) > 0 && (
                              <span className="text-sm text-gray-500">
                                (~{course.price_usd} {t("courses.currency.usd")}
                                )
                              </span>
                            )}
                        </div>
                      </div>

                      {course.meet_url && (
                        <div
                          className={`${isRTL ? "text-right" : "text-left"}`}
                        >
                          <a
                            href={course.meet_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {isRTL ? "رابط اللقاء" : "Meeting link"}
                          </a>
                        </div>
                      )}

                      {course.appointment && (
                        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              {isRTL ? "التاريخ" : "Date"}
                            </span>
                            <span>{formatDate(course.appointment.date)}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-semibold">
                              {isRTL ? "الوقت" : "Time"}
                            </span>
                            <span>
                              {`${formatTime(
                                course.appointment.start_time
                              )} - ${formatTime(course.appointment.end_time)}`}
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <Popover
                          content={renderCurrencyPopover(course)}
                          trigger="click"
                          open={openPopoverId === course.id}
                          onOpenChange={(open) =>
                            setOpenPopoverId(open ? course.id : null)
                          }
                          placement={isRTL ? "bottomRight" : "bottomLeft"}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const { hasAED, hasUSD } =
                                getAvailableCurrencies(course);
                              if (!hasAED && !hasUSD) {
                                toast.error(
                                  isRTL
                                    ? "لا تتوفر أسعار لهذه الدورة"
                                    : "No pricing available for this course"
                                );
                                return;
                              }
                              if (hasAED && hasUSD) {
                                setOpenPopoverId(course.id);
                              } else {
                                const currency = hasAED ? "aed" : "usd";
                                handleEnrollClick(course, currency);
                              }
                            }}
                            disabled={
                              isPaginating || enrollingCourseId !== null
                            }
                            className="w-full bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                          >
                            {enrollingCourseId === course.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-white">
                                  {isRTL ? "جاري التسجيل..." : "Enrolling..."}
                                </span>
                              </>
                            ) : (
                              <span className="text-white">
                                {t("courses.enroll_button")}
                              </span>
                            )}
                          </button>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center mt-12 mb-8" dir="ltr">
          <Pagination
            current={pagination.current_page || currentPage}
            total={pagination.total || 0}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            disabled={isPaginating}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} ${isRTL ? "من" : "of"} ${total}`
            }
          />
        </div>
      )}
    </div>
  );
};

export default OnlineCourses;
