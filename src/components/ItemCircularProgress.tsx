import React, { useMemo } from "react";
import { Easing, TextInput } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import theme from "theme";

import Checkbox from "components/Checkbox";
import Input from "components/Input";
import { useHabitColors } from "modules/habits/hooks/useHabitColors";
import styled from "styled-components/native";
import { noop } from "utils/utilityFunctions";

const CIRCLE_SIZE = 42;
const CIRCLE_WIDTH = 5;

type Props = {
  color: string;
  isCheckType: boolean;
  inputValue: string;
  isCompleted: boolean;
  percentageCompleted?: number;
  circleSize?: number;
  circleWidth?: number;
  inputRef?: React.MutableRefObject<TextInput | null>;
  handleUpdate?: () => void;
  onChange?: (text: string) => void;
};

const ItemCircularProgress = ({
  color,
  isCheckType,
  inputValue,
  isCompleted,
  percentageCompleted,
  inputRef,
  circleSize = CIRCLE_SIZE,
  circleWidth = CIRCLE_WIDTH,
  handleUpdate,
  onChange,
}: Props): JSX.Element => {
  const { textColor, checkboxBgColor, tintColor, bgTintColor } = useHabitColors(
    isCompleted,
    color,
  );

  const inputFontSize = useMemo(() => {
    const adjustedInputLength =
      inputValue.length + (circleSize < CIRCLE_SIZE ? 1 : 0);

    if (adjustedInputLength < 3) return "md";

    if (adjustedInputLength < 4) return "sm";

    if (adjustedInputLength < 5) return "xs";

    return "xxs";
  }, [circleSize, inputValue.length]);

  return (
    <AnimatedCircularProgress
      duration={600}
      easing={Easing.ease}
      fill={Math.min(percentageCompleted ?? 0, 100)}
      size={circleSize}
      width={circleWidth}
      rotation={0}
      tintColor={tintColor}
      backgroundColor={bgTintColor}
    >
      {() => (
        <InnerContainer isCompleted={isCompleted}>
          {isCheckType ? (
            <Checkbox
              isActive={isCompleted}
              borderRadius={0}
              size={circleSize}
              iconSize={theme.fontSizes.md}
              iconColor={textColor}
              bgColor={checkboxBgColor}
            />
          ) : (
            <>
              <Input
                value={inputValue}
                inputRef={inputRef}
                isCentered
                paddingHorizontal={0}
                maxLength={7}
                numberOfLines={1}
                keyboardType="number-pad"
                fontWeight="semibold"
                labelColor={textColor}
                bgColor={checkboxBgColor}
                withBorder={false}
                selectTextOnFocus
                fontSize={inputFontSize}
                onChange={onChange ?? noop}
                onBlur={handleUpdate}
                editable={!!onChange}
              />
            </>
          )}
        </InnerContainer>
      )}
    </AnimatedCircularProgress>
  );
};

const InnerContainer = styled.View<{ isCompleted: boolean }>`
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default React.memo(ItemCircularProgress);
