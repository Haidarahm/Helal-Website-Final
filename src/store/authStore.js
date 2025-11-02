import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import {
  register as registerApi,
  login as loginApi,
  sendOTP as sendOTPApi,
  verifyOTP as verifyOTPApi,
  resetPassword as resetPasswordApi,
  getUser as getUserApi,
  updateProfileImage as updateProfileImageApi,
  changePassword as changePasswordApi,
} from "../apis/auth.js";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isChangingPassword: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        }),

      setError: (error) => set({ error, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      // Register
      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await registerApi(data);

          // Handle both 'access_token' and 'token' for compatibility
          const token = response.access_token || response.token;

          if (token) {
            localStorage.setItem("token", token);
            get().setAuth(response.user, token);
            toast.success("Registration successful!");
          }

          set({ isLoading: false });
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Login
      login: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginApi(data);

          // Handle both 'access_token' and 'token' for compatibility
          const token = response.access_token || response.token;

          if (token) {
            localStorage.setItem("token", token);
            get().setAuth(response.user, token);
            toast.success("Login successful!");
          }

          set({ isLoading: false });
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || error.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem("token");
        get().clearAuth();
        toast.info("Logged out successfully");
      },

      // Send OTP
      sendOTP: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await sendOTPApi(data);
          set({ isLoading: false });
          toast.success("OTP sent successfully!");
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to send OTP";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Verify OTP
      verifyOTP: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await verifyOTPApi(data);
          set({ isLoading: false });
          toast.success("OTP verified successfully!");
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to verify OTP";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Reset Password
      resetPassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await resetPasswordApi(data);
          set({ isLoading: false });
          toast.success("Password reset successfully!");
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to reset password";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Fetch current user information
      getUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await getUserApi();
          const user = data?.user || data?.data || data || null;
          if (user) {
            set({ user, isAuthenticated: Boolean(get().token) });
          }
          set({ isLoading: false });
          return user;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch user";
          set({ error: errorMessage, isLoading: false });
          // no toast on silent refresh
          return null;
        }
      },

      // Update profile image
      updateProfileImage: async (file) => {
        try {
          set({ isLoading: true, error: null });
          const response = await updateProfileImageApi(file);
          toast.success("Profile image updated.");
          await get().getUser();
          set({ isLoading: false });
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update image";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Change password (requires current password)
      changePassword: async (data) => {
        try {
          set({ isChangingPassword: true, error: null });
          const response = await changePasswordApi(data);
          set({ isChangingPassword: false });
          toast.success("Password changed successfully.");
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to change password";
          set({ error: errorMessage, isChangingPassword: false });
          toast.error(errorMessage);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
