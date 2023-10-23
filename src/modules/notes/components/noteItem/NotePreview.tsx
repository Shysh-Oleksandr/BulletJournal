import React, { useCallback } from "react";

import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";

import { Note } from "../../types";

import NoteBody from "./NoteBody";

type Props = {
  item: Note;
  index: number;
};

const NotePreview = ({ item, index }: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const onPress = useCallback(() => {
    navigation.navigate(Routes.EDIT_NOTE, { item, index });
  }, [item, index, navigation]);

  return <NoteBody {...item} onPress={onPress} />;
};

export default React.memo(NotePreview);
