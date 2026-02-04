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
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
