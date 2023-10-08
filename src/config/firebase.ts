import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { initializeAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import AppConfig from "./AppConfig";

const { firebaseConfig } = AppConfig;

export const app = initializeApp(firebaseConfig);
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage),
});

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
