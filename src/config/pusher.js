import Pusher from "pusher-js";

// Replace these values with your real Pusher app key and cluster
const PUSHER_KEY = "bb530b4226eb59dc9fc0";
const PUSHER_CLUSTER = "eu";

export const getPusher = (roomId) => {
  const pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    authEndpoint: "/broadcasting/auth", // if you use private/auth channels, modify as needed
    forceTLS: true,
  });
  return pusher.subscribe(roomId);
};
