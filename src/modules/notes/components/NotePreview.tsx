import React, { useCallback } from "react";

import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";

import { Note } from "../types";

import NoteBody from "./NoteBody";

type Props = {
  item: Note;
};

const NotePreview = ({ item }: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const onPress = useCallback(() => {
    navigation.navigate(Routes.EDIT_NOTE, { item });
  }, [item, navigation]);

  return <NoteBody {...item} onPress={onPress} />;
};

export default React.memo(NotePreview);
