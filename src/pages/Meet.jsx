import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  User,
  Wifi,
  Users,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import { useMeetStore } from "../store";
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  usePublish,
  useRemoteUsers,
  useVolumeLevel,
  useNetworkQuality,
  useConnectionState,
  useCurrentUID,
  useRTCClient,
  LocalUser,
  RemoteUser,
} from "agora-rtc-react";
import "./meet.css";

const COVER_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231f2937"/><circle cx="50" cy="40" r="14" fill="%234b5563"/><ellipse cx="50" cy="78" rx="22" ry="16" fill="%234b5563"/></svg>'
  );

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
  cameraOn,
  screenSharing,
  micLevel,
  isLeaving,
  onMicToggle,
  onCameraToggle,
  onScreenShareToggle,
  onLeave,
  isRTL,
}) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 py-4 px-4 bg-secondary-light/90 backdrop-blur border-t border-white/5 rounded-b-2xl">
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
        onClick={onCameraToggle}
        disabled={isLeaving}
        className="meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 min-w-[64px] disabled:opacity-50 disabled:pointer-events-none"
        title={
          cameraOn
            ? (isRTL ? "إيقاف الكاميرا" : "Turn off camera")
            : (isRTL ? "تشغيل الكاميرا" : "Turn on camera")
        }
      >
        <span
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            cameraOn
              ? "bg-white/10 text-accent hover:bg-white/15"
              : "bg-red-500/80 text-white"
          }`}
        >
          {cameraOn ? <Video size={22} /> : <VideoOff size={22} />}
        </span>
        <span className="text-[11px] text-accent/70 hidden sm:block">
          {cameraOn ? (isRTL ? "كاميرا" : "Camera") : (isRTL ? "مطفأة" : "Off")}
        </span>
      </button>

      <button
        type="button"
        onClick={onScreenShareToggle}
        disabled={isLeaving}
        className="meet-control-btn flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 min-w-[64px] disabled:opacity-50 disabled:pointer-events-none"
        title={
          screenSharing
            ? (isRTL ? "إيقاف المشاركة" : "Stop sharing")
            : (isRTL ? "مشاركة الشاشة" : "Share screen")
        }
      >
        <span
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            screenSharing
              ? "bg-primary text-secondary"
              : "bg-white/10 text-accent hover:bg-white/15"
          }`}
        >
          {screenSharing ? <MonitorOff size={22} /> : <Monitor size={22} />}
        </span>
        <span className="text-[11px] text-accent/70 hidden sm:block">
          {screenSharing ? (isRTL ? "إيقاف" : "Stop") : (isRTL ? "شاشة" : "Share")}
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

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { error: joinError, isConnected, isLoading } = useJoin(
    async () => {
      const s = await joinSession(sessionName);
      if (!s) throw new Error("Failed to join session");
      return {
        appid: s.appId,
        channel: s.channelName,
        token: s.token,
        uid: s.uid,
      };
    },
    !!sessionName
  );

  const connectionState = useConnectionState(client);
  const networkQuality = useNetworkQuality(client);
  const currentUID = useCurrentUID(client);

  const { localCameraTrack } = useLocalCameraTrack(isConnected && !screenSharing);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isConnected);
  const { screenTrack: localScreenTrack } = useLocalScreenTrack(
    isConnected && screenSharing,
    {},
    "disable"
  );

  const micLevel = useVolumeLevel(localMicrophoneTrack ?? undefined);

  const videoTrack = screenSharing ? localScreenTrack : localCameraTrack;
  const tracksToPublish = useMemo(() => {
    const list = [localMicrophoneTrack];
    if (videoTrack) list.push(videoTrack);
    return list;
  }, [localMicrophoneTrack, videoTrack]);
  usePublish(tracksToPublish, isConnected);
  const remoteUsers = useRemoteUsers(client);

  const videoPlayerConfig = useMemo(
    () => ({
      fit: "cover",
      mirror: !screenSharing && !!localCameraTrack,
    }),
    [screenSharing, localCameraTrack]
  );

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

  const handleMicToggle = useCallback(() => setMicOn((v) => !v), []);
  const handleCameraToggle = useCallback(() => setCameraOn((v) => !v), []);
  const handleScreenShareToggle = useCallback(() => setScreenSharing((v) => !v), []);

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

  if (isLoading || !isConnected) {
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

  return (
    <div className="meet-container w-full h-full rounded-2xl overflow-hidden flex flex-col border border-white/5">
      <MeetHeader
        sessionName={sessionName}
        connectionState={connectionState}
        networkQuality={networkQuality}
        participantCount={remoteUsers.length}
        isRTL={isRTL}
      />

      <div className="flex-1 min-h-0 overflow-auto p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 h-full">
          <div className="meet-tile rounded-xl overflow-hidden relative flex flex-col">
            <div className="flex-1 min-h-0 relative">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                videoTrack={videoTrack}
                cameraOn={cameraOn || screenSharing}
                micOn={micOn}
                playAudio
                playVideo={cameraOn || screenSharing}
                cover={COVER_PLACEHOLDER}
                videoPlayerConfig={videoPlayerConfig}
                className="absolute inset-0 w-full h-full [&_video]:object-cover"
              />
            </div>
            <div className="meet-tile-label absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-2">
              <User size={14} className="text-primary shrink-0" />
              <span className="text-sm font-medium text-accent truncate">
                {isRTL ? "أنت" : "You"}
                {currentUID != null && (
                  <span className="text-accent/50 font-normal ml-1">({currentUID})</span>
                )}
              </span>
            </div>
          </div>

          {remoteUsers.map((user) => (
            <div
              key={user.uid}
              className="meet-tile rounded-xl overflow-hidden relative flex flex-col"
            >
              <div className="flex-1 min-h-0 relative">
                <RemoteUser
                  user={user}
                  playAudio
                  playVideo
                  cover={() => (
                    <div className="meet-cover-avatar">
                      <User size={48} />
                    </div>
                  )}
                  videoPlayerConfig={{ fit: "cover" }}
                  className="absolute inset-0 w-full h-full [&_video]:object-cover"
                />
              </div>
              <div className="meet-tile-label absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-2">
                <User size={14} className="text-primary shrink-0" />
                <span className="text-sm font-medium text-accent truncate">
                  {isRTL ? "مشارك" : "Participant"} {user.uid}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <MeetControlBar
          micOn={micOn}
          cameraOn={cameraOn}
          screenSharing={screenSharing}
          micLevel={micLevel}
          isLeaving={isLeaving}
          onMicToggle={handleMicToggle}
          onCameraToggle={handleCameraToggle}
          onScreenShareToggle={handleScreenShareToggle}
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
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl mt-8 md:mt-12 rounded-2xl min-h-[420px] md:min-h-[520px] 2xl:min-h-[620px] overflow-hidden">
          <AgoraRTCProvider client={client}>
            <AgoraMeetView sessionName={sessionName} isRTL={isRTL} />
          </AgoraRTCProvider>
        </div>
      </div>
    </>
  );
}
