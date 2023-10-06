import React from "react";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import Button from "components/Button";

const SaveIcon = <Entypo name="save" size={20} color={theme.colors.white} />;
const DeleteIcon = (
  <MaterialIcons name="delete" size={20} color={theme.colors.white} />
);

type Props = {
  isSaving: boolean;
  isDeleting: boolean;
  isNewNote: boolean;
  saveNote: () => Promise<void>;
  deleteNote: () => Promise<void>;
};

const NoteActionButtons = ({
  isSaving,
  isDeleting,
  isNewNote,
  saveNote,
  deleteNote,
}: Props): JSX.Element => (
  <>
    <Button
      label={isNewNote ? "Create" : "Update"}
      onPress={saveNote}
      bgColor={theme.colors.cyan600}
      marginTop={20}
      disabled={isSaving || isDeleting}
      isLoading={isSaving}
      labelProps={{
        fontWeight: "bold",
        fontSize: "xl",
        paddingHorizontal: 8,
      }}
      Icon={SaveIcon}
    />
    {!isNewNote && (
      <Button
        label="Delete"
        onPress={deleteNote}
        bgColor={theme.colors.red600}
        marginTop={8}
        disabled={isSaving || isDeleting}
        isLoading={isDeleting}
        labelProps={{
          fontWeight: "bold",
          fontSize: "xl",
          paddingHorizontal: 8,
        }}
        Icon={DeleteIcon}
      />
    )}
  </>
);

export default NoteActionButtons;
