import { debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import WheelColorPicker from "react-native-wheel-color-picker";

import { Ionicons } from "@expo/vector-icons";
import CustomModal from "components/CustomModal";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import FormLabel from "./FormLabel";

type Props = {
  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
};

const ColorPicker = ({ currentColor, setCurrentColor }: Props): JSX.Element => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const showPicker = () => {
    setIsPickerVisible(true);
  };

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
    <Section>
      <ButtonContainer onPress={showPicker} hitSlop={SMALL_BUTTON_HIT_SLOP}>
        <Ionicons name="color-palette-sharp" size={24} color={currentColor} />
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
      <FormLabel label="Color" />
    </Section>
  );
};

const Section = styled.View`
  padding-top: 8px;
  width: 40px;
  align-items: center;
`;

const ButtonContainer = styled.TouchableOpacity``;

const PickerContainer = styled.View`
  width: 100%;
`;

export default ColorPicker;
