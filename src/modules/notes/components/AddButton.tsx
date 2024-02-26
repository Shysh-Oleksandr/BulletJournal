import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import { CustomUserEvents } from "modules/app/types";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";
import { logUserEvent } from "utils/logUserEvent";

import { getEmptyNote } from "../util/getEmptyNote";

const SIZE = 70;
const BG_COLOR = theme.colors.cyan600;
const TOP_GRADIENT_COLOR = getDifferentColor(BG_COLOR, 10);
const BOTTOM_GRADIENT_COLOR = getDifferentColor(BG_COLOR, -15);

const COLORS = [TOP_GRADIENT_COLOR, BOTTOM_GRADIENT_COLOR];

const AddButton = (): JSX.Element => {
  const navigation = useAppNavigation();

  return (
    <Container>
      <IconContainer
        onPress={() => {
          logUserEvent(CustomUserEvents.ADD_ICON_PRESS);

          navigation.navigate(Routes.EDIT_NOTE, {
            item: getEmptyNote(),
            isNewNote: true,
          });
        }}
      >
        <SLinearGradient colors={COLORS}>
          <Entypo name="edit" size={34} color={theme.colors.white} />
        </SLinearGradient>
      </IconContainer>
    </Container>
  );
};

const IconContainer = styled.TouchableOpacity`
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 999px;
  elevation: 12;
`;

const SLinearGradient = styled(LinearGradient)`
  width: ${SIZE}px;
  height: ${SIZE}px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
`;

const Container = styled.View`
  z-index: 9999;
  position: absolute;
  bottom: 25px;
  right: 20px;
`;

export default React.memo(AddButton);
