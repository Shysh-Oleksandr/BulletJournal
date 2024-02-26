import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import Button from "components/Button";

const SaveIcon = <Entypo name="save" size={20} color={theme.colors.white} />;
const DeleteIcon = (
  <MaterialIcons name="delete" size={22} color={theme.colors.white} />
);

type Props = {
  isSaving: boolean;
  isDeleting: boolean;
  isNewNote: boolean;
  hasNoChanges: boolean;
  isLocked: boolean;
  saveNote: () => Promise<void>;
  deleteNote: () => void;
};

const NoteActionButtons = ({
  isSaving,
  isDeleting,
  isNewNote,
  hasNoChanges,
  isLocked,
  saveNote,
  deleteNote,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Button
        label={t(isNewNote ? "note.create" : "note.update")}
        onPress={saveNote}
        bgColor={theme.colors.cyan600}
        marginTop={20}
        disabled={isLocked || hasNoChanges || isSaving || isDeleting}
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
          label={t("note.delete")}
          onPress={deleteNote}
          bgColor={theme.colors.red600}
          marginTop={8}
          disabled={isLocked || isSaving || isDeleting}
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
};

export default NoteActionButtons;
