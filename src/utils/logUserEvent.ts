import analytics from "@react-native-firebase/analytics";
import { CustomUserEvents, UserEventsStackParamList } from "modules/app/types";

export const logUserEvent = <T extends CustomUserEvents>(
  name: T,
  params?: UserEventsStackParamList[T],
) => {
  analytics().logEvent(name, params);
};
