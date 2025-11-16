import api from "./../config.js";

// Get courses by language
export const getCourses = async (lang = "ar", page = 1, per_page = 5) => {
  try {
    const response = await api.get(`/courses`, {
      params: {
        lang,
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Enroll in a course
export const enrollCourse = async (
  courseId,
  currency = "usd",
  returnUrl = "/success",
  cancelUrl = "/cancel"
) => {
  try {
    const response = await api.post(`/enroll`, {
      course_id: courseId,
      currency,
      return_url: returnUrl,
      cancel_url: cancelUrl,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get enrolled courses by language
export const getEnrolledCourses = async (lang = "ar") => {
  try {
    const response = await api.get(`/enrolled_courses`, {
      params: {
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
