import React, { useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import Input from "components/Input";
import SwipeableItem from "components/SwipeableItem";
import { BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import { notesApi } from "../../NotesApi";
import { CustomLabel } from "../../types";
import ColorPicker from "../noteForm/ColorPicker";

type Props = {
  type: CustomLabel;
  isActive: boolean;
  isEditing: boolean;
  currentNoteColor: string;
  onChoose: (typeId: string | null, shouldCloseModal?: boolean) => void;
  onEditBtnPress: (typeId: string | null) => void;
  setTypes: React.Dispatch<React.SetStateAction<CustomLabel[]>>;
  onSelectColor: (color: string) => void;
};

const TypeItem = ({
  type,
  isActive,
  isEditing,
  currentNoteColor,
  onChoose,
  onEditBtnPress,
  setTypes,
  onSelectColor,
}: Props): JSX.Element => {
  const [updateLabel] = notesApi.useUpdateLabelMutation();
  const [deleteLabel] = notesApi.useDeleteLabelMutation();

  const { width: screenWidth } = useWindowDimensions();
  const [name, setName] = useState(type.labelName);
  const [currentColor, setCurrentColor] = useState(type.color);

  const saveChanges = useCallback(async () => {
    onEditBtnPress(null);

    if (type.color === currentColor && type.labelName === name) return;

    const updatedType: CustomLabel = {
      ...type,
      labelName: name,
      color: currentColor,
    };

    updateLabel(updatedType);

    setTypes((prev) =>
      prev.map((item) => (item._id !== type._id ? item : updatedType)),
    );
  }, [currentColor, name, onEditBtnPress, setTypes, type, updateLabel]);

  const onDelete = useCallback(() => {
    if (isActive) {
      onChoose(null, false);
    } else {
      onEditBtnPress(null);
    }
    setTypes((prev) => prev.filter((item) => item._id !== type._id));
    deleteLabel(type._id);
  }, [type._id, isActive, onChoose, setTypes, onEditBtnPress, deleteLabel]);

  const onPress = useCallback(() => {
    onChoose(type._id);
  }, [onChoose, type._id]);

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
          placeholder="Enter a type name"
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
          onPress={isEditing ? saveChanges : () => onEditBtnPress(type._id)}
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

export default React.memo(TypeItem);
