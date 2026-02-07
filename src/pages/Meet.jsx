import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
  Wifi,
  Users,
  AlertCircle,
  Volume2,
  X,
  Hand,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import { useMeetStore } from "../store";
import useAuthStore from "../store/authStore.js";
import { useFcmMessages } from "../hooks/useFcmMessages.js";
import { db } from "../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useVolumeLevel,
  useNetworkQuality,
  useConnectionState,
  useRTCClient,
  RemoteUser,
} from "agora-rtc-react";
import "./meet.css";

// Disable Agora SDK console logs
AgoraRTC.setLogLevel(4);

const RemoteUserCover = () => (
  <div className="meet-cover-avatar">
    <User size={48} />
  </div>
);

const REMOTE_VIDEO_CONFIG = { fit: "cover" };

function MicTestModal({ isOpen, onClose, isRTL }) {
  const [testLevel, setTestLevel] = useState(0);
  const [error, setError] = useState(null);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setTestLevel(0);

    let cancelled = false;
    const run = async () => {
      try {
        const track = await AgoraRTC.createMicrophoneAudioTrack();
        if (cancelled) {
          track.close();
          return;
        }
        trackRef.current = track;
        await track.play();
        intervalRef.current = setInterval(() => {
          if (trackRef.current) {
            const level = trackRef.current.getVolumeLevel?.() ?? 0;
            setTestLevel(level);
          }
        }, 100);
      } catch (err) {
        if (!cancelled) setError(err?.message ?? (isRTL ? "فشل الوصول للميكروفون" : "Failed to access microphone"));
      }
    };
    run();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (trackRef.current) {
        trackRef.current.close();
        trackRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-secondary rounded-2xl shadow-xl max-w-sm w-full p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
            <Volume2 size={20} className="text-primary" />
            {isRTL ? "اختبار الميكروفون" : "Mic Test"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-accent"
            aria-label={isRTL ? "إغلاق" : "Close"}
          >
            <X size={20} />
          </button>
        </div>
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <>
            <p className="text-sm text-accent/70 mb-3">
              {isRTL ? "تحدث لمعاينة مستوى الصوت" : "Speak to see the level"}
            </p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${Math.min(100, testLevel * 200 + 5)}%` }}
              />
            </div>
            <p className="text-xs text-accent/50 mt-2">
              {testLevel > 0.05
                ? isRTL
                  ? "الميكروفون يعمل بشكل صحيح"
                  : "Microphone is working"
                : isRTL
                  ? "لم يتم اكتشاف صوت"
                  : "No sound detected"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function networkQualityLabel(up, down) {
  const avg = (up + down) / 2;
  if (avg >= 5) return { text: "Excellent", cls: "excellent" };
  if (avg >= 3) return { text: "Good", cls: "good" };
  if (avg >= 1) return { text: "Fair", cls: "fair" };
  return { text: "Poor", cls: "poor" };
}

function connectionStateLabel(state, isRTL) {
  const labels = {
    DISCONNECTED: isRTL ? "غير متصل" : "Disconnected",
    CONNECTING: isRTL ? "جاري الاتصال…" : "Connecting…",
    RECONNECTING: isRTL ? "إعادة الاتصال…" : "Reconnecting…",
    CONNECTED: isRTL ? "متصل" : "Connected",
    DISCONNECTING: isRTL ? "جاري الخروج…" : "Leaving…",
  };
  return labels[state] ?? state;
}

function MeetControlBar({
  micOn,
  micLevel,
  cameraOn,
  isLeaving,
  micHiddenByAdmin,
  handRaised,
  onMicToggle,
  onCameraToggle,
  onRaiseHand,
  onMicTest,
  onLeave,
  isRTL,
}) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 py-4 px-4 bg-secondary-light/90 backdrop-blur border-t border-white/5">
      <button
        type="button"
        onClick={onMicTest}
        disabled={isLeaving}
        className="meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 min-w-[64px] disabled:opacity-50 disabled:pointer-events-none"
        title={isRTL ? "اختبار الميكروفون" : "Test mic"}
      >
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-accent hover:bg-white/15">
          <Volume2 size={22} />
        </span>
        <span className="text-[11px] text-accent/70 hidden sm:block">
          {isRTL ? "اختبار" : "Test"}
        </span>
      </button>

      {!micHiddenByAdmin && (
        <button
          type="button"
          onClick={onMicToggle}
          disabled={isLeaving}
          className="meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 min-w-[64px] disabled:opacity-50 disabled:pointer-events-none"
          title={micOn ? (isRTL ? "كتم الصوت" : "Mute") : (isRTL ? "تشغيل الصوت" : "Unmute")}
        >
          <span
            className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
              micOn
                ? "bg-white/10 text-accent hover:bg-white/15"
                : "bg-red-500/80 text-white"
            }`}
          >
            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
          </span>
          {micOn && (
            <div className="meet-mic-level w-10">
              <div
                className="meet-mic-level-bar"
                style={{ width: `${Math.min(100, (micLevel || 0) * 2 + 10)}%` }}
              />
            </div>
          )}
          <span className="text-[11px] text-accent/70 hidden sm:block">
            {micOn ? (isRTL ? "ميكروفون" : "Mic") : (isRTL ? "مكتوم" : "Muted")}
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={onCameraToggle}
        disabled={isLeaving}
        className={`meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 min-w-[64px] disabled:opacity-50 disabled:pointer-events-none ${
          cameraOn ? "ring-2 ring-primary/60" : ""
        }`}
        title={
          cameraOn
            ? (isRTL ? "إيقاف الكاميرا" : "Turn off camera")
            : (isRTL ? "تشغيل الكاميرا" : "Turn on camera")
        }
      >
        <span
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            cameraOn ? "bg-primary/30 text-primary" : "bg-white/10 text-accent hover:bg-white/15"
          }`}
        >
          {cameraOn ? <Video size={22} /> : <VideoOff size={22} />}
        </span>
        <span className="text-[11px] text-accent/70 hidden sm:block">
          {cameraOn ? (isRTL ? "كاميرا" : "Camera") : (isRTL ? "مشاركة" : "Share")}
        </span>
      </button>

      <button
        type="button"
        onClick={onRaiseHand}
        disabled={isLeaving}
        className={`meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 min-w-[64px] disabled:opacity-50 disabled:pointer-events-none ${
          handRaised ? "ring-2 ring-primary/60" : ""
        }`}
        title={handRaised ? (isRTL ? "خفض اليد" : "Lower hand") : (isRTL ? "رفع اليد" : "Raise hand")}
      >
        <span
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            handRaised ? "bg-primary/30 text-primary" : "bg-white/10 text-accent hover:bg-white/15"
          }`}
        >
          <Hand size={22} />
        </span>
        <span className="text-[11px] text-accent/70 hidden sm:block">
          {handRaised ? (isRTL ? "مرفوعة" : "Raised") : (isRTL ? "رفع" : "Hand")}
        </span>
      </button>

      <button
        type="button"
        onClick={onLeave}
        disabled={isLeaving}
        className="meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-red-500/20 min-w-[64px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title={isRTL ? "إنهاء المكالمة" : "Leave call"}
      >
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500 text-white hover:bg-red-600">
          {isLeaving ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <PhoneOff size={22} />
          )}
        </span>
        <span className="text-[11px] text-accent/70 hidden sm:block">
          {isLeaving ? (isRTL ? "جاري الخروج…" : "Leaving…") : (isRTL ? "إنهاء" : "Leave")}
        </span>
      </button>
    </div>
  );
}

