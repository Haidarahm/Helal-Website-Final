import { create } from "zustand";
import {
  createConsultationCheckout as createConsultationCheckoutApi,
  getConsultationTypes as getConsultationTypesApi,
} from "../apis/consultation.js";

const defaultPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 5,
  total: 0,
};

const useConsultationStore = create((set, get) => ({
  // State
  isLoading: false,
  isTypesLoading: false,
  consultationTypes: [],
  pagination: defaultPagination,
  error: null,

  // Actions
  setError: (error) => set({ error, isLoading: false, isTypesLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch consultation types
  fetchConsultationTypes: async (lang = "ar", page = 1, perPage = 5) => {
    try {
      set({ isTypesLoading: true, error: null });
      const response = await getConsultationTypesApi(lang, page, perPage);

      if (response?.status && Array.isArray(response?.data)) {
        set({
          consultationTypes: response.data,
          pagination: response.pagination
            ? {
                current_page:
                  response.pagination.current_page ??
                  defaultPagination.current_page,
                last_page:
                  response.pagination.last_page ?? defaultPagination.last_page,
                per_page:
                  response.pagination.per_page ?? defaultPagination.per_page,
                total: response.pagination.total ?? defaultPagination.total,
              }
            : { ...defaultPagination, current_page: page, per_page: perPage },
          isTypesLoading: false,
        });
        return response.data;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch consultation types";
      set({
        error: errorMessage,
        isTypesLoading: false,
        consultationTypes: [],
      });
      return [];
    }
  },

  // Create consultation checkout
  createConsultationCheckout: async (
    name,
    email,
    phone,
    currency = "USD",
    returnUrl,
    cancelUrl,
    consultationId,
    date,
    startTime
  ) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createConsultationCheckoutApi(
        name,
        email,
        phone,
        currency,
        returnUrl,
        cancelUrl,
        consultationId,
        date,
        startTime
      );

      // Handle both wrapped and direct response formats
      const responseData = response?.status ? response : response;

      set({ isLoading: false });
      return responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create consultation checkout";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));

export default useConsultationStore;
