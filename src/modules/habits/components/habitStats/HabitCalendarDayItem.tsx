import React, { useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import theme from "theme";

import Input from "components/Input";
import Typography from "components/Typography";
import { useUpdateHabitLog } from "modules/habits/hooks/useUpdateHabitLog";
import { Habit, HabitTypes } from "modules/habits/types";
import styled from "styled-components/native";
import { noop } from "utils/utilityFunctions";

const CIRCLE_SIZE = 33;
const CIRCLE_WIDTH = 3;

type Props = {
  habit: Habit;
  percentageCompleted: number;
  day: number;
  timestamp: number;
  isDisabled: boolean;
};

const HabitCalendarDayItem = ({
  habit,
  percentageCompleted,
  day,
  timestamp,
  isDisabled,
}: Props): JSX.Element => {
  const inputRef = useRef<TextInput | null>(null);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;
  const { inputValue, currentLog, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate: timestamp,
  });

  const [shouldDisplayInput, setShouldDisplayInput] = useState(false);

  const currentPercentageCompleted =
    currentLog?.percentageCompleted ?? percentageCompleted;
  const isCompleted = currentPercentageCompleted >= 100;

  const inputFontSize = useMemo(() => {
    if (inputValue.length < 3) return "md";

    if (inputValue.length < 4) return "sm";

    if (inputValue.length < 5) return "xs";

    return "xxs";
  }, [inputValue.length]);

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
    <DayItemContainer onPress={handleItemPress} disabled={isDisabled}>
      <CircularProgress
        fill={currentPercentageCompleted ?? 0}
        size={CIRCLE_SIZE}
        width={CIRCLE_WIDTH}
        rotation={0}
        tintColor={theme.colors.cyan500}
        backgroundColor={theme.colors.crystal}
      >
        {() => (
          <InnerContainer isCompleted={isCompleted} isDisabled={isDisabled}>
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
                  isCompleted ? theme.colors.white : theme.colors.darkBlueText
                }
                bgColor={isCompleted ? theme.colors.cyan500 : "transparent"}
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
                color={isCompleted ? theme.colors.white : theme.colors.cyan600}
              >
                {day}
              </Typography>
            )}
          </InnerContainer>
        )}
      </CircularProgress>
    </DayItemContainer>
  );
};

const DayItemContainer = styled.TouchableOpacity``;

const InnerContainer = styled.View<{
  isCompleted: boolean;
  isDisabled: boolean;
}>`
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ isCompleted, isDisabled }) =>
    isDisabled
      ? theme.colors.crystal
      : isCompleted
      ? theme.colors.cyan500
      : "transparent"};
`;

export default HabitCalendarDayItem;
