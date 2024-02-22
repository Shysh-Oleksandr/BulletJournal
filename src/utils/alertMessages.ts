import Toast from "react-native-toast-message";

import i18n from "localization/i18n";

export const alertError = () => {
  Toast.show({
    type: "error",
    text1: i18n.t("general.somethingWrong"),
    text2: i18n.t("general.tryAgain"),
  });
};
