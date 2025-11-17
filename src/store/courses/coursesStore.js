import { create } from "zustand";
import {
  getCourses as getCoursesApi,
  enrollCourse as enrollCourseApi,
  getEnrolledCourses as getEnrolledCoursesApi,
} from "../../apis/courses/courses";

const useCoursesStore = create((set, get) => ({
  // State
  courses: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
  },
  enrolledCourses: [],
  isLoading: false,
  error: null,
  coursesCache: {},

  // Actions
  setCourses: (courses) => set({ courses }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch courses (offline) with pagination
  fetchCourses: async (lang = "ar", page = 1, perPage = 5) => {
    try {
      const cacheKey = `${lang}:${page}:${perPage}`;
      const cachedEntry = get().coursesCache?.[cacheKey];

      if (cachedEntry) {
        set({
          courses: cachedEntry.courses,
          pagination: cachedEntry.pagination,
          isLoading: false,
          error: null,
        });
        return cachedEntry.courses;
      }

      set({ isLoading: true, error: null });
      const response = await getCoursesApi(lang, page, perPage);

      if (response?.status === true && Array.isArray(response?.data)) {
        const nextPagination = response.pagination ?? {
          current_page: page,
          last_page: 1,
          per_page: perPage,
          total: response.data.length,
        };

        set({
          courses: response.data,
          pagination: nextPagination,
          coursesCache: {
            ...get().coursesCache,
            [cacheKey]: {
              courses: response.data,
              pagination: nextPagination,
            },
          },
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
        "Failed to fetch courses";
      set({
        error: errorMessage,
        isLoading: false,
        pagination: { current_page: 1, last_page: 1, per_page: 5, total: 0 },
        courses: [],
      });
      return [];
    }
  },

  // Enroll in a course
  enrollCourse: async (
    courseId,
    currency = "usd",
    returnUrl = "/success",
    cancelUrl = "/cancel"
  ) => {
    try {
      set({ error: null });
      const response = await enrollCourseApi(
        courseId,
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
        "Failed to enroll in course";
      set({ error: errorMessage });
      throw error;
    }
  },

  // Fetch enrolled courses
  fetchEnrolledCourses: async (lang = "ar") => {
    try {
      set({ isLoading: true, error: null });
      const response = await getEnrolledCoursesApi(lang);

      if (response?.status === "success" && response?.enroll_courses) {
        set({
          enrolledCourses: response.enroll_courses,
          isLoading: false,
        });
        return response.enroll_courses;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch enrolled courses";
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },
}));

export default useCoursesStore;
