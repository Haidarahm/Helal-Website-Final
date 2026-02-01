import api from "./config.js";

/**
 * Join an Agora session by session name.
 * GET /agora/join/{sessionName}
 * @param {string} sessionName - The session/channel name to join
 * @returns {Promise<{ status: boolean; appId: string; token: string; channelName: string; uid: number; isAdmin: boolean; participants: Array<{ uid: number; name: string; isAdmin: boolean; ... }> }>}
 */
export const joinSession = async (sessionName) => {
  const { data } = await api.get(`/agora/join/${encodeURIComponent(sessionName)}`);
  return data;
};
