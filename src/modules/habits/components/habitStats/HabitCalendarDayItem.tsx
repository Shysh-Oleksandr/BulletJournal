import React, { useMemo, useRef, useState } from "react";
import { TextInput, useWindowDimensions } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import theme from "theme";

import Input from "components/Input";
import Typography from "components/Typography";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { useUpdateHabitLog } from "modules/habits/hooks/useUpdateHabitLog";
import { Habit, HabitTypes } from "modules/habits/types";
import styled from "styled-components/native";
import { noop } from "utils/utilityFunctions";

const CIRCLE_SIZE = 35;
const OPTIONAL_CIRCLE_SIZE = 30;
const CIRCLE_WIDTH = 3;

type Props = {
  habit: Habit;
  percentageCompleted: number;
  day: number;
  timestamp: number;
  isOptional: boolean;
  isDisabled: boolean;
  streakState?: {
    displayRightLine: boolean;
    displayLeftLine: boolean;
  };
};

const HabitCalendarDayItem = ({
  habit,
  percentageCompleted,
  day,
  timestamp,
  isOptional,
  isDisabled,
  streakState,
}: Props): JSX.Element => {
  const { width: screenWidth } = useWindowDimensions();

  const isWideScreen = screenWidth > 400;

  const inputRef = useRef<TextInput | null>(null);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;
  const { inputValue, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate: timestamp,
  });

  const {
    isColorLight,
    textColor: labelTextColor,
    bgColor: completedBgColor,
    optionalBgColor,
  } = useHabitStatColors(habit.color);

  const [shouldDisplayInput, setShouldDisplayInput] = useState(false);

  const isCompleted = percentageCompleted >= 100;

  const isDayOptional = isOptional && !isDisabled && !isCompleted;

  const itemSize = isDayOptional ? OPTIONAL_CIRCLE_SIZE : CIRCLE_SIZE;

  const inputFontSize = useMemo(() => {
    if (inputValue.length < 3) return "md";

    if (inputValue.length < 4) return "sm";

    if (inputValue.length < 5) return "xs";

    return "xxs";
  }, [inputValue.length]);

  const { bgColor, textColor, tintColor, tintBgColor } = useMemo(() => {
    let bgColor = theme.colors.white;
    let textColor = theme.colors.cyan600;
    let tintColor = theme.colors.cyan500;
    let tintBgColor = theme.colors.cyan400;

    if (isDisabled) {
      bgColor = theme.colors.cyan400;
    } else if (isCompleted) {
      bgColor = completedBgColor;
      textColor = theme.colors.white;
      tintColor = completedBgColor;
    } else if (isOptional) {
      bgColor = optionalBgColor;
      tintColor = completedBgColor;
      textColor = theme.colors.white;
      tintBgColor = optionalBgColor;
    }

    if (isColorLight) {
      textColor = labelTextColor;
    }

    return { bgColor, textColor, tintColor, tintBgColor };
  }, [
    completedBgColor,
    isColorLight,
    isCompleted,
    isDisabled,
    isOptional,
    labelTextColor,
    optionalBgColor,
  ]);

  const handleItemPress = () => {
    if (isCheckHabitType) {
      updateLog();

      return;
    }

    setShouldDisplayInput(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <DayItemContainer isDayOptional={isDayOptional}>
      {streakState?.displayLeftLine && (
        <HorizontalLine itemSize={itemSize} bgColor={bgColor} isLeft />
      )}
      {streakState?.displayRightLine && (
        <HorizontalLine
          itemSize={itemSize}
          bgColor={bgColor}
          isWideScreen={isWideScreen}
        />
      )}
      <BgContainer itemSize={itemSize} bgColor={bgColor} />

      <TouchableContainer
        onPress={handleItemPress}
        disabled={isDisabled}
        hitSlop={SMALL_BUTTON_HIT_SLOP}
        activeOpacity={0.35}
      >
        <CircularProgress
          fill={isDisabled ? 0 : percentageCompleted}
          size={itemSize}
          width={CIRCLE_WIDTH}
          rotation={0}
          tintColor={tintColor}
          backgroundColor={tintBgColor}
        >
          {() => (
            <>
              <InnerContainer bgColor={bgColor}>
                {!isCheckHabitType && shouldDisplayInput ? (
                  <Input
                    value={inputValue}
                    inputRef={inputRef}
                    isCentered
                    paddingHorizontal={0}
                    maxLength={7}
                    numberOfLines={1}
                    keyboardType="number-pad"
                    fontWeight="semibold"
                    labelColor={
                      isCompleted || isOptional
                        ? theme.colors.white
                        : theme.colors.darkBlueText
                    }
                    bgColor={bgColor}
                    selectTextOnFocus
                    fontSize={inputFontSize}
                    onChange={onChange ?? noop}
                    onBlur={() => {
                      setShouldDisplayInput(false);
                      updateLog();
                    }}
                    editable={!!onChange}
                  />
                ) : (
                  <Typography
                    align="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    color={textColor}
                  >
                    {day}
                  </Typography>
                )}
              </InnerContainer>
            </>
          )}
        </CircularProgress>
      </TouchableContainer>
    </DayItemContainer>
  );
};

const DayItemContainer = styled.View<{
  isDayOptional: boolean;
}>`
  ${({ isDayOptional }) => isDayOptional && `margin-top: 2.5px;`}
`;

const TouchableContainer = styled.TouchableOpacity`
  z-index: 4;
`;

const InnerContainer = styled.View<{
  bgColor: string;
}>`
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor};
  z-index: 3;
`;

const BgContainer = styled.View<{
  itemSize: number;
  bgColor: string;
}>`
  background-color: ${({ bgColor }) => bgColor};
  position: absolute;
  border-radius: 999px;
  width: ${({ itemSize }) => itemSize}px;
  height: ${({ itemSize }) => itemSize}px;
  z-index: 2;
`;

const HorizontalLine = styled.View<{
  bgColor: string;
  itemSize: number;
  isLeft?: boolean;
  isWideScreen?: boolean;
}>`
  position: absolute;
  width: ${({ isWideScreen }) => (isWideScreen ? 27 : 24)}px;
  height: 4px;
  top: 50%;
  ${({ isLeft, itemSize }) =>
    `${isLeft ? "right" : "left"}: ${itemSize - 4}px;`}
  background-color: ${({ bgColor }) => bgColor};
  z-index: 1;
`;

export default React.memo(HabitCalendarDayItem);
