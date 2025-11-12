import api from "./config.js";

// Register user
export const register = async (data) => {
  try {
    const response = await api.post("/register", {
      name: data.name,
      email: data.email,
      phone_number: data.phone,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (data) => {
  try {
    const response = await api.post("/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send OTP
export const sendOTP = async (data) => {
  try {
    const response = await api.post("/send-otp", {
      email: data.email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (data) => {
  try {
    const response = await api.post("/verify-otp", {
      otp: data.otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset Password
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/reset-password", {
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user personal information
export const getUser = async () => {
  try {
    const response = await api.get("/get/personal-information");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update profile image (multipart/form-data)
export const updateProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profile_image", file);
    const response = await api.post("/update-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change password for authenticated user
export const changePassword = async (data) => {
  try {
    const response = await api.post("/change-password", {
      current_password: data.current_password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
