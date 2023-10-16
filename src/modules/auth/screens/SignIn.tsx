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
import styled from "styled-components/native";

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

      if (user) {
        try {
          const { uid } = user;

          const fire_token = await user.getIdToken();

          await login({ fire_token, uid });

          setIsAuthenticating(false);
        } catch (error) {
          logging.error(error, "");
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

      <Container>
        <Logo
          source={LogoIcon}
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          resizeMode="contain"
        />
        <Typography
          fontWeight="bold"
          fontSize="xxl"
          paddingTop={16}
          color={theme.colors.darkBlueText}
        >
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
            setIsAuthenticating(true);
            promptAsync();
          }}
          labelProps={{
            fontSize: "xl",
            fontWeight: "bold",
            paddingVertical: 12,
          }}
        />
      </Container>
    </>
  );
};

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
