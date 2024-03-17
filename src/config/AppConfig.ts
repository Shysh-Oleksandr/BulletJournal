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
  apiUrl: "http://192.168.0.103:8001" ?? process.env.EXPO_PUBLIC_API_URL, // Local ip from `ipconfig getifaddr en0`: http://192.168.0.103:8001
  androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  s3Bucket: process.env.EXPO_PUBLIC_BUCKET,
  s3BucketImageUrl: process.env.EXPO_PUBLIC_AWS_IMAGE_URL,
  awsAccessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
  firebaseConfig,
} as const;
