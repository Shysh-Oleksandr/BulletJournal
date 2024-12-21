import { format } from "date-fns";
import React, { useMemo } from "react";
import theme from "theme";

import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Typography from "components/Typography";
import { useGetCustomColor } from "hooks/useGetCustomColor";
import { useHabitFrequencyLabel } from "modules/habits/hooks/useHabitFrequencyLabel";
import { Habit, HabitTypes } from "modules/habits/types";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

type Props = {
  habit: Habit;
};

const HabitInfoSection = ({ habit }: Props): JSX.Element => {
  const bgColor = useMemo(
    () => getDifferentColor(habit.color, -15),
    [habit.color],
  );

  const { textColor } = useGetCustomColor(habit.color);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const frequencyLabel = useHabitFrequencyLabel(habit.frequency);

  const firstCompletedLogDate = useMemo(() => {
    const firstCompletedLogDate =
      habit.logs.length > 0
        ? Math.min(...habit.logs.map((log) => log.date))
        : new Date();

    return format(firstCompletedLogDate, "dd.MM.yyyy");
  }, [habit.logs]);

  return (
    <Container bgColor={bgColor}>
      <InfoContainer>
        <InfoItemContainer>
          <FontAwesome
            name="calendar-check-o"
            color={textColor}
            size={theme.fontSizes.md}
          />
          <Typography fontSize="sm" color={textColor}>
            {firstCompletedLogDate}
          </Typography>
        </InfoItemContainer>
        {!isCheckHabitType && (
          <InfoItemContainer>
            <FontAwesome5
              name={
                habit.habitType === HabitTypes.AMOUNT
                  ? "sort-amount-up"
                  : "clock"
              }
              color={textColor}
              size={theme.fontSizes.md}
            />
            <Typography fontSize="sm" color={textColor}>
              {habit.amountTarget} {habit.units}
            </Typography>
          </InfoItemContainer>
        )}
        <InfoItemContainer>
          <MaterialIcons name="repeat" color={textColor} size={17} />
          <Typography fontSize="sm" color={textColor}>
            {frequencyLabel}
          </Typography>
        </InfoItemContainer>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.View<{ bgColor: string }>`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor};
`;

const InfoContainer = styled.View`
  padding: 8px 16px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  column-gap: 15px;
  row-gap: 4px;
`;

const InfoItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export default React.memo(HabitInfoSection);
