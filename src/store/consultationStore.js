import { create } from "zustand";
import { createConsultationCheckout as createConsultationCheckoutApi } from "../apis/consultation.js";

const useConsultationStore = create((set, get) => ({
  // State
  isLoading: false,
  error: null,

  // Actions
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Create consultation checkout
  createConsultationCheckout: async (
    name,
    email,
    phone,
    currency = "usd",
    returnUrl,
    cancelUrl
  ) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createConsultationCheckoutApi(
        name,
        email,
        phone,
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
        "Failed to create consultation checkout";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));

export default useConsultationStore;


