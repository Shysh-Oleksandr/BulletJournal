import React from "react";
import { TextInput } from "react-native";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
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
  onReset,
}: Props): JSX.Element => {
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
            onReset ? (
              <IconContainer
                leftOffset={0}
                hitSlop={SMALL_BUTTON_HIT_SLOP}
                onPress={onReset}
              >
                <MaterialIcons
                  name="restore"
                  size={28}
                  color={theme.colors.cyan600}
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
