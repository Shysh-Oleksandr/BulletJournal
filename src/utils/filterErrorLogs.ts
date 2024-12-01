import { LogBox } from "react-native";

export const filterErrorLogs = () => {
  if (__DEV__) {
    const ignoreErrors = ["Support for defaultProps will be removed"];

    const error = console.error;

    console.error = (...arg) => {
      for (const error of ignoreErrors) if (arg[0].includes(error)) return;
      error(...arg);
    };

    LogBox.ignoreLogs(ignoreErrors);
  }
};
