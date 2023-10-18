import React, { useCallback, useState } from "react";
import {
  KeyboardType,
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
} from "react-native";
import theme from "theme";

import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import Typography from "./Typography";
import { getFont, getFontSize } from "./Typography/utils";

type Props = {
  value: string;
  placeholder?: string;
  bgColor?: string;
  editable?: boolean;
  isCentered?: boolean;
  inputRef?: React.MutableRefObject<TextInput | null>;
  Icon?: JSX.Element;
  keyboardType?: KeyboardType;
  selectTextOnFocus?: boolean;
  multiline?: boolean;
  withBorder?: boolean;
  labelColor?: string;
  fontWeight?: keyof typeof theme.fonts;
  fontSize?: keyof typeof theme.fontSizes;
  maxWidth?: number;
  maxLength?: number;
  minHeight?: number;
  numberOfLines?: number;
  paddingHorizontal?: number;
  onIconPress?: () => void;
  onChange: (text: string) => void;
  onSubmitEditing?: (
    text: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

const Input = ({
  value,
  placeholder,
  bgColor = theme.colors.cyan300,
  editable = true,
  isCentered = false,
  inputRef,
  keyboardType,
  Icon,
  fontWeight,
  fontSize,
  selectTextOnFocus,
  labelColor = theme.colors.darkBlueText,
  withBorder = true,
  multiline,
  maxWidth,
  numberOfLines = 1,
  maxLength = 50,
  minHeight = 40,
  paddingHorizontal = 20,
  onIconPress,
  onChange,
  onSubmitEditing,
  onBlur,
  onFocus,
}: Props): JSX.Element => {
  const [isKeyboardShown, setKeyboardShown] = useState(false);

  const handleInputFocus = useCallback(() => {
    setKeyboardShown(true);

    onFocus?.();
  }, [onFocus]);

  const handleInputBlur = useCallback(() => {
    setKeyboardShown(false);

    onBlur?.();
  }, [onBlur]);

  return (
    <InputWrapper
      isFocused={isKeyboardShown}
      bgColor={bgColor}
      withBorder={withBorder}
      maxWidth={maxWidth}
      minHeight={minHeight}
    >
      {!!placeholder && !value.length && (
        <PlaceholderContainer pointerEvents="none">
          <Typography color={theme.colors.cyan700}>{placeholder}</Typography>
        </PlaceholderContainer>
      )}
      <CustomInput
        value={value}
        editable={editable}
        pointerEvents={editable ? "auto" : "none"}
        isCentered={isCentered}
        ref={inputRef}
        fontWeight={fontWeight}
        fontSize={fontSize}
        paddingHorizontal={paddingHorizontal}
        maxWidth={maxWidth}
        keyboardType={keyboardType}
        maxLength={maxLength}
        selectTextOnFocus={selectTextOnFocus}
        numberOfLines={numberOfLines}
        multiline={multiline}
        labelColor={labelColor}
        onChangeText={onChange}
        onSubmitEditing={onSubmitEditing}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
      />
      {Icon && (
        <IconContainer
          disabled={!onIconPress}
          onPress={onIconPress}
          hitSlop={SMALL_BUTTON_HIT_SLOP}
        >
          {Icon}
        </IconContainer>
      )}
    </InputWrapper>
  );
};

const InputWrapper = styled.KeyboardAvoidingView<{
  isFocused: boolean;
  withBorder: boolean;
  bgColor: string;
  maxWidth?: number;
  minHeight: number;
}>`
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: ${({ minHeight }) => minHeight}px;
  background-color: ${({ bgColor }) => bgColor};
  border-bottom-width: ${({ isFocused }) => (isFocused ? 3 : 2)}px;
  border-color: ${({ isFocused }) =>
    isFocused ? theme.colors.cyan400 : theme.colors.cyan200};

  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth}px;`}
  ${({ withBorder }) => !withBorder && `border-bottom-width: 0;`}
`;

const CustomInput = styled.TextInput<{
  isCentered: boolean;
  fontWeight?: keyof typeof theme.fonts;
  fontSize?: keyof typeof theme.fontSizes;
  paddingHorizontal: number;
  maxWidth?: number;
  labelColor: string;
}>`
  width: 100%;
  color: ${theme.colors.darkBlueText};
  color: ${({ labelColor }) => labelColor};
  font-size: ${({ fontSize }) => getFontSize(fontSize)}px;
  font-family: ${({ fontWeight }) => getFont(fontWeight)};
  text-align: ${({ isCentered }) => (isCentered ? "center" : "left")};
  padding-vertical: 8px;
  padding-horizontal: ${({ maxWidth, paddingHorizontal }) =>
    maxWidth && maxWidth < 60 ? 0 : paddingHorizontal}px;
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  right: 5px;
  z-index: 1000;
`;

const PlaceholderContainer = styled.View`
  position: absolute;
  opacity: 0.6;
  z-index: 10;
`;

export default Input;
