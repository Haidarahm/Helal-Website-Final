import { create } from "zustand";
import {
  getNews as getNewsApi,
  fetchNews as fetchNewsApi,
} from "../apis/news.js";

const useNewsStore = create((set, get) => ({
  // State
  news: [],
  singleNews: null,
  pagination: null,
  isLoading: false,
  error: null,

  // Actions
  setNews: (news) => set({ news }),
  setPagination: (pagination) => set({ pagination }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch news
  fetchNews: async (lang = "ar", page = 1) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getNewsApi(lang, page);

      if (response?.status && response?.data) {
        set({
          news: response.data,
          pagination: response.pagination || null,
          isLoading: false,
        });
        return response.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch news";
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },

  // Fetch single news by ID
  fetchNewsById: async (id, lang = "ar") => {
    try {
      set({ isLoading: true, error: null, singleNews: null });
      const response = await fetchNewsApi(id, lang);

      // Handle both wrapped and direct response formats
      const newsData =
        response?.status && response?.data ? response.data : response;

      if (newsData && (newsData.id || newsData.title)) {
        set({
          singleNews: newsData,
          isLoading: false,
        });
        return newsData;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch news";
      set({ error: errorMessage, isLoading: false, singleNews: null });
      return null;
    }
  },
}));

export default useNewsStore;
