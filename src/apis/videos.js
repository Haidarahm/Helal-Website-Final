import api from "./config.js";

// Fetch all course videos by course ID
export const fetchAllCourseVideos = async (
  courseId,
  lang = "ar",
  page = 1,
  perPage = 10
) => {
  try {
    const response = await api.get(`/courses/${courseId}/videos`, {
      params: {
        lang,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch video by ID
export const fetchVideoById = async (videoId, lang = "ar") => {
  try {
    const response = await api.get(`/videos/${videoId}`, {
      params: {
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
