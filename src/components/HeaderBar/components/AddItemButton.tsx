import React from "react";

import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { getEmptyNote } from "modules/notes/util/getEmptyNote";
import styled from "styled-components/native";

type Props = {
  textColor: string;
  onPress?: () => void;
};

const AddItemButton = ({ textColor, onPress }: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const route = useRoute();

  return (
    <AddButtonContainer
      onPress={() => {
        if (onPress) {
          onPress();

          return;
        }

        const relevantNavFn =
          route.name === Routes.EDIT_NOTE
            ? navigation.replace
            : navigation.navigate;

        relevantNavFn(Routes.EDIT_NOTE, {
          item: getEmptyNote(),
          isNewNote: true,
        });
      }}
      hitSlop={SMALL_BUTTON_HIT_SLOP}
    >
      <Entypo name="plus" size={30} color={textColor} />
    </AddButtonContainer>
  );
};

const AddButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export default React.memo(AddItemButton);
