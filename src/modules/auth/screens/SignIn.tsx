import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import theme from "theme";

import { AntDesign } from "@expo/vector-icons";
import Button from "components/Button";
import Typography from "components/Typography";
import AppConfig from "config/AppConfig";
import { auth } from "config/firebase";
import logging from "config/logging";
import { useAuthRequest } from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";

import LogoIcon from "../../../../assets/images/icon.png";
import { authApi } from "../AuthApi";

const LOGO_SIZE = 100;

const GOOGLE_ICON = (
  <AntDesign name="google" size={24} color={theme.colors.white} />
);

WebBrowser.maybeCompleteAuthSession();

const SignIn = (): JSX.Element => {
  const [login, { isFetching }] = authApi.useLazyLoginQuery();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSignedInWithCredential, setIsSignedInWithCredential] =
    useState(false);

  const isLoading = isFetching || isAuthenticating;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, response, promptAsync] = useAuthRequest({
    androidClientId: AppConfig.androidClientId,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);

      addCrashlyticsLog(
        "User chose a google account. Trying to sign in with credentials...",
      );

      signInWithCredential(auth, credential);

      setIsSignedInWithCredential(true);
    } else {
      signOut(auth);
      setIsSignedInWithCredential(false);
      setIsAuthenticating(false);
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isAuthenticating || !isSignedInWithCredential) return;

      addCrashlyticsLog("User got a fire token. Signing in...");

      if (user) {
        try {
          const { uid } = user;

          const fire_token = await user.getIdToken();

          await login({ fire_token, uid });

          setIsAuthenticating(false);
        } catch (error) {
          logging.error(error, "");
          alertError();
        }
      }
    });

    return () => unsubscribe();
  }, [isAuthenticating, isSignedInWithCredential, login]);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.bgColor}
      />

      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <Container>
          <Logo
            source={LogoIcon}
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            resizeMode="contain"
          />
          <Typography fontWeight="bold" fontSize="xxxl" paddingTop={16}>
            Bullet Journal
          </Typography>
          <Button
            label="Google"
            Icon={GOOGLE_ICON}
            wide
            bgColor={theme.colors.cyan600}
            marginTop={50}
            marginBottom={70}
            disabled={isLoading}
            isLoading={isLoading}
            onPress={() => {
              addCrashlyticsLog("User pressed the google auth btn");
              setIsAuthenticating(true);
              promptAsync();
            }}
            labelProps={{
              fontSize: "xxl",
              fontWeight: "bold",
              paddingVertical: 12,
            }}
          />
        </Container>
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
`;

const Logo = styled.Image`
  margin-left: 5px;
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
`;

export default SignIn;
