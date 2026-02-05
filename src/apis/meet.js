import api from "./config.js";

/**
 * Get Agora token for a session.
 * POST /agora/token
 * @param {string} sessionName - The session/channel name to join
 * @returns {Promise<{ status: boolean; message: string; data: { token: string; uid: number; appId: string } }>}
 */
export const joinSession = async (sessionName) => {
  const { data } = await api.post("/agora/token", {
    channelName: sessionName,
  });
  return data;
};
