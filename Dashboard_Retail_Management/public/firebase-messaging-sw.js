// 1. Apne package version (12.7.0) ke mutabiq exact CDN links use karein
importScripts('gstatic.com');
importScripts('gstatic.com');

// 2. Firebase Configuration
 const firebaseConfig = {
  apiKey: "AIzaSyCkY3qGSzOF06fhG9DQH5NheEUNLDBdC1g",
  authDomain: "retail-management-system-cf18a.firebaseapp.com",
  projectId: "retail-management-system-cf18a",
  storageBucket: "retail-management-system-cf18a.firebasestorage.app",
  messagingSenderId: "642613970189",
  appId: "1:642613970189:web:49f84df0be4c921d185c44",
};

// 3. Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 4. Background Message Handler(jo backend sa data aiga like title , body , icon wo yaha sa show hoga)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.icon 
  };
// this is the browser native function that shows the pop up on the right side of the screen
  self.registration.showNotification(notificationTitle, notificationOptions);
});
