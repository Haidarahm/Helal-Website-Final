import api from "./config.js";

// Get news sections by language and page
export const getNews = async (lang = "ar", page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/api/news-sections`, {
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

// Fetch single news section by ID
export const fetchNews = async (id, lang = "ar") => {
  try {
    const response = await api.get(`/api/news-sections/${id}`, {
      params: {
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
