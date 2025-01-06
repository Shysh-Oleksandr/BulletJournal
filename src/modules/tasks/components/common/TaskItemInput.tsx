import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Input from "components/Input";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import ColorPicker from "modules/notes/components/noteForm/ColorPicker";
import styled from "styled-components/native";

type Props = {
  inputPlaceholder: string;
  name: string;
  color: string;
  inputRef?: React.MutableRefObject<TextInput | null>;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  onSubmitEditing?: () => void;
  onDelete?: () => void;
  onReset?: () => void;
};

const TaskItemInput = ({
  name,
  inputPlaceholder,
  color,
  inputRef,
  setName,
  setColor,
  onSubmitEditing,
  onDelete,
  onReset,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [isDeletionAlertVisible, setIsDeletionAlertVisible] = useState(false);

  return (
    <>
      <InputSection>
        <Input
          inputRef={inputRef}
          value={name}
          paddingHorizontal={32}
          placeholder={inputPlaceholder}
          isCentered
          maxLength={200}
          bgColor="transparent"
          fontSize="xl"
          fontWeight="semibold"
          onChange={setName}
          labelColor={color}
          onSubmitEditing={onSubmitEditing}
          LeftContent={
            onDelete || onReset ? (
              <IconContainer
                leftOffset={0}
                hitSlop={SMALL_BUTTON_HIT_SLOP}
                onPress={onReset ?? (() => setIsDeletionAlertVisible(true))}
              >
                <MaterialIcons
                  name={onReset ? "restore" : "delete"}
                  size={28}
                  color={onReset ? theme.colors.cyan600 : theme.colors.red600}
                />
              </IconContainer>
            ) : undefined
          }
          RightContent={
            <IconContainer rightOffset={0}>
              <ColorPicker
                currentColor={color}
                setCurrentColor={setColor}
                isFormItem={false}
              />
            </IconContainer>
          }
        />
      </InputSection>

      {onDelete && (
        <ConfirmAlert
          isDeletion
          message={t("general.deleteConfirmation")}
          isDialogVisible={isDeletionAlertVisible}
          setIsDialogVisible={setIsDeletionAlertVisible}
          onConfirm={onDelete}
        />
      )}
    </>
  );
};

const InputSection = styled.View`
  width: 100%;
  background-color: white;
`;

const IconContainer = styled.TouchableOpacity<{
  rightOffset?: number;
  leftOffset?: number;
}>`
  position: absolute;
  ${({ rightOffset }) =>
    rightOffset !== undefined && `right: ${rightOffset}px;`}
  ${({ leftOffset }) => leftOffset !== undefined && `left: ${leftOffset}px;`}
  z-index: 1000;
`;

export default React.memo(TaskItemInput);
