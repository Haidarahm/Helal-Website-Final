import api from "../config.js";

const buildParams = (lang, pagination) => {
  const params = {};
  if (lang) params.lang = lang;
  if (pagination !== undefined && pagination !== null) {
    params.pagination = pagination;
  }
  return params;
};

export const fetchOnlineCourses = async (lang = "ar", pagination = 1) => {
  try {
    const response = await api.get("/courses-online/get", {
      params: buildParams(lang, pagination),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMyOnlineCourses = async (lang = "ar", pagination) => {
  try {
    const response = await api.get("/courses-online/get-my-courses", {
      params: buildParams(lang, pagination),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Enroll in an online course
export const enrollOnlineCourse = async (
  courseOnlineId,
  currency = "usd",
  returnUrl = "/success",
  cancelUrl = "/cancel"
) => {
  try {
    const response = await api.post("/courses-online/enroll", {
      course_online_id: courseOnlineId,
      currency,
      return_url: returnUrl,
      cancel_url: cancelUrl,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
