import { create } from "zustand";
import { sendEmail as sendEmailApi } from "../apis/contact.js";

const useContactStore = create((set, get) => ({
  // State
  isLoading: false,
  error: null,
  successMessage: null,

  // Actions
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  clearMessages: () => set({ error: null, successMessage: null }),

  // Send email
  sendEmail: async (fullName, email, subject, message) => {
    try {
      set({ isLoading: true, error: null, successMessage: null });
      const response = await sendEmailApi(fullName, email, subject, message);

      // Handle both wrapped and direct response formats
      const responseData = response?.message ? response : response;

      set({
        successMessage:
          responseData?.message || "Your message has been sent successfully!",
        isLoading: false,
      });
      return responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send message";
      set({ error: errorMessage, isLoading: false, successMessage: null });
      throw error;
    }
  },
}));

export default useContactStore;
