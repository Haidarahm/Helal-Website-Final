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

/**
 * Update hand raise state via backend (if supported).
 * POST /agora/raise-hand { sessionName, raised }
 * @param {string} sessionName
 * @param {boolean} raised
 */
export const raiseHand = async (sessionName, raised) => {
  await api.post("/agora/raise-hand", { sessionName, raised });
};
