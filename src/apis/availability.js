import api from "./config.js";

// Get available dates/times
export const getAvailableDates = async () => {
  try {
    const response = await api.get(`/availabilities`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booked appointments
export const getBookedAppointments = async (month, year) => {
  try {
    const response = await api.get(`/appointments?month=${month}&year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
