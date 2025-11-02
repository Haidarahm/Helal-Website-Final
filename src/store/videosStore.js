import { create } from "zustand";
import {
  fetchAllCourseVideos as fetchAllCourseVideosApi,
  fetchVideoById as fetchVideoByIdApi,
} from "../apis/videos.js";

const useVideosStore = create((set, get) => ({
  // State
  courseVideos: [],
  currentVideo: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  },
  isLoading: false,
  error: null,

  // Actions
  setCourseVideos: (videos) => set({ courseVideos: videos }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch all course videos
  fetchCourseVideos: async (courseId, lang = "ar", page = 1, perPage = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchAllCourseVideosApi(
        courseId,
        lang,
        page,
        perPage
      );

      if (response?.status === "success" && response?.videos?.data) {
        set({
          courseVideos: response.videos.data,
          pagination: response.videos.meta,
          isLoading: false,
        });
        return response.videos.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch course videos";
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },

  // Fetch video by ID
  fetchVideo: async (videoId, lang = "ar") => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchVideoByIdApi(videoId, lang);

      if (response?.status === "success" && response?.video) {
        set({
          currentVideo: response.video,
          isLoading: false,
        });
        return response.video;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch video";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },
}));

export default useVideosStore;
