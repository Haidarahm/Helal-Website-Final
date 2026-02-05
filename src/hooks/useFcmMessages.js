import { useEffect, useRef } from "react";
import { setFcmChannelHandlers, clearFcmChannelHandlers } from "../config/firebase.js";

/**
 * Hook to listen for FCM messages and handle actions.
 * Uses a global router (never unsubscribes) to avoid missing the first message
 * due to React Strict Mode or lazy-load timing.
 * @param {Object} options
 * @param {string} options.channelName - Current channel/session name
 * @param {Object} options.actions - Map of action name to handler: { mute_all: () => {}, unmute_all: () => {} }
 */
export function useFcmMessages({ channelName, actions = {} }) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    if (!channelName) return;

    setFcmChannelHandlers(channelName, (action) => actionsRef.current[action]);

    return () => clearFcmChannelHandlers();
  }, [channelName]);
}
