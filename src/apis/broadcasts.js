import api from "./config.js";

// Get broadcasts by language and page
export const getBroadcasts = async (lang = "ar", page = 1, perPage = 6) => {
    try {
        const response = await api.get(`/podcasts/all`, {
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
        const response = await api.get(`/podcasts/show/${id}`, { params: { lang } });
        return response.data;
    } catch (error) {
        throw error;
    }
};
