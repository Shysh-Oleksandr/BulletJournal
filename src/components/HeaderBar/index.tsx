import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "theme";

import { AntDesign, Entypo } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Typography from "components/Typography";
import { IS_ANDROID, SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import { logout } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { getEmptyNote } from "modules/notes/util/getEmptyNote";
import { useAppDispatch } from "store/helpers/storeHooks";
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
  withLogoutBtn?: boolean;
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
  withAddBtn,
  onBackArrowPress,
  onLogoPress,
}: Props): JSX.Element => {
  const insets = useSafeAreaInsets();

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const distanceFromTheTop = IS_ANDROID
    ? insets.top + DISTANCE_FROM_THE_STATUS_BAR_ANDROID
    : insets.top;

  const [topGradientColor, bottomGradientColor] = useMemo(
    () => [getDifferentColor(bgColor, 10), getDifferentColor(bgColor, -15)],
    [bgColor],
  );

  return (
    <Container>
      <LinearGradient colors={[topGradientColor, bottomGradientColor]}>
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
          {withLogoutBtn && (
            <LogoutButtonContainer
              onPress={() => setIsDialogVisible(true)}
              hitSlop={SMALL_BUTTON_HIT_SLOP}
            >
              <Entypo name="log-out" size={24} color={theme.colors.white} />
            </LogoutButtonContainer>
          )}
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
      <ConfirmAlert
        message="Are you sure you want to logout?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => dispatch(logout())}
      />
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

const LogoutButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.cyan600};
  border-radius: 6px;
  padding: 7px 9px 7px 12px;
  align-items: center;
  justify-content: center;
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
