import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";
import theme from "theme";

import { AntDesign } from "@expo/vector-icons";
import Button from "components/Button";
import Typography from "components/Typography";
import { IS_ANDROID } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import styled from "styled-components/native";

import LogoIcon from "./assets/Logo.svg";

export const BUTTON_HIT_SLOP = { top: 15, bottom: 15, left: 20, right: 20 };

const DISTANCE_FROM_THE_STATUS_BAR_ANDROID = 15;
const HEADER_MIN_HEIGHT = 50;

type Props = {
  title?: string;
  marginBottom?: number;
  withBackArrow?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  bgColor?: string;
  withLogo?: boolean;
  withLogoutBtn?: boolean;
  onBackArrowPress?: () => void;
};

const HeaderBar = ({
  title = "",
  marginBottom = 0,
  withBackArrow = false,
  paddingHorizontal = 20,
  paddingVertical = 8,
  bgColor = theme.colors.cyan700,
  withLogo,
  withLogoutBtn,
  onBackArrowPress,
}: Props): JSX.Element => {
  const insets = useSafeAreaInsets();

  const navigation = useAppNavigation();

  const distanceFromTheTop = IS_ANDROID
    ? insets.top + DISTANCE_FROM_THE_STATUS_BAR_ANDROID
    : insets.top;

  return (
    <StyledDropShadow distance={20} offset={[0, 5]} startColor="#00000015">
      <CoverView bgColor={bgColor} height={distanceFromTheTop} />
      <HeaderWrapper
        marginBottom={marginBottom}
        paddingVertical={paddingVertical}
        paddingHorizontal={paddingHorizontal}
        bgColor={bgColor}
      >
        {withBackArrow && (
          <IconWrapper
            onPress={onBackArrowPress ?? navigation.goBack}
            hitSlop={BUTTON_HIT_SLOP}
            paddingHorizontal={5}
          >
            <AntDesign name="arrowleft" size={24} color={theme.colors.white} />
          </IconWrapper>
        )}
        {withLogo && (
          <IconWrapper disabled hitSlop={BUTTON_HIT_SLOP} paddingHorizontal={5}>
            <LogoIcon width={32} height={32} fill={theme.colors.white} />
          </IconWrapper>
        )}
        <Title
          align="center"
          color={theme.colors.white}
          fontSize="lg"
          fontWeight="bold"
          paddingRight={24}
        >
          {title}
        </Title>
        {withLogoutBtn && (
          <Button label="Logout" bgColor={theme.colors.cyan600} />
        )}
      </HeaderWrapper>
    </StyledDropShadow>
  );
};

const CoverView = styled.View<{ bgColor: string; height: number }>`
  background-color: ${(props) => props.bgColor};
  height: ${(props) => props.height}px;
  width: 100%;
`;

const StyledDropShadow = styled(Shadow)`
  width: 100%;
`;

const HeaderWrapper = styled.View<{
  marginBottom: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  bgColor: string;
}>`
  z-index: 100;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.bgColor};
  margin-bottom: ${(props) => props.marginBottom}px;
  min-height: ${HEADER_MIN_HEIGHT}px;
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
  padding-vertical: ${(props) => props.paddingVertical}px;
`;

const IconWrapper = styled.TouchableOpacity<{ paddingHorizontal?: number }>`
  padding-horizontal: ${(props) => props.paddingHorizontal ?? 10}px;
  z-index: 2;
`;

const Title = styled(Typography)`
  flex: 1;
`;

export default HeaderBar;
