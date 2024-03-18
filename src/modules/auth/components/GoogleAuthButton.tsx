import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import theme from "theme";

import { AntDesign } from "@expo/vector-icons";
import Button from "components/Button";
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
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";

import { authApi } from "../AuthApi";

const GOOGLE_ICON = (
  <AntDesign name="google" size={24} color={theme.colors.white} />
);

WebBrowser.maybeCompleteAuthSession();

const GoogleAuthButton = (): JSX.Element => {
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
    <Button
      label="Google"
      Icon={GOOGLE_ICON}
      wide
      bgColor={theme.colors.cyan600}
      marginBottom={20}
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
  );
};

export default GoogleAuthButton;
