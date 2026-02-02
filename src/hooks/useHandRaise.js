import { useState, useCallback, useEffect, useRef } from "react";
import AgoraRTM from "agora-rtm-sdk";

const HAND_RAISE_TYPE = "hand_raise";

/**
 * Hand raise signaling via Agora RTM.
 * Publishes { type: 'hand_raise', uid, raised } to channel.
 * Requires backend to provide token with RTM privileges (BuildTokenWithRtm).
 * Falls back to local-only if RTM login fails.
 * @param {{ appId: string; channelName: string; uid: number; token?: string }} params
 * @returns {{ handRaised: boolean; handRaisedUids: Set<number>; toggleHandRaise: () => void; rtmReady: boolean }}
 */
export function useHandRaise({ appId, channelName, uid, token } = {}) {
  const [handRaised, setHandRaised] = useState(false);
  const [handRaisedUids, setHandRaisedUids] = useState(() => new Set());
  const [rtmReady, setRtmReady] = useState(false);
  const rtmRef = useRef(null);
  const channelRef = useRef(null);

  const uidStr = String(uid ?? "");

  const handleMessage = useCallback((event) => {
    try {
      const msg = typeof event.message === "string" ? JSON.parse(event.message) : null;
      if (msg?.type !== HAND_RAISE_TYPE || msg?.uid == null) return;
      const pubUid = Number(msg.uid);
      setHandRaisedUids((prev) => {
        const next = new Set(prev);
        if (msg.raised) next.add(pubUid);
        else next.delete(pubUid);
        return next;
      });
    } catch (_) {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (!appId || !channelName || uid == null) return;

    let rtm = null;
    let subscribed = false;

    const connect = async () => {
      try {
        const { RTM } = AgoraRTM;
        rtm = new RTM(appId, uidStr);
        rtmRef.current = rtm;

        rtm.addEventListener("message", handleMessage);

        await rtm.login(token ? { token } : {});
        await rtm.subscribe(channelName);
        channelRef.current = channelName;
        subscribed = true;
        setRtmReady(true);
      } catch (err) {
        console.warn("[HandRaise] RTM connect failed, using local-only:", err?.message ?? err);
        setRtmReady(false);
      }
    };

    connect();

    return () => {
      rtmRef.current = null;
      channelRef.current = null;
      setRtmReady(false);
      if (rtm) {
        try {
          rtm.removeEventListener?.("message", handleMessage);
          if (subscribed && channelName) rtm.unsubscribe(channelName).catch(() => {});
          rtm.logout().catch(() => {});
        } catch (_) {}
      }
    };
  }, [appId, channelName, uidStr, token, handleMessage]);

  const publishHandRaise = useCallback(
    (raised) => {
      const rtm = rtmRef.current;
      const ch = channelRef.current;
      if (!rtm || !ch) return;
      const payload = JSON.stringify({ type: HAND_RAISE_TYPE, uid: Number(uid), raised });
      rtm.publish(ch, payload).catch(() => {});
    },
    [uid]
  );

  // Sync local hand state when RTM becomes ready
  useEffect(() => {
    if (rtmReady && handRaised) publishHandRaise(true);
  }, [rtmReady, handRaised, publishHandRaise]);

  const toggleHandRaise = useCallback(() => {
    setHandRaised((prev) => {
      const next = !prev;
      publishHandRaise(next);
      return next;
    });
  }, [publishHandRaise]);

  return { handRaised, handRaisedUids, toggleHandRaise, rtmReady };
}
