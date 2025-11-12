import api from "./config.js";

// Send contact email
export const sendEmail = async (fullName, email, subject, message) => {
  try {
    const response = await api.post(`/contact/send`, {
      full_name: fullName,
      email,
      subject,
      message,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
