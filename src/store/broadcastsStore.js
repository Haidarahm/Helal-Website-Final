import { create } from "zustand";
import { getBroadcasts as getBroadcastsApi } from "../apis/broadcasts.js";

const useBroadcastsStore = create((set) => ({
    // State
    broadcasts: [],
    pagination: null,
    isLoading: false,
    error: null,

    // Actions
    setBroadcasts: (broadcasts) => set({ broadcasts }),
    setPagination: (pagination) => set({ pagination }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),

    // Fetch broadcasts (with mock data fallthrough for demonstration)
    fetchBroadcasts: async (lang = "ar", page = 1, perPage = 6) => {
        try {
            set({ isLoading: true, error: null });

            // Attempt real API call
            try {
                const response = await getBroadcastsApi(lang, page, perPage);
                if (response?.status && response?.data) {
                    const newData = response.data;
                    set((state) => ({
                        broadcasts: page === 1 ? newData : [...state.broadcasts, ...newData],
                        pagination: response.pagination || null,
                        isLoading: false,
                    }));
                    return newData;
                }
            } catch (apiError) {
                console.warn("Broadcasts API failed, using mock data:", apiError.message);
            }

            // Mock Data Fallthrough (since endpoint might not exist)
            // Total 18 items to demonstrate multiple pages of infinite scroll
            const totalItems = 18;
            const mockBroadcasts = Array.from({ length: totalItems }, (_, i) => ({
                id: totalItems - i,
                title: lang === "ar" ? `عنوان البث ${totalItems - i}` : `Broadcast Title ${totalItems - i}`,
                description: lang === "ar"
                    ? `هذا وصف تجريبي للبث رقم ${totalItems - i}. يحتوي على معلومات حول الأسواق والاستثمار وتداول العملات والتحليل الفني.`
                    : `This is a mock description for broadcast ${totalItems - i}. It contains information about markets, investment, forex, and technical analysis.`,
                image: `https://picsum.photos/800/600?random=${totalItems - i + 10}`,
                date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US"),
            }));

            const start = (page - 1) * perPage;
            const paginatedData = mockBroadcasts.slice(start, start + perPage);

            set((state) => ({
                broadcasts: page === 1 ? paginatedData : [...state.broadcasts, ...paginatedData],
                pagination: {
                    current_page: page,
                    per_page: perPage,
                    total: mockBroadcasts.length,
                    last_page: Math.ceil(mockBroadcasts.length / perPage),
                },
                isLoading: false,
            }));

            return paginatedData;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return [];
        }
    },
}));

export default useBroadcastsStore;
