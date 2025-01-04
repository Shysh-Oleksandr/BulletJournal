import React, { useCallback, useState } from "react";
import {
  KeyboardType,
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
} from "react-native";
import theme from "theme";

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
  LeftContent?: JSX.Element;
  RightContent?: JSX.Element;
  keyboardType?: KeyboardType;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  selectTextOnFocus?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  withBorder?: boolean;
  withAutoFocus?: boolean;
  labelColor?: string;
  fontWeight?: keyof typeof theme.fonts;
  fontSize?: keyof typeof theme.fontSizes;
  maxWidth?: number;
  maxLength?: number;
  minHeight?: number;
  maxHeight?: number;
  numberOfLines?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius?: number;
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
  autoCapitalize,
  LeftContent,
  RightContent,
  fontWeight,
  fontSize,
  selectTextOnFocus,
  secureTextEntry,
  labelColor = theme.colors.darkBlueText,
  withBorder = true,
  withAutoFocus,
  multiline,
  maxWidth,
  numberOfLines = 1,
  maxLength = 50,
  minHeight = 40,
  maxHeight,
  paddingHorizontal = 20,
  paddingVertical = 8,
  borderRadius = 0,
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
      borderRadius={borderRadius}
    >
      {LeftContent}
      {!!placeholder && !value.length && (
        <PlaceholderContainer
          pointerEvents="none"
          paddingHorizontal={paddingHorizontal}
        >
          <Typography
            color={theme.colors.cyan700}
            align={isCentered ? "center" : "left"}
          >
            {placeholder}
          </Typography>
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
        paddingVertical={paddingVertical}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        keyboardType={keyboardType}
        maxLength={maxLength}
        selectTextOnFocus={selectTextOnFocus}
        numberOfLines={numberOfLines}
        multiline={multiline}
        cursorColor={theme.colors.cyan600}
        autoCorrect={false}
        labelColor={labelColor}
        autoFocus={withAutoFocus}
        onChangeText={onChange}
        onSubmitEditing={onSubmitEditing}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
      {RightContent}
    </InputWrapper>
  );
};

const InputWrapper = styled.KeyboardAvoidingView<{
  isFocused: boolean;
  withBorder: boolean;
  bgColor: string;
  maxWidth?: number;
  minHeight: number;
  borderRadius: number;
}>`
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: ${({ minHeight }) => minHeight}px;
  background-color: ${({ bgColor }) => bgColor};
  border-bottom-width: ${({ isFocused }) => (isFocused ? 3 : 2)}px;
  border-color: ${({ isFocused }) =>
    isFocused ? theme.colors.cyan400 : theme.colors.cyan200};
  border-radius: ${({ borderRadius }) => borderRadius}px;

  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth}px;`}
  ${({ withBorder }) => !withBorder && `border-bottom-width: 0;`}
`;

const CustomInput = styled.TextInput<{
  isCentered: boolean;
  fontWeight?: keyof typeof theme.fonts;
  fontSize?: keyof typeof theme.fontSizes;
  paddingHorizontal: number;
  paddingVertical: number;
  maxWidth?: number;
  maxHeight?: number;
  labelColor: string;
}>`
  width: 100%;
  color: ${({ labelColor }) => labelColor};
  font-size: ${({ fontSize }) => getFontSize(fontSize)}px;
  font-family: ${({ fontWeight }) => getFont(fontWeight)};
  text-align: ${({ isCentered }) => (isCentered ? "center" : "left")};
  padding-vertical: ${({ paddingVertical }) => paddingVertical}px;
  padding-horizontal: ${({ maxWidth, paddingHorizontal }) =>
    maxWidth && maxWidth < 60 ? 0 : paddingHorizontal}px;
  max-height: 180px;
  ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight}px;`}
`;

const PlaceholderContainer = styled.View<{ paddingHorizontal: number }>`
  position: absolute;
  width: 100%;
  opacity: 0.6;
  z-index: 10;
  padding-horizontal: ${({ paddingHorizontal }) => paddingHorizontal}px;
`;

export default Input;
