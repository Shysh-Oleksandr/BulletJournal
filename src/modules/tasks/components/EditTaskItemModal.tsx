import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Input from "components/Input";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import ColorPicker from "modules/notes/components/noteForm/ColorPicker";
import styled from "styled-components/native";

import DueDatePicker from "./DueDatePicker";

const DEFAULT_COLOR = theme.colors.darkBlueText;

export type InputSubmitProps = {
  title: string;
  color: string;
  dueDate?: number | null;
};

type Props = {
  inputPlaceholder: string;
  withDueDatePicker?: boolean;
  defaultTitle?: string;
  defaultColor?: string;
  defaultDueDate?: number | null;
  onInputSubmit: (props: InputSubmitProps) => void;
  onDelete?: () => void;
  children: (openModal: () => void) => JSX.Element;
};

const EditTaskItemModal = ({
  inputPlaceholder,
  withDueDatePicker = true,
  defaultTitle = "",
  defaultColor = DEFAULT_COLOR,
  defaultDueDate = null,
  onInputSubmit,
  onDelete,
  children,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const inputRef = useRef<TextInput | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(defaultTitle);
  const [currentColor, setCurrentColor] = useState(defaultColor);
  const [dueDate, setDueDate] = useState<number | null>(defaultDueDate);

  const [isDiscardChangesAlertVisible, setIsDiscardChangesAlertVisible] =
    useState(false);
  const [isDeletionAlertVisible, setIsDeletionAlertVisible] = useState(false);

  const closeModal = (withAlert = true) => {
    const showAlert =
      withAlert &&
      (inputValue !== defaultTitle ||
        dueDate !== defaultDueDate ||
        currentColor !== defaultColor);

    if (showAlert) {
      setIsDiscardChangesAlertVisible(true);

      return;
    }

    setIsModalVisible(false);

    Keyboard.dismiss();
  };

  const openModal = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelection(inputValue.length, inputValue.length);
    }, 100);
  };

  const resetState = useCallback(() => {
    setInputValue(defaultTitle);
    setDueDate(defaultDueDate);
    setCurrentColor(defaultColor);
  }, [defaultColor, defaultDueDate, defaultTitle]);

  const handleInputSubmit = () => {
    closeModal(false);

    resetState();

    onInputSubmit({
      title: inputValue,
      color: currentColor,
      dueDate: dueDate || null,
    });
  };
  const handleInputDelete = () => {
    closeModal(false);

    onDelete?.();
  };

  useEffect(() => {
    resetState();
  }, [resetState]);

  return (
    <>
      {children(openModal)}

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => closeModal()}
        presentationStyle="overFullScreen"
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <ModalOverlay />
        </TouchableWithoutFeedback>

        <InputContainer>
          <InputSection>
            <Input
              inputRef={inputRef}
              value={inputValue}
              paddingHorizontal={0}
              placeholder={inputPlaceholder}
              isCentered
              maxLength={200}
              bgColor="transparent"
              fontSize="xl"
              fontWeight="semibold"
              onChange={setInputValue}
              onSubmitEditing={handleInputSubmit}
              labelColor={currentColor}
              LeftContent={
                onDelete ? (
                  <IconContainer
                    leftOffset={0}
                    hitSlop={SMALL_BUTTON_HIT_SLOP}
                    onPress={() => setIsDeletionAlertVisible(true)}
                  >
                    <MaterialIcons
                      name="delete"
                      size={28}
                      color={theme.colors.red600}
                    />
                  </IconContainer>
                ) : undefined
              }
              RightContent={
                <IconContainer rightOffset={0}>
                  <ColorPicker
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                    isFormItem={false}
                  />
                </IconContainer>
              }
            />
            {withDueDatePicker && (
              <DueDatePicker dueDate={dueDate} setDueDate={setDueDate} />
            )}
          </InputSection>
        </InputContainer>

        {onDelete && (
          <ConfirmAlert
            isDeletion
            message={t("general.deleteConfirmation")}
            isDialogVisible={isDeletionAlertVisible}
            setIsDialogVisible={setIsDeletionAlertVisible}
            onConfirm={handleInputDelete}
          />
        )}

        <ConfirmAlert
          title={t("general.discardChanges")}
          message={t("general.discardChangesDesc")}
          isDialogVisible={isDiscardChangesAlertVisible}
          setIsDialogVisible={setIsDiscardChangesAlertVisible}
          onConfirm={() => {
            closeModal(false);
            resetState();
          }}
        />
      </Modal>
    </>
  );
};

const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const InputContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const InputSection = styled.View`
  width: 100%;
  background-color: white;
  padding: 16px;
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

export default React.memo(EditTaskItemModal);
