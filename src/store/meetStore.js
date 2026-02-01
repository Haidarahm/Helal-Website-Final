import { create } from "zustand";
import { joinSession as joinSessionApi } from "../apis/meet.js";

const useMeetStore = create((set, get) => ({
  // State
  session: null,
  isLoading: false,
  error: null,

  // Actions
  setSession: (session) => set({ session }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  clearSession: () =>
    set({
      session: null,
      error: null,
    }),

  /**
   * Join an Agora session by name.
   * @param {string} sessionName
   * @returns {Promise<{ status: boolean; appId: string; token: string; channelName: string; uid: number; isAdmin: boolean; participants: Array } | null>}
   */
  joinSession: async (sessionName) => {
    try {
      set({ isLoading: true, error: null });
      const data = await joinSessionApi(sessionName);
      if (data?.status && data?.appId && data?.token != null && data?.channelName) {
        const raw = data.participants ?? [];
        const participants = Array.isArray(raw) ? raw : Object.values(raw);
        set({
          session: {
            appId: data.appId,
            token: data.token,
            channelName: data.channelName,
            uid: data.uid,
            isAdmin: data.isAdmin ?? false,
            participants,
            serverTime: data.serverTime,
          },
          isLoading: false,
        });
        return get().session;
      }
      throw new Error("Invalid join response");
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Failed to join session";
      set({ error: msg, isLoading: false });
      return null;
    }
  },
}));

export default useMeetStore;
