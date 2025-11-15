import { create } from "zustand";
import {
  getAvailableDates as getAvailableDatesApi,
  getBookedAppointments as getBookedAppointmentsApi,
  getAvailableIntervals as getAvailableIntervalsApi,
} from "../apis/availability.js";

const useAvailabilityStore = create((set, get) => ({
  // State
  availabilities: [],
  bookedAppointments: [],
  availableIntervals: null,
  isLoading: false,
  isAppointmentsLoading: false,
  isIntervalsLoading: false,
  error: null,

  // Actions
  setError: (error) =>
    set({ error, isLoading: false, isAppointmentsLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch available dates
  fetchAvailableDates: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getAvailableDatesApi();

      if (
        response?.status === "success" &&
        Array.isArray(response?.Availabilities)
      ) {
        set({
          availabilities: response.Availabilities,
          isLoading: false,
        });
        return response.Availabilities;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch available dates";
      set({
        error: errorMessage,
        isLoading: false,
        availabilities: [],
      });
      return [];
    }
  },

  // Fetch booked appointments
  fetchBookedAppointments: async (month, year) => {
    try {
      set({ isAppointmentsLoading: true, error: null });
      const response = await getBookedAppointmentsApi(month, year);

      if (response?.status && Array.isArray(response?.data)) {
        set({
          bookedAppointments: response.data,
          isAppointmentsLoading: false,
        });
        return response.data;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch booked appointments";
      set({
        error: errorMessage,
        isAppointmentsLoading: false,
        bookedAppointments: [],
      });
      return [];
    }
  },

  // Fetch available intervals for a specific date
  fetchAvailableIntervals: async (date) => {
    try {
      set({ isIntervalsLoading: true, error: null });
      const response = await getAvailableIntervalsApi(date);

      if (response?.status === "success" && response?.data) {
        set({
          availableIntervals: response.data,
          isIntervalsLoading: false,
        });
        return response.data;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch available intervals";
      set({
        error: errorMessage,
        isIntervalsLoading: false,
        availableIntervals: null,
      });
      return null;
    }
  },

  // Clear booked appointments
  clearBookedAppointments: () => set({ bookedAppointments: [] }),

  // Clear availabilities
  clearAvailabilities: () => set({ availabilities: [] }),

  // Clear available intervals
  clearAvailableIntervals: () => set({ availableIntervals: null }),
}));

export default useAvailabilityStore;
