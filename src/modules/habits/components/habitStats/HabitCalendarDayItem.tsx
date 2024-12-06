import React, { useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import theme from "theme";

import Input from "components/Input";
import Typography from "components/Typography";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
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
  const { inputValue, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate: timestamp,
  });

  const {
    isColorLight,
    textColor: labelTextColor,
    bgColor: completedBgColor,
  } = useHabitStatColors(habit.color);

  const textColor = isColorLight ? labelTextColor : theme.colors.white;

  const [shouldDisplayInput, setShouldDisplayInput] = useState(false);

  const isCompleted = percentageCompleted >= 100;

  const inputFontSize = useMemo(() => {
    if (inputValue.length < 3) return "md";

    if (inputValue.length < 4) return "sm";

    if (inputValue.length < 5) return "xs";

    return "xxs";
  }, [inputValue.length]);

  const bgColor = useMemo(() => {
    if (isCompleted) return completedBgColor;
    if (isDisabled) return theme.colors.cyan400;

    return "transparent";
  }, [completedBgColor, isCompleted, isDisabled]);

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
      {/* <HorizontalLine bgColor={bgColor} /> */}
      <CircularProgress
        fill={isDisabled ? 0 : (percentageCompleted ?? 0)}
        size={CIRCLE_SIZE}
        width={CIRCLE_WIDTH}
        rotation={0}
        tintColor={isCompleted ? bgColor : theme.colors.cyan500}
        backgroundColor={theme.colors.cyan400}
      >
        {() => (
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
                  isCompleted ? theme.colors.white : theme.colors.darkBlueText
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
                color={isCompleted ? textColor : theme.colors.cyan600}
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
  bgColor: string;
}>`
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor};
`;

// const HorizontalLine = styled.View<{
//   bgColor: string;
// }>`
//   position: absolute;
//   width: 28px;
//   height: 3px;
//   top: 50%;
//   left: 33px;
//   background-color: ${({ bgColor }) => bgColor};
// `;

export default React.memo(HabitCalendarDayItem);
