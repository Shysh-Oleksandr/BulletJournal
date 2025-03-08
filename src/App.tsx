import { loadAsync } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "react-native";
import "react-native-devsettings/withAsyncStorage"; // Allows to use React Native Debugger with hermes enabled
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClientProvider } from "@tanstack/react-query";
import logging from "config/logging";
import { AuthProvider } from "modules/auth/AuthContext";
import { queryClient } from "store/api/queryClient";
import styled, { ThemeProvider } from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { filterErrorLogs } from "utils/filterErrorLogs";

import i18n from "./localization/i18n";
import Nav from "./modules/navigation/components/Nav";
import theme from "./theme";

filterErrorLogs();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
NavigationBar.setPositionAsync("relative");
NavigationBar.setBackgroundColorAsync("#ffffff01");
NavigationBar.setButtonStyleAsync("dark");

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadAsync({
          "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
          "Montserrat-Semibold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
          "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
          "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
          "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
          ...FontAwesome.font,
        });
      } catch (e) {
        addCrashlyticsLog("Failed to load fonts");
        logging.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
      NavigationBar.setBackgroundColorAsync(theme.colors.bgColor);
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SafeAreaProvider>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor="transparent"
                  translucent
                />
                <Container onLayout={onLayoutRootView}>
                  <Nav />
                </Container>
                <Toast topOffset={105} visibilityTime={2000} />
              </SafeAreaProvider>
            </AuthProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </I18nextProvider>
    </ThemeProvider>
  );
}

const Container = styled.View`
  flex: 1;
  align-content: center;
  justify-content: center;
`;
