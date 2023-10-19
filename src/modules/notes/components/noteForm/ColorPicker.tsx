import { debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import WheelColorPicker from "react-native-wheel-color-picker";

import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import CustomModal from "components/CustomModal";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import FormLabel from "./FormLabel";

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
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const showPicker = () => {
    setIsPickerVisible(true);
  };

  const additionalIconColor = useMemo(
    () => getDifferentColor(currentColor, 80),
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
      >
        <PickerContainer>
          <WheelColorPicker
            color={currentColor}
            discrete
            swatches={false}
            thumbSize={35}
            onColorChange={colorChangeDebouncer}
          />
        </PickerContainer>
      </CustomModal>
      {isFormItem && <FormLabel label="Color" />}
    </Section>
  );
};

const Section = styled.View<{ isFormItem: boolean }>`
  ${({ isFormItem }) =>
    isFormItem &&
    `
      padding-top: 8px;
      width: 40px;
      align-items: center;
    `}
`;

const ButtonContainer = styled.TouchableOpacity``;

const PickerContainer = styled.View`
  width: 100%;
`;

const EditColorContainer = styled.View`
  position: absolute;
  bottom: 0px;
  right: -2px;
  z-index: 100;
`;

export default ColorPicker;
