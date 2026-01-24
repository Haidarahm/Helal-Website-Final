import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { AiFillStar } from "react-icons/ai";
import { useCoursesStore } from "../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Popover, Button, Space, Pagination } from "antd";

const OfflineCourses = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { courses, pagination, isLoading, enrollCourse, fetchCourses } =
    useCoursesStore();
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = pagination?.per_page || 5;
  const isInitialLoading = isLoading && courses.length === 0;
  const isPaginating = isLoading && courses.length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
    fetchCourses(i18n.language, 1, 5);
  }, [i18n.language, fetchCourses]);

  useEffect(() => {
    // keep local page in sync with store pagination when it changes externally
    if (pagination?.current_page && pagination.current_page !== currentPage) {
      setCurrentPage(pagination.current_page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.current_page]);

  const handleEnrollClick = async (course, currency) => {
    try {
      setEnrollingCourseId(course.id);
      setOpenPopoverId(null);

      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/course-success`;
      const cancelUrl = `${baseUrl}/courses`;

      const response = await enrollCourse(
        course.id,
        currency,
        returnUrl,
        cancelUrl
      );

      // Debug: Log response to help identify structure
      console.log("Enrollment response:", response);

      // Check for redirect_url in multiple possible locations
      const redirectUrl =
        response?.redirect_url ??
        response?.data?.redirect_url ??
        response?.redirectUrl;

      // Check if the API response indicates success (check multiple possible success indicators)
      const isSuccess =
        response?.status === true ||
        response?.status === "success" ||
        response?.success === true ||
        response?.data?.status === true ||
        response?.data?.status === "success" ||
        response?.data?.success === true ||
        redirectUrl;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (isSuccess) {
        // Enrollment successful but no redirect (e.g., free course or already enrolled)
        toast.success(
          isRTL
            ? "تم التسجيل في الدورة بنجاح"
            : "Successfully enrolled in the course"
        );
        // Optionally navigate to success page or refresh courses
        setTimeout(() => {
          navigate("/course-success");
        }, 1500);
      } else {
        toast.error("Failed to process enrollment. Please try again.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);

      if (error?.response?.status === 401) {
        navigate("/auth", { state: { initialForm: "signup" } });
        setEnrollingCourseId(null);
        return;
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to enroll in course. Please try again.";
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
        <div className="p-2">
          <Button
            type="primary"
            block
            onClick={() => handleEnrollClick(course, "usd")}
            disabled={disableCurrencyButtons}
            loading={isEnrolling}
          >
            {isRTL ? "المتابعة" : "Continue"}
          </Button>
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

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    fetchCourses(i18n.language, page, pageSize);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-6 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Description */}
      <div className="mb-8 text-center max-w-4xl mx-auto">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-none">
          {t("courses.offline_courses_desc")}
        </p>
      </div>

      {courses.length === 0 && !isLoading && (
        <div className="text-center py-32 text-gray-500 text-lg">
          {t("courses.no_courses") || "No courses available"}
        </div>
      )}

      {isInitialLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
            {courses.map((course) => (
              <article
                key={course.id}
                className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden
                          transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                          hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transform-gpu transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                      {isRTL ? "لا توجد صورة" : "No image available"}
                    </div>
                  )}

                  <span className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                    {t("courses.category")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {course.description ||
                        (isRTL ? "لا يوجد وصف" : "No description available")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${isRTL ? "text-right" : "text-left"}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {course.price_aed && parseFloat(course.price_aed) > 0
                            ? `${course.price_aed} ${t("courses.currency.aed")}`
                            : course.price_usd &&
                              parseFloat(course.price_usd) > 0
                            ? `${course.price_usd} ${t("courses.currency.usd")}`
                            : t("courses.free")}
                        </span>
                        {course.price_usd &&
                          parseFloat(course.price_usd) > 0 &&
                          course.price_aed &&
                          parseFloat(course.price_aed) > 0 && (
                            <span className="text-sm text-gray-500">
                              (~{course.price_usd} {t("courses.currency.usd")})
                            </span>
                          )}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <AiFillStar className="text-yellow-400 text-lg" />
                        <AiFillStar className="text-yellow-400 text-lg" />
                        <AiFillStar className="text-yellow-400 text-lg" />
                        <AiFillStar className="text-yellow-400 text-lg" />
                        <AiFillStar className="text-yellow-400 text-lg" />
                      </div>
                      <span className="text-gray-600 text-xs">
                        ({course.reviews} {t("courses.reviews")})
                      </span>
                    </div>

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
                        onClick={() => {
                          const { hasAED, hasUSD } =
                            getAvailableCurrencies(course);
                          if (hasAED && hasUSD) {
                            setOpenPopoverId(course.id);
                          } else {
                            const currency = hasAED ? "aed" : "usd";
                            handleEnrollClick(course, currency);
                          }
                        }}
                        disabled={isPaginating || enrollingCourseId !== null}
                        className="w-full bg-linear-to-r from-primary to-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg
                                 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                                 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {enrollingCourseId === course.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-white text-sm">
                              {isRTL ? "جاري التسجيل..." : "Enrolling..."}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white">
                            {t("courses.enroll_button")}
                          </span>
                        )}
                      </button>
                    </Popover>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination?.total > pageSize && (
        <div className="flex items-center justify-center mt-10" dir="ltr">
          <Pagination
            current={pagination.current_page || currentPage}
            pageSize={pageSize}
            total={pagination.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false}
            disabled={isPaginating}
            locale={{ prev_page: "Previous page", next_page: "Next page" }}
          />
        </div>
      )}
    </div>
  );
};

export default OfflineCourses;
