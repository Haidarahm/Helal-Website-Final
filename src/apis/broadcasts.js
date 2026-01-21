import api from "./config.js";

// Get broadcasts by language and page
export const getBroadcasts = async (lang = "ar", page = 1, perPage = 6) => {
    try {
        // Note: This endpoint might not exist yet, we will mock it in the store if it fails
        // or if you want to use local mock data, we can define it in the store directly.
        const response = await api.get(`/broadcasts`, {
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

export const getBroadcastById = async (id, lang = "ar") => {
    try {
        const response = await api.get(`/broadcasts/${id}`, { params: { lang } });
        return response.data;
    } catch (error) {
        throw error;
    }
};
