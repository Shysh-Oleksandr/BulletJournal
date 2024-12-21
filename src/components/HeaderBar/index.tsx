import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "theme";

import { AntDesign } from "@expo/vector-icons";
import Typography from "components/Typography";
import { useGetCustomColor } from "hooks/useGetCustomColor";
import { IS_ANDROID } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import LogoIcon from "../../../assets/images/icon.png";

export const BUTTON_HIT_SLOP = { top: 15, bottom: 15, left: 20, right: 20 };

const DISTANCE_FROM_THE_STATUS_BAR_ANDROID = 15;
const HEADER_MIN_HEIGHT = 50;
const LOGO_SIZE = 40;

type Props = {
  title?: string;
  marginBottom?: number;
  withBackArrow?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  bgColor?: string;
  withLogo?: boolean;
  trailingContent?: (textColor: string) => JSX.Element;
  onBackArrowPress?: () => void;
  onLogoPress?: () => void;
};

const HeaderBar = ({
  title = "",
  marginBottom = 0,
  withBackArrow = false,
  paddingHorizontal = 20,
  paddingVertical = 14,
  bgColor = theme.colors.cyan700,
  withLogo,
  trailingContent,
  onBackArrowPress,
  onLogoPress,
}: Props): JSX.Element => {
  const insets = useSafeAreaInsets();

  const navigation = useAppNavigation();

  const { textColor, isColorLight } = useGetCustomColor(bgColor);

  const distanceFromTheTop = IS_ANDROID
    ? insets.top + DISTANCE_FROM_THE_STATUS_BAR_ANDROID
    : insets.top;

  const gradientColors = useMemo(
    () =>
      [
        getDifferentColor(bgColor, 10),
        getDifferentColor(bgColor, -15),
      ] as const,
    [bgColor],
  );

  return (
    <Container>
      <StatusBar
        barStyle={isColorLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient start={{ x: 0.5, y: 0.1 }} colors={gradientColors}>
        <CoverView height={distanceFromTheTop} />
        <HeaderWrapper
          marginBottom={marginBottom}
          paddingVertical={paddingVertical}
          paddingHorizontal={paddingHorizontal}
        >
          <LeftActionsContainer>
            {withBackArrow && (
              <IconWrapper
                onPress={onBackArrowPress ?? navigation.goBack}
                hitSlop={BUTTON_HIT_SLOP}
                paddingHorizontal={5}
              >
                <AntDesign name="arrowleft" size={26} color={textColor} />
              </IconWrapper>
            )}
            {withLogo && (
              <LogoContainer hitSlop={BUTTON_HIT_SLOP} onPress={onLogoPress}>
                <Logo
                  source={LogoIcon}
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                  resizeMode="contain"
                />
              </LogoContainer>
            )}
          </LeftActionsContainer>
          <Title
            align="center"
            color={textColor}
            fontSize="lg"
            fontWeight="bold"
            numberOfLines={1}
            paddingHorizontal={35}
          >
            {title}
          </Title>
          <RightActionsContainer>
            {trailingContent?.(textColor)}
          </RightActionsContainer>
        </HeaderWrapper>
      </LinearGradient>
    </Container>
  );
};

const CoverView = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
  width: 100%;
`;

const Container = styled.View`
  elevation: 30;
  background-color: ${theme.colors.cyan600};
  width: 100%;
`;

const HeaderWrapper = styled.View<{
  marginBottom: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
}>`
  z-index: 100;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.marginBottom}px;
  min-height: ${HEADER_MIN_HEIGHT}px;
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
  padding-vertical: ${(props) => props.paddingVertical}px;
`;

const IconWrapper = styled.TouchableOpacity<{ paddingHorizontal?: number }>`
  padding-horizontal: ${(props) => props.paddingHorizontal ?? 10}px;
  max-width: 32px;
  max-height: 32px;
  z-index: 2;
`;

const Title = styled(Typography)`
  flex: 1;
`;

const LogoContainer = styled.TouchableOpacity`
  margin-left: 5px;
  z-index: 10;
`;

const LeftActionsContainer = styled.View`
  position: absolute;
  left: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const RightActionsContainer = styled.View`
  position: absolute;
  right: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 20px;
`;

const Logo = styled.Image`
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
`;

export default React.memo(HeaderBar);
