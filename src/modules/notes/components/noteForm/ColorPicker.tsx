import { debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import WheelColorPicker from "react-native-wheel-color-picker";
import theme from "theme";

import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import CustomModal from "components/CustomModal";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";
import { getShadedColor } from "utils/getDifferentColor";

import FormLabel from "./FormLabel";

const screenHeight = Dimensions.get("window").height;

const isSmallScreen = screenHeight < 700;
const isBigScreen = screenHeight > 800;

const regularModalHeight = isSmallScreen ? "57%" : "47%";
const modalHeight = isBigScreen ? "42%" : regularModalHeight;

const COLOR_PALETTE = [
  theme.colors.cyan300,
  theme.colors.gray,
  "#f7f21e",
  "#c11ba8",
  "#13f7c6",
  theme.colors.cyan600,
  "#006d52",
  "#914c07",
  "#6d0c0c",
  "#561c9e",
  "#162493",
  theme.colors.blackText,
];

type Props = {
  currentColor: string;
  isFormItem?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  onPress?: () => void;
};

const ColorPicker = ({
  currentColor,
  isFormItem = true,
  isEditing = false,
  isSelected = false,
  setCurrentColor,
  onPress,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const additionalIconColor = useMemo(
    () => getShadedColor(currentColor, 80),
    [currentColor],
  );

  const onColorChange = useCallback(
    (newColor: string) => {
      setCurrentColor(newColor);
    },
    [setCurrentColor],
  );

  const colorChangeDebouncer = useMemo(
    () => debounce(onColorChange, 200),
    [onColorChange],
  );

  const showPicker = () => {
    setIsPickerVisible(true);
  };

  return (
    <Section isFormItem={isFormItem}>
      <ButtonContainer
        onPress={onPress ?? showPicker}
        hitSlop={isFormItem ? SMALL_BUTTON_HIT_SLOP : BUTTON_HIT_SLOP}
      >
        <Ionicons
          name="color-palette-sharp"
          size={isFormItem ? 24 : 28}
          color={currentColor}
        />
        {isEditing && (
          <EditColorContainer>
            <MaterialIcons name="edit" size={16} color={additionalIconColor} />
          </EditColorContainer>
        )}
        {!isEditing && isSelected && (
          <EditColorContainer>
            <FontAwesome name="check" size={16} color={additionalIconColor} />
          </EditColorContainer>
        )}
      </ButtonContainer>

      <CustomModal
        isVisible={isPickerVisible}
        setIsVisible={setIsPickerVisible}
        height={modalHeight}
      >
        <PickerContainer>
          <WheelColorPicker
            color={currentColor}
            thumbSize={35}
            onColorChangeComplete={colorChangeDebouncer}
            shadeSliderThumb
            palette={COLOR_PALETTE}
          />
        </PickerContainer>
      </CustomModal>
      {isFormItem && <FormLabel label={t("note.color")} />}
    </Section>
  );
};

const Section = styled.View<{ isFormItem: boolean }>`
  ${({ isFormItem }) =>
    isFormItem &&
    `
      padding-top: 8px;
      min-width: 40px;
      flex: 0.15;
      align-items: center;
    `}
`;

const ButtonContainer = styled.TouchableOpacity``;

const PickerContainer = styled.View`
  width: 100%;
  background-color: ${theme.colors.red500};
`;

const EditColorContainer = styled.View`
  position: absolute;
  bottom: 0px;
  right: -2px;
  z-index: 100;
`;

export default ColorPicker;
