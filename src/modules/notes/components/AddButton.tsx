import React from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";

import { EMPTY_NOTE } from "../data";

const AddButton = (): JSX.Element => {
  const navigation = useAppNavigation();

  return (
    <Container
      onPress={() =>
        navigation.navigate(Routes.EDIT_NOTE, {
          item: EMPTY_NOTE,
          isNewNote: true,
        })
      }
    >
      <Entypo name="edit" size={34} color={theme.colors.white} />
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  z-index: 9999;
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 70px;
  height: 70px;
  border-radius: 999px;
  background-color: ${theme.colors.cyan600};
  align-items: center
  justify-content: center;
`;

export default React.memo(AddButton);
