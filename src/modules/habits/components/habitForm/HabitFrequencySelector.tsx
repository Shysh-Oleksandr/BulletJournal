import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Checkbox from "components/Checkbox";
import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import { WEEKDAYS_DATES } from "modules/habits/data";
import styled from "styled-components/native";

type Props = {
  currentFrequency: number[];
  setCurrentFrequency: (val: number[]) => void;
};

const HabitFrequencySelector = ({
  currentFrequency,
  setCurrentFrequency,
}: Props) => {
  const { t } = useTranslation();

  const isDailyFrequency = currentFrequency.length === 7;

  const onDailyRepeatButtonPress = () => {
    if (isDailyFrequency) {
      setCurrentFrequency([WEEKDAYS_DATES[0]]);
    } else {
      setCurrentFrequency(WEEKDAYS_DATES);
    }
  };

  const onDayPress = (date: number, isActive: boolean) => {
    const updatedFrequency = isActive
      ? currentFrequency.filter((item) => item !== date)
      : [...currentFrequency, date];

    if (updatedFrequency.length === 0) return;

    setCurrentFrequency(updatedFrequency);
  };

  return (
    <Container>
      <DailyRepeatButton onPress={onDailyRepeatButtonPress}>
        <Typography
          fontWeight="semibold"
          fontSize="lg"
          paddingRight={8}
          align="center"
        >
          {t("habits.repeatEveryday")}
        </Typography>
        <Checkbox isActive={isDailyFrequency} />
      </DailyRepeatButton>
      <WeekdaysContainer>
        {WEEKDAYS_DATES.map((date) => {
          const isActive = currentFrequency.includes(date);

          return (
            <WeekdayItemContainer
              key={date}
              active={isActive}
              onPress={() => onDayPress(date, isActive)}
            >
              <Typography
                color={isActive ? theme.colors.white : theme.colors.cyan600}
                fontSize="xs"
                fontWeight="semibold"
                uppercase
              >
                {format(date, "EEEEEE", {
                  locale: getDateFnsLocale(),
                })}
              </Typography>
            </WeekdayItemContainer>
          );
        })}
      </WeekdaysContainer>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  margin: 20px 8px 10px;
`;

const DailyRepeatButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WeekdaysContainer = styled.View`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WeekdayItemContainer = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${({ active }) =>
    active ? theme.colors.cyan500 : theme.colors.cyan300};
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
`;

export default HabitFrequencySelector;
