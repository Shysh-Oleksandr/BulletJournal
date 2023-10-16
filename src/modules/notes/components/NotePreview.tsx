import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import theme from "theme";

import Typography from "components/Typography";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";

import { Note } from "../types";

import NoteBody from "./NoteBody";

type Props = {
  item: Note;
  isLast: boolean;
};

const NotePreview = ({ item, isLast }: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const date = useMemo(
    () => new Date(item.startDate).toDateString(),
    [item.startDate],
  );

  const onPress = useCallback(() => {
    navigation.navigate(Routes.EDIT_NOTE, { item });
  }, [item, navigation]);

  return (
    <View>
      <DateContainer>
        <Typography
          fontWeight="medium"
          fontSize="lg"
          paddingBottom={2}
          color={theme.colors.darkBlueText}
        >
          {date}
        </Typography>
        <VerticalLine />
      </DateContainer>
      <NoteBody {...item} onPress={onPress} />
      {!isLast && <VerticalLine />}
    </View>
  );
};

const DateContainer = styled.View`
  width: 100%;
`;

const VerticalLine = styled.View`
  width: 4px;
  height: 24px;
  background-color: ${theme.colors.gray};
  border-radius: 15px;
  margin-left: 30px;
`;

export default React.memo(NotePreview);
