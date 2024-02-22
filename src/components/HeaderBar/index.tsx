import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "theme";

import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Typography from "components/Typography";
import { IS_ANDROID, SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { getEmptyNote } from "modules/notes/util/getEmptyNote";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import LogoIcon from "../../../assets/images/icon.png";

import LogoutBtn from "./components/LogoutBtn";

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
  withLogoutBtn?: boolean;
  withSearch?: boolean;
  withAddBtn?: boolean;
  onBackArrowPress?: () => void;
  onLogoPress?: () => void;
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
  withSearch,
  withAddBtn,
  onBackArrowPress,
  onLogoPress,
}: Props): JSX.Element => {
  const insets = useSafeAreaInsets();

  const navigation = useAppNavigation();

  const distanceFromTheTop = IS_ANDROID
    ? insets.top + DISTANCE_FROM_THE_STATUS_BAR_ANDROID
    : insets.top;

  const [topGradientColor, bottomGradientColor] = useMemo(
    () => [getDifferentColor(bgColor, 10), getDifferentColor(bgColor, -15)],
    [bgColor],
  );

  return (
    <Container>
      <LinearGradient
        start={{ x: 0.5, y: 0.1 }}
        colors={[topGradientColor, bottomGradientColor]}
      >
        <CoverView height={distanceFromTheTop} />
        <HeaderWrapper
          marginBottom={marginBottom}
          paddingVertical={paddingVertical}
          paddingHorizontal={paddingHorizontal}
        >
          {withBackArrow && (
            <IconWrapper
              onPress={onBackArrowPress ?? navigation.goBack}
              hitSlop={BUTTON_HIT_SLOP}
              paddingHorizontal={5}
            >
              <AntDesign
                name="arrowleft"
                size={26}
                color={theme.colors.white}
              />
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
          <Title
            align="center"
            color={theme.colors.white}
            fontSize="lg"
            fontWeight="bold"
            paddingRight={withAddBtn ? 0 : 30}
          >
            {title}
          </Title>
          {withSearch && (
            <SearchButtonContainer
              onPress={() => navigation.navigate(Routes.SEARCH)}
              hitSlop={SMALL_BUTTON_HIT_SLOP}
            >
              <Ionicons name="search" size={26} color={theme.colors.white} />
            </SearchButtonContainer>
          )}
          {withLogoutBtn && <LogoutBtn />}
          {withAddBtn && (
            <AddNoteButtonContainer
              onPress={() => {
                navigation.replace(Routes.EDIT_NOTE, {
                  item: getEmptyNote(),
                  isNewNote: true,
                });
              }}
              hitSlop={SMALL_BUTTON_HIT_SLOP}
            >
              <Entypo name="plus" size={30} color={theme.colors.white} />
            </AddNoteButtonContainer>
          )}
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
`;

const SearchButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding-right: 20px;
`;

const AddNoteButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding-right: 5px;
`;

const Logo = styled.Image`
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
`;

export default React.memo(HeaderBar);
