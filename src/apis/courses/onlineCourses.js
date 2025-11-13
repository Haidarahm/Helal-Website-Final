import api from "../config.js";

const buildParams = (lang, pagination, perPage) => {
  const params = {};
  if (lang) params.lang = lang;
  if (pagination !== undefined && pagination !== null) {
    params.pagination = pagination;
  }
  if (perPage !== undefined && perPage !== null) {
    params.per_page = perPage;
  }
  return params;
};

export const fetchOnlineCourses = async (
  lang = "ar",
  pagination = 1,
  perPage = 5
) => {
  try {
    const response = await api.get("/courses-online/get", {
      params: buildParams(lang, pagination, perPage),
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

// Get my online courses (simplified version with only lang param)
export const getMyOnlineCourses = async (lang = "ar") => {
  try {
    const response = await api.get("/courses-online/get-my-courses", {
      params: {
        lang,
      },
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
    const response = await api.post("/enroll", {
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
