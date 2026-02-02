import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Video,
  Mic,
  MicOff,
  PhoneOff,
  User,
  Wifi,
  Users,
  AlertCircle,
  Hand,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import { useMeetStore } from "../store";
import { useHandRaise } from "../hooks/useHandRaise";
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

const RemoteUserCover = () => (
  <div className="meet-cover-avatar">
    <User size={48} />
  </div>
);

const REMOTE_VIDEO_CONFIG = { fit: "cover" };

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
  handRaised,
  isLeaving,
  onMicToggle,
  onHandToggle,
  onLeave,
  isRTL,
}) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 py-4 px-4 bg-secondary-light/90 backdrop-blur border-t border-white/5">
      <button
        type="button"
        onClick={onHandToggle}
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
          {handRaised ? (isRTL ? "اليد مرفوعة" : "Hand up") : (isRTL ? "رفع اليد" : "Raise hand")}
        </span>
      </button>

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
  const session = useMeetStore((s) => s.session);

  const [micOn, setMicOn] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { handRaised, toggleHandRaise } = useHandRaise(
    session?.appId && session?.channelName != null && session?.uid != null
      ? {
          appId: session.appId,
          channelName: session.channelName,
          uid: session.uid,
          token: session.token,
        }
      : {}
  );

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

  const { localCameraTrack } = useLocalCameraTrack(isConnected);
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
    const list = [localMicrophoneTrack];
    if (localCameraTrack) list.push(localCameraTrack);
    return list;
  }, [localMicrophoneTrack, localCameraTrack]);
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

  // Only show admin users (filter out non-admin participants)
  const remoteUsers = useMemo(() => {
    if (participantsArray.length === 0) return [];
    return allRemoteUsers.filter((user) => {
      const p = findParticipantByUid(user.uid);
      return p?.isAdmin === true;
    });
  }, [allRemoteUsers, findParticipantByUid, participantsArray]);

  useEffect(() => {
    return () => clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (!isConnected) return;
    localMicrophoneTrack?.setEnabled(micOn);
  }, [isConnected, micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (!isConnected) return;
    localCameraTrack?.setEnabled(true);
  }, [isConnected, localCameraTrack]);

  const handleMicToggle = useCallback(() => setMicOn((v) => !v), []);

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
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center relative">
                <User size={32} className="text-primary" />
                {handRaised && (
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center animate-pulse">
                    <Hand size={16} className="text-white" />
                  </span>
                )}
              </div>
              <p className="text-lg font-medium text-accent">
                {isRTL ? "في انتظار المضيف…" : "Waiting admin…"}
              </p>
              <p className="text-sm text-accent/60">
                {isRTL ? "سيظهر بث المضيف هنا عند الاتصال" : "Admin stream will appear here when connected"}
              </p>
              {handRaised && (
                <p className="text-sm text-primary font-medium flex items-center gap-1.5">
                  <Hand size={16} />
                  {isRTL ? "اليد مرفوعة - في انتظار الاستجابة" : "Hand raised - waiting for response"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0">
        <MeetControlBar
          micOn={micOn}
          micLevel={displayMicLevel}
          handRaised={handRaised}
          isLeaving={isLeaving}
          onMicToggle={handleMicToggle}
          onHandToggle={toggleHandRaise}
          onLeave={handleLeave}
          isRTL={isRTL}
        />
      </div>
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
