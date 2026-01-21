import { create } from "zustand";
import {
    getBroadcasts as getBroadcastsApi,
    getBroadcastById as getBroadcastByIdApi
} from "../apis/broadcasts.js";

const useBroadcastsStore = create((set) => ({
    // State
    broadcasts: [],
    singleBroadcast: null,
    pagination: null,
    isLoading: false,
    error: null,

    // Actions
    setBroadcasts: (broadcasts) => set({ broadcasts }),
    setPagination: (pagination) => set({ pagination }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),

    // Fetch broadcasts
    fetchBroadcasts: async (lang = "ar", page = 1, perPage = 6) => {
        try {
            set({ isLoading: true, error: null });

            const response = await getBroadcastsApi(lang, page, perPage);
            // The user refined the format: { status, data: [], pagination: {} }
            if (response?.status && Array.isArray(response?.data)) {
                const newData = response.data;
                set((state) => ({
                    broadcasts: page === 1 ? newData : [...state.broadcasts, ...newData],
                    pagination: response.pagination || null,
                    isLoading: false,
                }));
                return newData;
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (error) {
            console.error("Fetch broadcasts failed:", error.message);
            set({ error: error.message, isLoading: false });
            return [];
        }
    },

    // Fetch single broadcast
    fetchBroadcastById: async (id, lang = "ar") => {
        try {
            set({ isLoading: true, error: null, singleBroadcast: null });

            const response = await getBroadcastByIdApi(id, lang);
            // Detail API returns the object directly as shown in requirements
            if (response && response.id) {
                set({
                    singleBroadcast: response,
                    isLoading: false,
                });
                return response;
            } else if (response?.data && response?.status) {
                // Fallback if it's wrapped in data
                set({
                    singleBroadcast: response.data,
                    isLoading: false,
                });
                return response.data;
            } else {
                throw new Error("Invalid broadcast detail format");
            }
        } catch (error) {
            console.error("Fetch broadcast by id failed:", error.message);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },
}));

export default useBroadcastsStore;