function MeetHeader({ sessionName, connectionState, networkQuality, participantCount, isRTL }) {
  const nq = networkQuality
    ? networkQualityLabel(
        networkQuality.uplinkNetworkQuality ?? 0,
        networkQuality.downlinkNetworkQuality ?? 0
      )
    : null;

  return (
    <header className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-secondary-light/50 border-b border-white/5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 text-primary">
          <Video size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-accent font-medium truncate">{sessionName}</p>
          <p className="text-xs text-accent/60 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 ${
                connectionState === "CONNECTED"
                  ? "text-green-500"
                  : connectionState === "RECONNECTING"
                    ? "text-amber-500"
                    : "text-accent/60"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connectionState === "CONNECTED"
                    ? "bg-green-500"
                    : connectionState === "RECONNECTING"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-accent/50"
                }`}
              />
              {connectionStateLabel(connectionState, isRTL)}
            </span>
            {nq && (
              <>
                <span className="text-accent/40">·</span>
                <span
                  className={`meet-network-pill ${nq.cls} flex items-center gap-1`}
                  title={`Uplink: ${networkQuality?.uplinkNetworkQuality ?? "-"} · Downlink: ${networkQuality?.downlinkNetworkQuality ?? "-"} · RTT: ${networkQuality?.delay ?? "-"} ms`}
                >
                  <Wifi size={12} />
                  {nq.text}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-accent/70">
        <Users size={16} />
        <span className="text-sm font-medium">{1 + (participantCount ?? 0)}</span>
        <span className="text-xs hidden sm:inline">
          {isRTL ? "مشارك" : "participants"}
        </span>
      </div>
    </header>
  );
}

function AgoraMeetView({ sessionName, isRTL }) {
  const navigate = useNavigate();
  const client = useRTCClient();
  const joinSession = useMeetStore((s) => s.joinSession);
  const clearSession = useMeetStore((s) => s.clearSession);
  const markKicked = useMeetStore((s) => s.markKicked);
  const raiseHand = useMeetStore((s) => s.raiseHand);
  const session = useMeetStore((s) => s.session);
  const user = useAuthStore((s) => s.user);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [micTestOpen, setMicTestOpen] = useState(false);
  const [micHiddenByAdmin, setMicHiddenByAdmin] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  const joinSessionRef = useRef(joinSession);
  joinSessionRef.current = joinSession;

  const fetchJoinArgs = useCallback(async () => {
    const s = await joinSessionRef.current(sessionName);
    if (!s) throw new Error("Failed to join session");
    return {
      appid: s.appId,
      channel: s.channelName,
      token: s.token,
      uid: s.uid,
    };
  }, [sessionName]);

  const { error: joinError, isConnected, isLoading } = useJoin(
    fetchJoinArgs,
    !!sessionName
  );

  const connectionState = useConnectionState(client);

  // Fallback: use connectionState if isConnected lags; timeout to escape stuck loading
  const [loadTimeout, setLoadTimeout] = useState(false);
  useEffect(() => {
    if (!sessionName) return;
    const t = setTimeout(() => setLoadTimeout(true), 20000);
    return () => clearTimeout(t);
  }, [sessionName]);
  const networkQuality = useNetworkQuality(client);

  const { localCameraTrack } = useLocalCameraTrack(isConnected && cameraOn);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isConnected);

  const micLevel = useVolumeLevel(localMicrophoneTrack ?? undefined);

  // Throttle mic level for UI to prevent rapid re-renders/glitches
  const [displayMicLevel, setDisplayMicLevel] = useState(0);
  const lastMicUpdateRef = useRef(0);
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    const raw = micLevel ?? 0;
    const now = Date.now();
    const shouldUpdate =
      !hasInitializedRef.current || now - lastMicUpdateRef.current >= 120;
    if (shouldUpdate) {
      hasInitializedRef.current = true;
      lastMicUpdateRef.current = now;
      setDisplayMicLevel(raw);
    }
  }, [micLevel]);

  const tracksToPublish = useMemo(() => {
    const list = [];
    // Only publish mic when enabled - Agora cannot publish a disabled track
    if (micOn && localMicrophoneTrack) list.push(localMicrophoneTrack);
    if (cameraOn && localCameraTrack) list.push(localCameraTrack);
    return list;
  }, [micOn, localMicrophoneTrack, cameraOn, localCameraTrack]);
  usePublish(tracksToPublish, isConnected);
  const allRemoteUsers = useRemoteUsers(client);

  // participants is array: [{ uid, name, isAdmin, ... }, ...]
  const participantsArray = useMemo(
    () => (Array.isArray(session?.participants) ? session.participants : []),
    [session?.participants]
  );

  const findParticipantByUid = useCallback(
    (uid) => participantsArray.find((p) => p.uid === uid) ?? null,
    [participantsArray]
  );

  // Only include users with published streams to avoid "no such stream id" errors
  const usersWithStreams = useMemo(
    () => allRemoteUsers.filter((u) => u.hasAudio || u.hasVideo),
    [allRemoteUsers]
  );

  // Show admin users when we have participant metadata; otherwise show all remote users
  const remoteUsers = useMemo(() => {
    if (participantsArray.length === 0) return usersWithStreams;
    return usersWithStreams.filter((user) => {
      const p = findParticipantByUid(user.uid);
      return p?.isAdmin === true;
    });
  }, [usersWithStreams, findParticipantByUid, participantsArray]);

  // When we're admin, play audio for participants (non-admin) so we can hear them
  const participantsToHear = useMemo(() => {
    if (!session?.isAdmin) return [];
    if (participantsArray.length === 0) return usersWithStreams;
    return usersWithStreams.filter((user) => {
      const p = findParticipantByUid(user.uid);
      return p?.isAdmin === false;
    });
  }, [session?.isAdmin, usersWithStreams, findParticipantByUid, participantsArray]);

  useEffect(() => {
    return () => clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (!isConnected) return;
    localMicrophoneTrack?.setEnabled(micOn);
  }, [isConnected, micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (!isConnected) return;
    localCameraTrack?.setEnabled(cameraOn);
  }, [isConnected, cameraOn, localCameraTrack]);

  // Firebase listener for real-time session updates
  useEffect(() => {
    if (!sessionName) return;

    console.log("🔥 Firebase: Starting listener for session:", sessionName);

    // Listen to the session document in Firestore
    const sessionDocRef = doc(db, "sessions", sessionName);
    const unsubscribe = onSnapshot(
      sessionDocRef,
      (docSnapshot) => {
        console.log("🔥 Firebase snapshot received");
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("🔥 Firebase session update:", data);
        } else {
          console.log("🔥 Firebase: Session document does not exist at path: sessions/" + sessionName);
        }
      },
      (error) => {
        console.error("🔥 Firebase listener error:", error);
      }
    );

    return () => {
      console.log("🔥 Firebase: Stopping listener");
      unsubscribe();
    };
  }, [sessionName]);

  const handleLeave = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    clearSession();
    navigate(-1);
    // Fire-and-forget: attempt leave in background (don't block - Agora calls can hang)
    if (isConnected) {
      try {
        if (client.localTracks?.length > 0) {
          client.unpublish(client.localTracks).catch(() => {});
        }
        client.leave().catch(() => {});
      } catch (_) {}
    }
  }, [client, isConnected, isLeaving, clearSession, navigate]);

  const leaveRef = useRef(handleLeave);
  leaveRef.current = handleLeave;

  const handleMicToggle = useCallback(() => setMicOn((v) => !v), []);
  const handleCameraToggle = useCallback(() => setCameraOn((v) => !v), []);

  const handleRaiseHand = useCallback(() => {
    setHandRaised((v) => {
      const next = !v;
      raiseHand(sessionName).catch(() => {});
      return next;
    });
  }, [sessionName, raiseHand]);

  const runKick = useCallback(() => {
    markKicked(sessionName);
    leaveRef.current?.();
  }, [sessionName, markKicked]);

  // Check if current user is the target (compare Agora UID)
  const isTargetUser = useCallback(
    (payloadUid, payloadUserId, data) => {
      const payloadId = payloadUid ?? payloadUserId;
      const myAgoraUid = session?.uid;
      const match = payloadId != null
        && myAgoraUid != null
        && String(myAgoraUid) === String(payloadId);
      console.log("🔊 FCM isTargetUser:", {
        action: data?.action,
        payloadUid,
        payloadUserId,
        myAgoraUid,
        sessionName,
        match,
      });
      return match;
    },
    [session?.uid]
  );

  const runKickRef = useRef(runKick);
  const isTargetUserRef = useRef(isTargetUser);
  runKickRef.current = runKick;
  isTargetUserRef.current = isTargetUser;

  // FCM: handle mute_all, unmute_all, mute_participant, unmute_participant, kick_participant (foreground)
  useFcmMessages({
    channelName: sessionName,
    actions: {
      mute_all: () => {
        console.log("🔊 FCM mute_all (foreground)");
        setMicOn(false);
        setMicHiddenByAdmin(true);
      },
      unmute_all: () => {
        console.log("🔊 FCM unmute_all (foreground)");
        setMicOn(true);
        setMicHiddenByAdmin(false);
      },
      mute_participant: (data) => {
        const ok = isTargetUser(data?.uid, data?.userId, data);
        console.log("🔊 FCM mute_participant (foreground):", { ok, data });
        if (ok) {
          setMicOn(false);
          setMicHiddenByAdmin(true);
        }
      },
      unmute_participant: (data) => {
        const ok = isTargetUser(data?.uid, data?.userId, data);
        console.log("🔊 FCM unmute_participant (foreground):", { ok, data });
        if (ok) {
          setMicOn(true);
          setMicHiddenByAdmin(false);
        }
      },
      kick_participant: (data) => {
        const ok = isTargetUser(data?.uid, data?.userId, data);
        console.log("🔊 FCM kick_participant (foreground):", { ok, data });
        if (ok) runKick();
      },
    },
  });

  // Listen for FCM actions from service worker (BroadcastChannel + postMessage for background)
  useEffect(() => {
    const handleFcmAction = (d) => {
      if (d?.channelName !== sessionName) {
        console.log("🔊 FCM handleFcmAction channel mismatch:", {
          payloadChannel: d?.channelName,
          sessionName,
        });
        return;
      }
      const action = d?.action;
      console.log("🔊 FCM handleFcmAction (background):", { action, d });
      if (action === "mute_all") {
        setMicOn(false);
        setMicHiddenByAdmin(true);
      } else if (action === "unmute_all") {
        setMicOn(true);
        setMicHiddenByAdmin(false);
      } else if (action === "mute_participant") {
        const ok = isTargetUserRef.current(d?.uid, d?.userId, d);
        if (ok) {
          setMicOn(false);
          setMicHiddenByAdmin(true);
        }
      } else if (action === "unmute_participant") {
        const ok = isTargetUserRef.current(d?.uid, d?.userId, d);
        if (ok) {
          setMicOn(true);
          setMicHiddenByAdmin(false);
        }
      } else if (action === "kick_participant") {
        const ok = isTargetUserRef.current(d?.uid, d?.userId, d);
        if (ok) runKickRef.current();
      }
    };
    const handler = (event) => {
      const d = event?.data;
      if (d?.type === "FCM_ACTION" || d?.type === "FCM_KICK") {
        handleFcmAction(d?.type === "FCM_KICK" ? { ...d, action: "kick_participant", userId: d?.userId } : d);
      }
    };
    const bc =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("fcm_meet")
        : null;

    navigator.serviceWorker?.addEventListener?.("message", handler);
    bc?.addEventListener?.("message", handler);

    return () => {
      navigator.serviceWorker?.removeEventListener?.("message", handler);
      bc?.removeEventListener?.("message", handler);
      bc?.close?.();
    };
  }, [sessionName]);

  if (joinError) {
    return (
      <div className="meet-container w-full h-full flex flex-col items-center justify-center rounded-2xl p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-400">
            <AlertCircle size={32} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-accent mb-1">
              {isRTL ? "فشل الانضمام" : "Couldn't join"}
            </h2>
            <p className="text-sm text-accent/70">
              {joinError.message || (isRTL ? "تعذر الاتصال بالجلسة." : "Failed to join session.")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use connectionState as source of truth (more reliable than isConnected)
  const isReady = connectionState === "CONNECTED";

  if (loadTimeout && !isReady) {
    return (
      <div className="meet-container w-full h-full flex flex-col items-center justify-center rounded-2xl p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-400">
            <AlertCircle size={32} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-accent mb-1">
              {isRTL ? "استغرق الاتصال وقتاً طويلاً" : "Connection is taking too long"}
            </h2>
            <p className="text-sm text-accent/70">
              {isRTL
                ? "تحقق من اتصالك بالإنترنت وحاول مرة أخرى."
                : "Check your internet connection and try again."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-lg bg-primary text-secondary font-medium hover:opacity-90"
          >
            {isRTL ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="meet-container w-full h-full flex flex-col items-center justify-center rounded-2xl p-6">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-accent/80">
            {isLoading
              ? (isRTL ? "جاري الانضمام…" : "Joining session…")
              : (isRTL ? "جاري الاتصال…" : "Connecting…")}
          </p>
        </div>
      </div>
    );
  }

  const hasAdminVisible = remoteUsers.length > 0;

  return (
    <div className="meet-container w-full h-full flex flex-col overflow-hidden flex-1 min-h-0">
      <MeetHeader
        sessionName={sessionName}
        connectionState={connectionState}
        networkQuality={networkQuality}
        participantCount={remoteUsers.length}
        isRTL={isRTL}
      />

      {/* Hidden: play participant audio so admin can hear them */}
      {participantsToHear.length > 0 && (
        <div
          className="absolute -left-[9999px] w-px h-px overflow-hidden"
          aria-hidden
        >
          {participantsToHear.map((user) => (
            <RemoteUser
              key={user.uid}
              user={user}
              playAudio
              playVideo
              className="w-full h-full"
            />
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 relative w-full">
        {hasAdminVisible ? (
          (() => {
            const user = remoteUsers[0];
            const participant = findParticipantByUid(user.uid);
            const displayName = participant?.name ?? (isRTL ? "المضيف" : "Host");
            return (
              <div key={user.uid} className="absolute inset-0 w-full h-full">
                <RemoteUser
                  user={user}
                  playAudio
                  playVideo
                  cover={RemoteUserCover}
                  videoPlayerConfig={REMOTE_VIDEO_CONFIG}
                  className="absolute inset-0 w-full h-full [&_video]:object-cover"
                />
                <div className="meet-tile-label absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-2">
                  <User size={16} className="text-primary shrink-0" />
                  <span className="text-base font-medium text-accent truncate">
                    {displayName}
                    {participant?.isAdmin && (
                      <span className="text-primary/80 font-normal ml-1">
                        ({isRTL ? "مضيف" : "Host"})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
              <p className="text-lg font-medium text-accent">
                {isRTL ? "في انتظار المضيف…" : "Waiting admin…"}
              </p>
              <p className="text-sm text-accent/60">
                {isRTL ? "سيظهر بث المضيف هنا عند الاتصال" : "Admin stream will appear here when connected"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0">
        <MeetControlBar
          micOn={micOn}
          micLevel={displayMicLevel}
          cameraOn={cameraOn}
          isLeaving={isLeaving}
          micHiddenByAdmin={micHiddenByAdmin}
          handRaised={handRaised}
          onMicToggle={handleMicToggle}
          onCameraToggle={handleCameraToggle}
          onRaiseHand={handleRaiseHand}
          onMicTest={() => setMicTestOpen(true)}
          onLeave={handleLeave}
          isRTL={isRTL}
        />
      </div>

      <MicTestModal
        isOpen={micTestOpen}
        onClose={() => setMicTestOpen(false)}
        isRTL={isRTL}
      />
    </div>
  );
}

export default function Meet() {
  const { url: sessionName } = useParams();
  const { isRTL } = useLanguage();

  const client = useMemo(
    () =>
      AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      }),
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sessionName]);

  if (!sessionName) {
    return (
      <>
        <SEO
          title={isRTL ? "اجتماع فيديو" : "Video Meeting"}
          description={
            isRTL
              ? "انضم إلى اجتماع الفيديو مع هلال الجابري"
              : "Join a video meeting with Helal Al Jabri"
          }
        />
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8 flex items-center justify-center">
          <div className="meet-container w-full mt-12 rounded-2xl min-h-[400px] md:min-h-[500px] 2xl:min-h-[600px] flex items-center justify-center border border-white/5">
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/15 text-primary">
                <Video size={40} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-accent mb-1">
                  {isRTL ? "رابط الاجتماع غير صالح" : "Invalid meeting link"}
                </h2>
                <p className="text-accent/70 text-sm">
                  {isRTL
                    ? "تحقق من الرابط وحاول مرة أخرى."
                    : "Check the URL and try again."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={isRTL ? "اجتماع فيديو" : "Video Meeting"}
        description={
          isRTL
            ? "انضم إلى اجتماع الفيديو مع هلال الجابري"
            : "Join a video meeting with Helal Al Jabri"
        }
      />
      <div className="w-full max-w-6xl mx-auto px-4 mt-18 md:mt-24 flex flex-col min-h-[calc(100vh-5rem)]">
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden border border-white/5">
          <AgoraRTCProvider client={client}>
            <AgoraMeetView sessionName={sessionName} isRTL={isRTL} />
          </AgoraRTCProvider>
        </div>
      </div>
    </>
  );
}
