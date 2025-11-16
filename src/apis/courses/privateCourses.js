import api from "../config.js";

// Fetch paginated private lessons
// params: { lang, page, per_page }
export const fetchPrivateLessons = async ({
  lang,
  page = 1,
  per_page = 10,
} = {}) => {
  try {
    const response = await api.get("/private-lessons", {
      params: {
        ...(lang ? { lang } : {}),
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get private lesson options by lesson id
export const getPrivateLessonOptions = async (id) => {
  try {
    const response = await api.get(`/private-lesson-information/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Enroll in a private lesson
// payload should include:
// { private_information_id, currency, return_url, cancel_url, date, start_time }
export const enrollPrivateLesson = async (payload) => {
  try {
    const response = await api.post("/enroll", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
