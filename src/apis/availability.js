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

// Get available intervals for a specific date
export const getAvailableIntervals = async (date) => {
  try {
    const response = await api.get(`/available-intervals`, {
      params: {
        date: date,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
