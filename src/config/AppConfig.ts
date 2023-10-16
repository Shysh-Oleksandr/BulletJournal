const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bulletjournalproject.firebaseapp.com",
  projectId: "bulletjournalproject",
  storageBucket: "bulletjournalproject.appspot.com",
  messagingSenderId: "1000487121408",
  appId: "1:1000487121408:web:990618e001793cc959dee5",
  measurementId: "G-SGNH6PWV8L",
};

export default {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  firebaseConfig,
} as const;
