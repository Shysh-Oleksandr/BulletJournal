import { API_URL, FIREBASE_API_KEY, ANDROID_CLIENT_ID } from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "bulletjournalproject.firebaseapp.com",
  projectId: "bulletjournalproject",
  storageBucket: "bulletjournalproject.appspot.com",
  messagingSenderId: "1000487121408",
  appId: "1:1000487121408:web:990618e001793cc959dee5",
  measurementId: "G-SGNH6PWV8L",
};

export default {
  apiUrl: API_URL,
  androidClientId: ANDROID_CLIENT_ID,
  firebaseConfig,
} as const;
