import { create } from "zustand";
import {
  fetchOnlineCourses as fetchOnlineCoursesApi,
  fetchMyOnlineCourses as fetchMyOnlineCoursesApi,
  getMyOnlineCourses as getMyOnlineCoursesApi,
  enrollOnlineCourse as enrollOnlineCourseApi,
} from "../../apis/courses/onlineCourses.js";

const defaultPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 5,
  total: 0,
};

const resolvePagination = (pagination, fallback = defaultPagination) => {
  if (!pagination) return fallback;
  return {
    current_page: pagination.current_page ?? fallback.current_page,
    last_page: pagination.last_page ?? fallback.last_page,
    per_page: pagination.per_page ?? fallback.per_page,
    total: pagination.total ?? fallback.total,
  };
};

const useOnlineCoursesStore = create((set) => ({
  onlineCourses: [],
  myOnlineCourses: [],
  pagination: defaultPagination,
  myPagination: defaultPagination,
  isLoading: false,
  isMyCoursesLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchOnlineCourses: async (lang = "ar", page = 1, perPage = 5) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchOnlineCoursesApi(lang, page, perPage);

      if (response?.status && Array.isArray(response?.data)) {
        set({
          onlineCourses: response.data,
          pagination: resolvePagination(response.pagination, {
            ...defaultPagination,
            current_page: page,
            per_page: perPage,
          }),
          isLoading: false,
        });
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch online courses";
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },

  fetchMyOnlineCourses: async (lang = "ar", page = 1) => {
    try {
      set({ isMyCoursesLoading: true, error: null });
      const response = await fetchMyOnlineCoursesApi(lang, page);

      if (response?.status && Array.isArray(response?.data)) {
        set({
          myOnlineCourses: response.data,
          myPagination: resolvePagination(response.pagination, {
            ...defaultPagination,
            current_page: page,
          }),
          isMyCoursesLoading: false,
        });
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch my online courses";
      set({ error: errorMessage, isMyCoursesLoading: false });
      return [];
    }
  },

  // Enroll in an online course
  enrollOnlineCourse: async (
    courseOnlineId,
    currency = "usd",
    returnUrl = "/success",
    cancelUrl = "/cancel"
  ) => {
    try {
      set({ error: null });
      const response = await enrollOnlineCourseApi(
        courseOnlineId,
        currency,
        returnUrl,
        cancelUrl
      );

      // Handle both wrapped and direct response formats
      const responseData = response?.status ? response : response;

      return responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to enroll in online course";
      set({ error: errorMessage });
      throw error;
    }
  },

  // Get my online courses (simplified version with only lang param)
  getMyOnlineCourses: async (lang = "ar") => {
    try {
      set({ isMyCoursesLoading: true, error: null });
      const response = await getMyOnlineCoursesApi(lang);

      if (response?.status && Array.isArray(response?.data)) {
        set({
          myOnlineCourses: response.data,
          myPagination: resolvePagination(response.pagination),
          isMyCoursesLoading: false,
        });
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch my online courses";
      set({ error: errorMessage, isMyCoursesLoading: false });
      return [];
    }
  },
}));

export default useOnlineCoursesStore;
