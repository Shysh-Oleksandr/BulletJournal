import Toast from "react-native-toast-message";

export const alertError = () => {
  Toast.show({
    type: "error",
    text1: "Something went wrong",
    text2: "Please try again",
  });
};
