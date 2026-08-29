// import { useEffect } from "react";
// import { getToken } from "firebase/messaging";
// import { messaging } from "../firebase";
// import useAuthStore from "../store/authstore";
// const VAPID_KEY = import.meta.env.VITE_FIREBASE_API_KEY 

// const NotificationPermission = () => {
//   const { authuser , sendtokentobackend   } = useAuthStore();

//   useEffect(() => {
//     if (!authuser) return;

//     // 🔒 Prevent duplicate registration
//     if (localStorage.getItem("fcm_registered") === "1") {
//       console.log("🔁 FCM already registered for this device");
//       return;
//     }

//     const setupNotifications = async () => {
//       try {
//         // 1️⃣ Browser support check
//         if (!("Notification" in window)) {
//           console.warn("❌ Browser does not support notifications");
//           return;
//         }

//         // 2️⃣ Ask permission from brawser ager granted hai to return kr do nahi warning show karo
//         const permission = await Notification.requestPermission();
//         if (permission !== "granted") {
//           console.warn("❌ Notification permission denied");
//           return;
//         }

//         // 3️⃣ Generate FCM token
//         const token = await getToken(messaging, {
//           vapidKey: VAPID_KEY,
//         });

//         if (!token) {
//           console.warn("❌ Failed to get FCM token");
//           return;
//         }

//         console.log("✅ FCM Token:", token);

//         // 4️⃣ Save token to backend
//         sendtokentobackend(token)
//         // 5️⃣ Mark as registered
//         localStorage.setItem("fcm_registered", "1");

//         console.log("✅ Device token saved successfully");
//       } catch (err) {
//         console.error("❌ Notification setup failed:", err.message);
//       }
//     };

//     setupNotifications();
//   }, [authuser]);

//   return null; // No UI needed
// };

// export default NotificationPermission;
