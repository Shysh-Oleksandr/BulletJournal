import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import Toast from "react-native-toast-message";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import Input from "components/Input";
import SwipeableItem from "components/SwipeableItem";
import { BUTTON_HIT_SLOP } from "modules/app/constants";
import { CustomUserEvents } from "modules/app/types";
import { notesApi } from "modules/notes/api/notesApi";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { logUserEvent } from "utils/logUserEvent";

import { CustomLabel } from "../../types";
import ColorPicker from "../noteForm/ColorPicker";

type Props = {
  label: CustomLabel;
  isActive: boolean;
  isEditing: boolean;
  currentNoteColor: string;
  onChoose: (typeId: string | null, shouldCloseModal?: boolean) => void;
  onEditBtnPress: (typeId: string | null) => void;
  setTypes: React.Dispatch<React.SetStateAction<CustomLabel[]>>;
  onSelectColor: (color: string) => void;
};

const LabelItem = ({
  label,
  isActive,
  isEditing,
  currentNoteColor,
  onChoose,
  onEditBtnPress,
  setTypes,
  onSelectColor,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { mutate: updateLabel } = notesApi.useUpdateLabelMutation();
  const { mutate: deleteLabel } = notesApi.useDeleteLabelMutation();

  const { width: screenWidth } = useWindowDimensions();
  const [name, setName] = useState(label.labelName);
  const [currentColor, setCurrentColor] = useState(label.color);

  const saveChanges = useCallback(async () => {
    onEditBtnPress(null);

    if (name.trim() === "") {
      setName(label.labelName);

      return;
    }

    if (label.color === currentColor && label.labelName === name) return;

    const updatedType: CustomLabel = {
      ...label,
      labelName: name,
      color: currentColor,
    };

    logUserEvent(CustomUserEvents.UPDATE_LABEL, { labelId: label._id });
    addCrashlyticsLog(`User tries to update the label ${label._id}`);

    updateLabel(updatedType);

    Toast.show({
      type: "success",
      text1: t("general.success"),
      text2: t(
        label.isCategoryLabel ? "note.categoryUpdated" : "note.typeUpdated",
      ),
    });

    setTypes((prev) =>
      prev.map((item) => (item._id !== label._id ? item : updatedType)),
    );
  }, [onEditBtnPress, label, currentColor, name, updateLabel, setTypes, t]);

  const onDelete = useCallback(() => {
    if (isActive) {
      onChoose(null, false);
    } else {
      onEditBtnPress(null);
    }

    logUserEvent(CustomUserEvents.DELETE_LABEL, { labelId: label._id });
    addCrashlyticsLog(`User tries to delete the label ${label._id}`);

    Toast.show({
      type: "success",
      text1: t("general.success"),
      text2: t(
        label.isCategoryLabel ? "note.categoryDeleted" : "note.typeDeleted",
      ),
    });

    setTypes((prev) => prev.filter((item) => item._id !== label._id));
    deleteLabel(label._id);
  }, [
    isActive,
    label._id,
    label.isCategoryLabel,
    t,
    setTypes,
    deleteLabel,
    onChoose,
    onEditBtnPress,
  ]);

  const onPress = useCallback(() => {
    onChoose(label._id);
  }, [onChoose, label._id]);

  return (
    <SwipeableItem
      onPress={onPress}
      swipeEnabled={isEditing}
      isPressDisabled={isEditing}
      activeOpacity={isActive ? 0.5 : 0.2}
      onDelete={onDelete}
    >
      <TypeItemContainer isActive={isActive} isEditing={isEditing}>
        <ColorPickerContainer>
          <ColorPicker
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            isEditing={isEditing}
            isFormItem={false}
            isSelected={currentNoteColor === currentColor}
            onPress={isEditing ? undefined : () => onSelectColor(currentColor)}
          />
        </ColorPickerContainer>
        <Input
          value={name}
          placeholder={t(
            label.isCategoryLabel
              ? "note.enterCategoryName"
              : "note.enterTypeName",
          )}
          bgColor="transparent"
          paddingHorizontal={0}
          maxWidth={screenWidth - 75 * 2}
          withBorder={isEditing}
          labelColor={
            isActive && !isEditing
              ? theme.colors.white
              : theme.colors.darkBlueText
          }
          isCentered
          multiline={!isEditing}
          selectTextOnFocus
          editable={isEditing}
          onChange={(text) => setName(text)}
        />
        <EditIconContainer
          hitSlop={BUTTON_HIT_SLOP}
          onPress={isEditing ? saveChanges : () => onEditBtnPress(label._id)}
        >
          <MaterialIcons
            name={isEditing ? "check" : "edit"}
            size={isEditing ? 30 : 28}
            color={
              isActive && !isEditing ? theme.colors.white : theme.colors.cyan500
            }
          />
        </EditIconContainer>
      </TypeItemContainer>
    </SwipeableItem>
  );
};

const TypeItemContainer = styled.View<{
  isActive: boolean;
  isEditing: boolean;
}>`
  width: 100%;
  padding: 12px 12px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  border-radius: 4px;

  ${({ isActive }) => isActive && `background-color: ${theme.colors.cyan500};`}
  ${({ isEditing, isActive }) =>
    isEditing &&
    `
     
      background-color: ${
        isActive ? theme.colors.cyan300 : theme.colors.cyan300
      };
    `}
`;

const EditIconContainer = styled.TouchableOpacity`
  width: 36px;
  align-items: center;
  justify-content: center;
`;

const ColorPickerContainer = styled.View``;

export default React.memo(LabelItem);
