import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, FontAwesome } from "@expo/vector-icons";
import Button from "components/Button";
import Input from "components/Input";
import { auth } from "config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";

import { authApi } from "../AuthApi";

const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const CHECK_ICON = (
  <FontAwesome name="check" color={theme.colors.cyan600} size={22} />
);
const EYE_ICON = <Entypo name="eye" size={24} color={theme.colors.cyan600} />;

const EYE_WITH_LINE_ICON = (
  <Entypo name="eye-with-line" size={24} color={theme.colors.cyan600} />
);

type Props = {
  isSignUp: boolean;
};

const EmailAuthForm = ({ isSignUp }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [login, { isFetching }] = authApi.useLazyLoginQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isLoading = isFetching || isAuthenticating;

  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email), [email]);

  const isValidForm = isValidEmail && password.length > 5;

  const authenticate = async (isSignUp: boolean) => {
    const { user } = await (isSignUp
      ? createUserWithEmailAndPassword(auth, email, password)
      : signInWithEmailAndPassword(auth, email, password));

    const { uid } = user;

    const fire_token = await user.getIdToken();

    await login({ fire_token, uid });
  };

  const onPress = async () => {
    setIsAuthenticating(true);
    addCrashlyticsLog("User pressed the sign up btn");

    try {
      await authenticate(isSignUp);
    } catch (error: any) {
      try {
        // If authenticating failed(e.g. an account with the email is already created), we try to do alternative
        await authenticate(!isSignUp);
      } catch (err) {
        if (error.code === "auth/too-many-requests") {
          alertError();

          return;
        }

        alertError(
          t("auth.authFailed"),
          isSignUp ? t("auth.emailInUse") : t("auth.invalidEmailOrPass"),
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Section>
      <Input
        value={email}
        paddingHorizontal={10}
        placeholder={t("auth.email")}
        maxLength={200}
        keyboardType="email-address"
        autoCapitalize="none"
        fontSize="lg"
        fontWeight="semibold"
        onChange={(text) => setEmail(text.trim())}
        Icon={isValidEmail ? CHECK_ICON : undefined}
      />
      <Input
        value={password}
        paddingHorizontal={10}
        placeholder={t("auth.password")}
        autoCapitalize="none"
        maxLength={200}
        bgColor={theme.colors.cyan300}
        fontSize="lg"
        fontWeight="semibold"
        onChange={(text) => setPassword(text.trim())}
        Icon={isPasswordMasked ? EYE_WITH_LINE_ICON : EYE_ICON}
        secureTextEntry={isPasswordMasked}
        onIconPress={() => setIsPasswordMasked((prev) => !prev)}
      />
      <Button
        label={t(isSignUp ? "auth.signUp" : "auth.signIn")}
        wide
        bgColor={isValidForm ? theme.colors.cyan500 : theme.colors.darkGray}
        shouldReverseBgColor
        marginTop={20}
        marginBottom={20}
        disabled={isLoading || !isValidForm}
        isLoading={isLoading}
        onPress={onPress}
        labelProps={{
          fontSize: "xxl",
          fontWeight: "bold",
          paddingVertical: 12,
        }}
      />
    </Section>
  );
};

const Section = styled.View`
  margin-top: 30px;
  align-center: center;
  justify-content: center;
  width: 100%;
  row-gap: 20px;
`;

export default EmailAuthForm;
