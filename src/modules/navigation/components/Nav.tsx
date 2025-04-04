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
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import SignIn from "modules/auth/screens/SignIn";
import ArchivedHabitsScreen from "modules/habits/screens/ArchivedHabitsScreen";
import EditHabitScreen from "modules/habits/screens/EditHabitScreen";
import HabitsBulkEditScreen from "modules/habits/screens/HabitsBulkEditScreen";
import HabitStatsScreen from "modules/habits/screens/HabitStatsScreen";
import EditNoteScreen from "modules/notes/screens/EditNoteScreen";
import SearchScreen from "modules/notes/screens/SearchScreen";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";

import { RootStackParamList, Routes } from "../types";

import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Nav = (): JSX.Element => {
  const user = useAuthStore((state) => state.user);

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
    if (!user) {
      addCrashlyticsLog("User is on the sign in screen. Not authenticated");

      return;
    }

    analytics().setUserId(user.uid);
    crashlytics().setUserId(user.uid);
    crashlytics().setAttribute("_id", user._id);
    addCrashlyticsLog("User is on Homepage. Authenticated");
  }, [user]);

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
      >
        {!user ? (
          <Stack.Screen name={Routes.SIGN_IN} component={SignIn} />
        ) : (
          <>
            <Stack.Screen name={Routes.MAIN} component={TabNavigator} />
            <Stack.Screen name={Routes.EDIT_NOTE} component={EditNoteScreen} />
            <Stack.Screen
              name={Routes.HABITS_BULK_EDIT}
              component={HabitsBulkEditScreen}
            />
            <Stack.Screen
              name={Routes.ARCHIVED_HABITS}
              component={ArchivedHabitsScreen}
            />
            <Stack.Screen
              name={Routes.EDIT_HABIT}
              component={EditHabitScreen}
            />
            <Stack.Screen
              name={Routes.HABIT_STATS}
              component={HabitStatsScreen}
            />
            <Stack.Screen name={Routes.SEARCH} component={SearchScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
