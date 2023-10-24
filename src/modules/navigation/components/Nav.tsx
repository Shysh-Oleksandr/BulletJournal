import React, { useCallback, useEffect } from "react";
import theme from "theme";

import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IS_ANDROID } from "modules/app/constants";
import { getIsAuthenticated, getUserData } from "modules/auth/AuthSlice";
import SignIn from "modules/auth/screens/SignIn";
import EditNoteScreen from "modules/notes/screens/EditNoteScreen";
import { useAppSelector } from "store/helpers/storeHooks";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";

import NotesScreen from "../../notes/screens/NotesScreen";
import { RootStackParamList, Routes } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Nav = (): JSX.Element => {
  const isAuthenticated = useAppSelector(getIsAuthenticated);
  const userData = useAppSelector(getUserData);

  const routeNameRef = React.useRef<string>();
  const navigationRef = React.useRef() as React.MutableRefObject<
    NavigationContainerRef<ReactNavigation.RootParamList>
  >;

  const handleStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
    routeNameRef.current = currentRouteName;
  }, []);

  useEffect(() => {
    if (!userData) {
      addCrashlyticsLog("User is on the sign in screen. Not authenticated");

      return;
    }

    analytics().setUserId(userData.uid);
    crashlytics().setUserId(userData.uid);
    crashlytics().setAttribute("_id", userData._id);
    addCrashlyticsLog("User is on Homepage. Authenticated");
  }, [userData]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={handleStateChange}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute()?.name;
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bgColor },
          presentation: IS_ANDROID ? "modal" : "card",
          animationTypeForReplace: "push",
          animation: "slide_from_right",
        }}
        initialRouteName={Routes.NOTES}
      >
        {!isAuthenticated ? (
          <Stack.Screen name={Routes.SIGN_IN} component={SignIn} />
        ) : (
          <>
            <Stack.Screen name={Routes.NOTES} component={NotesScreen} />
            <Stack.Screen name={Routes.EDIT_NOTE} component={EditNoteScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
