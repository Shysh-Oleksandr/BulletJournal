import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import theme from "theme";

import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import styled from "styled-components/native";

import LogoIcon from "../../../../assets/images/icon.png";
import EmailAuthForm from "../components/EmailAuthForm";
import GoogleAuthButton from "../components/GoogleAuthButton";

const LOGO_SIZE = 100;

const SignIn = (): JSX.Element => {
  const { t } = useTranslation();

  const [isSignUp, setIsSignUp] = useState(true);

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
        <ToastContainer>
          <Toast topOffset={50} visibilityTime={4000} />
        </ToastContainer>
        <TopContainer>
          <Logo
            source={LogoIcon}
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            resizeMode="contain"
          />
          <Typography fontWeight="semibold" fontSize="xxl" paddingTop={20}>
            {t("auth.welcome")}
          </Typography>
          <Typography fontWeight="bold" fontSize="xxxl">
            Bullet Journal
          </Typography>
          <EmailAuthForm isSignUp={isSignUp} />
        </TopContainer>
        <Typography fontWeight="semibold" fontSize="xl">
          {t("auth.or")}
        </Typography>
        <BottomContainer>
          <GoogleAuthButton />
          <AlternativeAuthLabel
            hitSlop={BUTTON_HIT_SLOP}
            onPress={() => setIsSignUp((prev) => !prev)}
          >
            <Typography fontWeight="semibold" color={theme.colors.darkGray}>
              {t(isSignUp ? "auth.alreadyHaveAccount" : "auth.dontHaveAccount")}{" "}
              <Typography fontWeight="bold" paddingTop={20}>
                {t(isSignUp ? "auth.signIn" : "auth.signUp")}
              </Typography>
            </Typography>
          </AlternativeAuthLabel>
        </BottomContainer>
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  height: 100%;
  padding-top: 25%;
  padding-bottom: 20%;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  width: 100%;
`;

const TopContainer = styled.View`
  align-items: center;
  width: 100%;
  z-index: 0;
`;

const ToastContainer = styled.View`
  position: absolute;
  top: 0;
  z-index: 130;
`;

const BottomContainer = styled.View`
  align-items: center;
  width: 100%;
`;

const Logo = styled.Image`
  margin-left: 5px;
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
`;

const AlternativeAuthLabel = styled.TouchableOpacity`
  margin-top: 20px;
`;

export default SignIn;
