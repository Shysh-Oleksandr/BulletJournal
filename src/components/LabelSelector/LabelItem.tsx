import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import Toast from "react-native-toast-message";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import Input from "components/Input";
import SwipeableItem from "components/SwipeableItem";
import { BUTTON_HIT_SLOP } from "modules/app/constants";
import { CustomUserEvents } from "modules/app/types";
import { customLabelsApi } from "modules/customLabels/api/customLabelsApi";
import { CustomLabel, LabelFor } from "modules/customLabels/types";
import ColorPicker from "modules/notes/components/noteForm/ColorPicker";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { logUserEvent } from "utils/logUserEvent";

export type LabelItemProps = {
  label: CustomLabel;
  isActive: boolean;
  isEditing: boolean;
  currentItemColor: string;
  updatedLabelKey: string;
  deletedLabelKey: string;
  inputPlaceholderKey: string;
  labelFor: LabelFor;
  onChoose: (labelId: string | null, shouldCloseModal?: boolean) => void;
  onEditBtnPress: (labelId: string | null) => void;
  setItems: React.Dispatch<React.SetStateAction<CustomLabel[]>>;
  onSelectColor: (color: string) => void;
};

const LabelItem = ({
  label,
  isActive,
  isEditing,
  currentItemColor,
  updatedLabelKey,
  deletedLabelKey,
  inputPlaceholderKey,
  labelFor,
  onChoose,
  onEditBtnPress,
  setItems,
  onSelectColor,
}: LabelItemProps): JSX.Element => {
  const { t } = useTranslation();

  const { mutate: updateLabel } = customLabelsApi.useUpdateLabelMutation();
  const { mutate: deleteLabel } =
    customLabelsApi.useDeleteLabelMutation(labelFor);

  const { width: screenWidth } = useWindowDimensions();
  const [name, setName] = useState(label.labelName);
  const [currentColor, setCurrentColor] = useState(label.color);

  const saveChanges = useCallback(async () => {
    const normalizedName = name.trim();

    if (normalizedName === "") {
      setName(label.labelName);
      onEditBtnPress(null);

      return;
    }

    if (label.color === currentColor && label.labelName === normalizedName) {
      onEditBtnPress(null);

      return;
    }

    const updatedType: CustomLabel = {
      ...label,
      labelName: normalizedName,
      color: currentColor,
    };

    logUserEvent(CustomUserEvents.UPDATE_LABEL, { labelId: label._id });
    addCrashlyticsLog(`User tries to update the label ${label._id}`);

    updateLabel(updatedType);

    Toast.show({
      type: "success",
      text1: t("general.success"),
      text2: t(updatedLabelKey),
    });

    setItems((prev) =>
      prev.map((item) => (item._id !== label._id ? item : updatedType)),
    );

    onEditBtnPress(null);
  }, [
    onEditBtnPress,
    name,
    label,
    currentColor,
    updateLabel,
    t,
    updatedLabelKey,
    setItems,
  ]);

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
      text2: t(deletedLabelKey),
    });

    setItems((prev) => prev.filter((item) => item._id !== label._id));
    deleteLabel(label._id);
  }, [
    isActive,
    label._id,
    t,
    deletedLabelKey,
    setItems,
    deleteLabel,
    onChoose,
    onEditBtnPress,
  ]);

  const onPress = useCallback(() => {
    onChoose(label._id);
  }, [onChoose, label._id]);

  useEffect(() => {
    if (
      !isEditing &&
      (label.labelName !== name || label.color !== currentColor)
    ) {
      setName(label.labelName);
      setCurrentColor(label.color);
    }
  }, [currentColor, isEditing, label.color, label.labelName, name]);

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
            isSelected={currentItemColor === currentColor}
            onPress={isEditing ? undefined : () => onSelectColor(currentColor)}
          />
        </ColorPickerContainer>
        <Input
          value={name}
          placeholder={t(inputPlaceholderKey)}
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
