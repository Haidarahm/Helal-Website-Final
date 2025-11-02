import api from "./config.js";

// Create consultation checkout
export const createConsultationCheckout = async (
  name,
  email,
  phone,
  currency = "usd",
  returnUrl,
  cancelUrl
) => {
  try {
    const response = await api.post(`/api/consultation/checkout`, {
      name,
      email,
      phone,
      currency,
      return_url: returnUrl,
      cancel_url: cancelUrl,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};





