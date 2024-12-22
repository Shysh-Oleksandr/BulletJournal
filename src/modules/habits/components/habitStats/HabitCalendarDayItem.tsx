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
  day: number;
  timestamp: number;
  isDisabled: boolean;
  streakState?: {
    displayRightLine: boolean;
    displayLeftLine: boolean;
  };
  onLongPress?: () => void;
};

const HabitCalendarDayItem = ({
  habit,
  day,
  timestamp,
  isDisabled,
  streakState,
  onLongPress,
}: Props): JSX.Element => {
  const { width: screenWidth } = useWindowDimensions();

  const isWideScreen = screenWidth > 400;

  const inputRef = useRef<TextInput | null>(null);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;
  const { inputValue, currentLog, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate: timestamp,
  });

  const isOptional = !!currentLog?.isOptional;
  const percentageCompleted = currentLog?.percentageCompleted ?? 0;

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

  const hasAdditionalInfo = currentLog?.isManuallyOptional || currentLog?.note;

  const inputFontSize = useMemo(() => {
    if (inputValue.length < 3) return "md";

    if (inputValue.length < 4) return "sm";

    if (inputValue.length < 5) return "xs";

    return "xxs";
  }, [inputValue.length]);

  const { bgColor, textColor, tintColor, tintBgColor, indicatorBgColor } =
    useMemo(() => {
      let bgColor = theme.colors.white;
      let textColor = theme.colors.cyan600;
      let tintColor = theme.colors.cyan500;
      let tintBgColor = theme.colors.cyan400;
      let indicatorBgColor = theme.colors.cyan500;

      if (isDisabled) {
        bgColor = theme.colors.cyan400;
      } else if (isCompleted) {
        bgColor = completedBgColor;
        textColor = theme.colors.white;
        tintColor = completedBgColor;
        indicatorBgColor = optionalBgColor;
      } else if (isOptional) {
        bgColor = optionalBgColor;
        tintColor = completedBgColor;
        textColor = theme.colors.white;
        tintBgColor = optionalBgColor;
        indicatorBgColor = completedBgColor;
      }

      if (isColorLight) {
        textColor = labelTextColor;
      }

      return { bgColor, textColor, tintColor, tintBgColor, indicatorBgColor };
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
        onLongPress={onLongPress}
        disabled={isDisabled}
        hitSlop={SMALL_BUTTON_HIT_SLOP}
        activeOpacity={0.35}
      >
        {hasAdditionalInfo && (
          <AdditionalInfoIndicator
            borderColor={indicatorBgColor}
            bgColor={bgColor}
            isFull={!!currentLog.note}
          />
        )}
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

const AdditionalInfoIndicator = styled.View<{
  bgColor: string;
  borderColor: string;
  isFull: boolean;
}>`
  position: absolute;
  width: 11px;
  height: 11px;
  top: 0px;
  right: 0px;
  background-color: ${({ bgColor, borderColor, isFull }) =>
    isFull ? borderColor : bgColor};
  border: 3px solid ${({ borderColor }) => borderColor};
  border-radius: 999px;
  z-index: 2;
`;

export default React.memo(HabitCalendarDayItem);
