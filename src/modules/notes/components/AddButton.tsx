import React from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import { CustomUserEvents } from "modules/app/types";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { logUserEvent } from "utils/logUserEvent";

import { getEmptyNote } from "../util/getEmptyNote";

const SIZE = 70;

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
        <Entypo name="edit" size={34} color={theme.colors.white} />
      </IconContainer>
    </Container>
  );
};

const IconContainer = styled.TouchableOpacity`
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 999px;
  background-color: ${theme.colors.cyan600};
  align-items: center;
  justify-content: center;
  elevation: 12;
  z-index: 100;
`;

const Container = styled.View`
  z-index: 9999;
  position: absolute;
  bottom: 65px;
  right: 20px;
`;

export default React.memo(AddButton);
