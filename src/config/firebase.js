import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-VsJAJB4E9BWkXpwR0BhocplNZy0fwPc",
  authDomain: "he779-8207f.firebaseapp.com",
  projectId: "he779-8207f",
  storageBucket: "he779-8207f.firebasestorage.app",
  messagingSenderId: "174427837914",
  appId: "1:174427837914:web:71927d2931bcf54e635ce3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging
let messaging = null;
if (typeof window !== "undefined" && "Notification" in window) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn("Firebase Messaging not supported:", error);
  }
}

// FCM Token key in localStorage
const FCM_TOKEN_KEY = "fcmToken";

/**
 * Register service worker for FCM and wait until it's active
 */
const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("🔥 Service Worker registered:", registration);

    // Wait for the service worker to be ready/active
    if (registration.installing) {
      console.log("🔥 Service Worker installing...");
      await new Promise((resolve) => {
        registration.installing.addEventListener("statechange", (e) => {
          if (e.target.state === "activated") {
            console.log("🔥 Service Worker activated");
            resolve();
          }
        });
      });
    } else if (registration.waiting) {
      console.log("🔥 Service Worker waiting...");
      await new Promise((resolve) => {
        registration.waiting.addEventListener("statechange", (e) => {
          if (e.target.state === "activated") {
            console.log("🔥 Service Worker activated");
            resolve();
          }
        });
      });
    } else if (registration.active) {
      console.log("🔥 Service Worker already active");
    }

    // Ensure we have an active service worker
    await navigator.serviceWorker.ready;
    console.log("🔥 Service Worker ready");

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
};

/**
 * Get or generate FCM token and store it in localStorage
 * @returns {Promise<string|null>} The FCM token or null if failed
 */
export const getFcmToken = async () => {
  // Check if we already have a token in storage
  const existingToken = localStorage.getItem(FCM_TOKEN_KEY);
  if (existingToken) {
    console.log("🔥 Using existing FCM token from storage");
    return existingToken;
  }

  // Check if notifications are supported
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications");
    return null;
  }

  if (!messaging) {
    console.error("Firebase Messaging is not initialized");
    return null;
  }

  try {
    // Request notification permission first
    const permission = await Notification.requestPermission();
    console.log("🔥 Notification permission:", permission);
    
    if (permission !== "granted") {
      console.error("Notification permission denied - FCM token cannot be generated");
      return null;
    }

    // Register service worker and wait until it's active
    await registerServiceWorker();

    // Wait for service worker to be ready
    const swRegistration = await navigator.serviceWorker.ready;
    console.log("🔥 Using service worker registration:", swRegistration);

    // Get the FCM token with service worker registration
    const token = await getToken(messaging, {
      serviceWorkerRegistration: swRegistration,
    });
    
    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
      console.log("🔥 FCM Token generated and stored:", token);
      return token;
    }
    
    console.error("Failed to get FCM token - no token returned");
    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Get stored FCM token from localStorage
 * @returns {string|null}
 */
export const getStoredFcmToken = () => {
  return localStorage.getItem(FCM_TOKEN_KEY);
};

/**
 * Clear FCM token from localStorage
 */
export const clearFcmToken = () => {
  localStorage.removeItem(FCM_TOKEN_KEY);
};

export { messaging };
export default app;
