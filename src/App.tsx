import "react-native-devsettings/withAsyncStorage"; // Allows to use React Native Debugger with hermes enabled
import { loadAsync } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import logging from "config/logging";
import { store } from "store/store";
import styled, { ThemeProvider } from "styled-components/native";

import Nav from "./modules/navigation/components/Nav";
import theme from "./theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
NavigationBar.setPositionAsync("absolute");
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
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
          />
          <Container onLayout={onLayoutRootView}>
            <Nav />
          </Container>
        </SafeAreaProvider>
      </Provider>
    </ThemeProvider>
  );
}

const Container = styled.View`
  flex: 1;
  align-content: center;
  justify-content: center;
`;
