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
    per_page: 10,
    total: 0,
  },
  optionsByLessonId: {},
  enrollment: null,
  isLoading: false,
  isOptionsLoading: false,
  isEnrolling: false,
  error: null,

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
  fetchPrivateLessons: async ({ lang, page = 1, per_page = 10 } = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchPrivateLessonsApi({ lang, page, per_page });

      if (response?.status && Array.isArray(response?.data)) {
        set({
          lessons: response.data,
          pagination: response.pagination ?? {
            current_page: page,
            last_page: 1,
            per_page,
            total: response.data.length,
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
        pagination: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
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
