import crashlytics from "@react-native-firebase/crashlytics";

export const addCrashlyticsLog = (text: string): void =>
  crashlytics().log(text);
