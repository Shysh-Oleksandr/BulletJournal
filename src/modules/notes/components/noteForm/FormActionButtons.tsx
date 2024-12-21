import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import Button from "components/Button";
import { TypographyProps } from "components/Typography";

const SaveIcon = <Entypo name="save" size={20} color={theme.colors.white} />;
const DeleteIcon = (
  <MaterialIcons name="delete" size={22} color={theme.colors.white} />
);
const ArchiveIcon = (
  <Entypo name="archive" size={20} color={theme.colors.white} />
);

const labelProps: TypographyProps = {
  fontWeight: "bold",
  fontSize: "xl",
  paddingHorizontal: 8,
};

type Props = {
  isSaving: boolean;
  isDeleting: boolean;
  isNewItem: boolean;
  disabled?: boolean;
  isLocked?: boolean;
  isArchived?: boolean;
  saveItem: () => Promise<void>;
  deleteItem: () => void;
  archiveItem?: () => void;
};

const FormActionButtons = ({
  isSaving,
  isDeleting,
  isNewItem,
  disabled,
  isLocked,
  isArchived,
  saveItem,
  deleteItem,
  archiveItem,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Button
        label={t(isNewItem ? "note.create" : "note.update")}
        onPress={saveItem}
        bgColor={theme.colors.cyan600}
        marginTop={20}
        disabled={isLocked || disabled || isSaving || isDeleting}
        isLoading={isSaving}
        labelProps={labelProps}
        Icon={SaveIcon}
      />
      {!isNewItem && archiveItem && (
        <Button
          label={t(isArchived ? "habits.unarchive" : "habits.archive")}
          onPress={archiveItem}
          bgColor={isArchived ? theme.colors.cyan500 : theme.colors.cyan700}
          shouldReverseBgColor={isArchived}
          marginTop={8}
          disabled={isSaving || isDeleting}
          labelProps={labelProps}
          Icon={ArchiveIcon}
        />
      )}
      {!isNewItem && (
        <Button
          label={t("note.delete")}
          onPress={deleteItem}
          bgColor={theme.colors.red600}
          marginTop={8}
          disabled={isLocked || isSaving || isDeleting}
          isLoading={isDeleting}
          labelProps={labelProps}
          Icon={DeleteIcon}
        />
      )}
    </>
  );
};

export default FormActionButtons;
