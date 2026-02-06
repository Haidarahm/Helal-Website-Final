// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD-VsJAJB4E9BWkXpwR0BhocplNZy0fwPc",
  authDomain: "he779-8207f.firebaseapp.com",
  projectId: "he779-8207f",
  storageBucket: "he779-8207f.firebasestorage.app",
  messagingSenderId: "174427837914",
  appId: "1:174427837914:web:71927d2931bcf54e635ce3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const data = payload.data || {};
  
  // Forward FCM actions to open tabs (mute_all, unmute_all, kick_participant)
  const channelName = data.channelName || data.channel_name;
  const action = data.action;
  const forwardActions = ['mute_all', 'unmute_all', 'mute_participant', 'unmute_participant', 'kick_participant'];
  if (action && channelName && forwardActions.includes(action)) {
    const msg = { type: 'FCM_ACTION', action, channelName, uid: data.uid, userId: data.userId };
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        new BroadcastChannel('fcm_meet').postMessage(msg);
      } catch (e) {}
    }
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage(msg);
      });
    });
  }
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
