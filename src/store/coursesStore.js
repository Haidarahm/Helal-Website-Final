import { create } from "zustand";
import {
  getCourses as getCoursesApi,
  enrollCourse as enrollCourseApi,
  getEnrolledCourses as getEnrolledCoursesApi,
} from "../apis/courses.js";

const useCoursesStore = create((set, get) => ({
  // State
  courses: [],
  enrolledCourses: [],
  isLoading: false,
  error: null,

  // Actions
  setCourses: (courses) => set({ courses }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch courses
  fetchCourses: async (lang = "ar") => {
    try {
      set({ isLoading: true, error: null });
      const response = await getCoursesApi(lang);

      if (response?.status === "success" && response?.courses) {
        set({
          courses: response.courses,
          isLoading: false,
        });
        return response.courses;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch courses";
      set({ error: errorMessage, isLoading: false });
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
      set({ isLoading: true, error: null });
      const response = await enrollCourseApi(
        courseId,
        currency,
        returnUrl,
        cancelUrl
      );

      // Handle both wrapped and direct response formats
      const responseData = response?.status ? response : response;

      set({ isLoading: false });
      return responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to enroll in course";
      set({ error: errorMessage, isLoading: false });
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
