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

    // Fetch single broadcast
    fetchBroadcastById: async (id, lang = "ar") => {
        try {
            set({ isLoading: true, error: null, singleBroadcast: null });

            // Attempt real API call
            try {
                const response = await getBroadcastByIdApi(id, lang);
                if (response?.status && response?.data) {
                    set({
                        singleBroadcast: response.data,
                        isLoading: false,
                    });
                    return response.data;
                }
            } catch (apiError) {
                console.warn("Single Broadcast API failed, using mock data:", apiError.message);
            }

            // Mock Data Fallthrough
            const mockBroadcast = {
                id: parseInt(id),
                title: lang === "ar" ? `عنوان البث رقم ${id}` : `Broadcast Title ${id}`,
                description: lang === "ar"
                    ? `هذا هو الوصف الكامل للبث رقم ${id}. محتوى تعليمي شامل حول استراتيجيات التداول والتحليل المالي المتقدم. سوف نتعلم في هذا الفيديو كيفية التعامل مع تقلبات السوق بفعالية.`
                    : `This is the full description for broadcast ${id}. Comprehensive educational content about trading strategies and advanced financial analysis. In this video, we will learn how to handle market volatility effectively.`,
                video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
                date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US"),
                image: `https://picsum.photos/1200/600?random=${id}`,
            };

            set({
                singleBroadcast: mockBroadcast,
                isLoading: false,
            });

            return mockBroadcast;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return null;
        }
    },
}));

export default useBroadcastsStore;
