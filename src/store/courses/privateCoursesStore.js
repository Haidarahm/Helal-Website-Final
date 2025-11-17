import { create } from "zustand";
import { toast } from "react-toastify";
import {
  fetchPrivateLessons as fetchPrivateLessonsApi,
  getPrivateLessonOptions as getPrivateLessonOptionsApi,
  enrollPrivateLesson as enrollPrivateLessonApi,
} from "../../apis/courses/privateCourses.js";

const usePrivateCoursesStore = create((set, get) => ({
  // State
  lessons: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
  },
  optionsByLessonId: {},
  enrollment: null,
  isLoading: false,
  isOptionsLoading: false,
  isEnrolling: false,
  error: null,
  lessonsCache: {},

  // Helpers
  setError: (error) =>
    set({
      error,
      isLoading: false,
      isOptionsLoading: false,
      isEnrolling: false,
    }),
  clearEnrollment: () => set({ enrollment: null }),

  // Actions
  fetchPrivateLessons: async ({ lang, page = 1, per_page = 5 } = {}) => {
    try {
      const cacheKey = `${lang}:${page}:${per_page}`;
      const cachedEntry = get().lessonsCache?.[cacheKey];

      if (cachedEntry) {
        set({
          lessons: cachedEntry.lessons,
          pagination: cachedEntry.pagination,
          isLoading: false,
          error: null,
        });
        return cachedEntry.response;
      }

      set({ isLoading: true, error: null });
      const response = await fetchPrivateLessonsApi({ lang, page, per_page });

      if (response?.status && Array.isArray(response?.data)) {
        const nextPagination = response.pagination ?? {
          current_page: page,
          last_page: 1,
          per_page,
          total: response.data.length,
        };

        set({
          lessons: response.data,
          pagination: nextPagination,
          lessonsCache: {
            ...get().lessonsCache,
            [cacheKey]: {
              lessons: response.data,
              pagination: nextPagination,
              response,
            },
          },
          isLoading: false,
        });
        return response;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch private lessons";
      set({
        lessons: [],
        pagination: { current_page: 1, last_page: 1, per_page: 5, total: 0 },
        isLoading: false,
        error: message,
      });
      toast.error(message);
      return null;
    }
  },

  getPrivateLessonOptions: async (lessonId) => {
    try {
      if (!lessonId) throw new Error("Lesson id is required");
      set({ isOptionsLoading: true, error: null });
      const response = await getPrivateLessonOptionsApi(lessonId);

      if (response?.status && Array.isArray(response?.data)) {
        set((state) => ({
          optionsByLessonId: {
            ...state.optionsByLessonId,
            [lessonId]: response.data,
          },
          isOptionsLoading: false,
        }));
        return response.data;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch lesson options";
      set({ isOptionsLoading: false, error: message });
      toast.error(message);
      return [];
    }
  },

  enrollPrivateLesson: async (payload) => {
    try {
      set({ isEnrolling: true, error: null });
      const response = await enrollPrivateLessonApi(payload);
      set({ isEnrolling: false, enrollment: response });
      toast.success("Enrollment created successfully");
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to enroll";
      set({ isEnrolling: false, error: message });
      toast.error(message);
      return null;
    }
  },
}));

export default usePrivateCoursesStore;
