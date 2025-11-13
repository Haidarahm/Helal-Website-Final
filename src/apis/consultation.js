import api from "./config.js";

// Create consultation checkout
export const createConsultationCheckout = async (
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
    // Convert currency to uppercase (USD or AED)
    const currencyUpper = currency?.toUpperCase() || "USD";

    const response = await api.post(
      `/consultations/create-checkout/${consultationId}`,
      {
        name,
        email,
        phone,
        currency: currencyUpper,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        date,
        start_time: startTime,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConsultationTypes = async (
  lang = "ar",
  page = 1,
  perPage = 5
) => {
  try {
    const response = await api.get(`/consultations/get`, {
      params: {
        lang,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
