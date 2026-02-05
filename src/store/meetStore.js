import { create } from "zustand";
import { joinSession as joinSessionApi } from "../apis/meet.js";

const KICKED_SESSIONS_KEY = "meet_kicked_sessions";

function getKickedSessions() {
  try {
    const raw = localStorage.getItem(KICKED_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function markKickedInStorage(sessionName) {
  const obj = getKickedSessions();
  obj[sessionName] = true;
  localStorage.setItem(KICKED_SESSIONS_KEY, JSON.stringify(obj));
}

function isKickedInStorage(sessionName) {
  return Boolean(getKickedSessions()[sessionName]);
}

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

  markKicked: (sessionName) => {
    markKickedInStorage(sessionName);
  },

  isKicked: (sessionName) => isKickedInStorage(sessionName),

  /**
   * Join an Agora session by name.
   * @param {string} sessionName
   * @returns {Promise<{ appId: string; token: string; channelName: string; uid: number; isAdmin: boolean; participants: Array } | null>}
   */
  joinSession: async (sessionName) => {
    if (get().isKicked(sessionName)) {
      const msg = "You have been removed from this session";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
    const existing = get().session;
    if (existing?.channelName && existing?.token && existing?.appId) {
      return existing;
    }
    try {
      set({ isLoading: true, error: null });
      const response = await joinSessionApi(sessionName);
      const payload = response?.data ?? response;
      if (
        response?.status &&
        payload?.appId &&
        payload?.token != null &&
        payload?.uid != null
      ) {
        const raw = payload.participants ?? [];
        const participants = Array.isArray(raw) ? raw : Object.values(raw);
        set({
          session: {
            appId: payload.appId,
            token: payload.token,
            channelName: sessionName,
            uid: payload.uid,
            isAdmin: payload.isAdmin ?? false,
            participants,
            serverTime: payload.serverTime,
          },
          isLoading: false,
        });
        return get().session;
      }
      throw new Error(response?.message ?? "Invalid token response");
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Failed to join session";
      set({ error: msg, isLoading: false });
      return null;
    }
  },
}));

export default useMeetStore;
