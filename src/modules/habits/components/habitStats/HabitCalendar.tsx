import { format, startOfToday } from "date-fns";
import React, { useCallback, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { CALENDAR_THEME, SIMPLE_DATE_FORMAT } from "modules/calendar/data";
import { configureCalendarLocale } from "modules/calendar/data/calendarLocaleConfig";
import { Habit } from "modules/habits/types";
import { getMarkedHabitLogsDates } from "modules/habits/utils/getMarkedHabitLogsDates";
import { Direction } from "react-native-calendars/src/types";
import styled from "styled-components/native";

import HabitCalendarDayItem from "./HabitCalendarDayItem";

const today = startOfToday();
const todayString = format(today, SIMPLE_DATE_FORMAT);

configureCalendarLocale();

const CALENDAR_STYLES: StyleProp<ViewStyle> = {
  height: 335,
  overflow: "hidden",
  borderRadius: 8,
  elevation: 8,
};

const renderArrow = (direction: Direction) => (
  <FontAwesome5
    name={direction === "left" ? "chevron-left" : "chevron-right"}
    color={theme.colors.cyan600}
    size={theme.fontSizes.md}
  />
);

type Props = {
  habit: Habit;
};

const HabitCalendar = ({ habit }: Props): JSX.Element => {
  const markedDates = useMemo(
    () => getMarkedHabitLogsDates(habit.logs),
    [habit.logs],
  );

  const dayComponent = useCallback(
    ({ date, state, marking }: any) => {
      const percentageCompleted = marking?.percentageCompleted ?? 0;

      const isDisabled = state === "disabled";

      return (
        <HabitCalendarDayItem
          habit={habit}
          percentageCompleted={percentageCompleted}
          day={date.day}
          timestamp={date.timestamp}
          isDisabled={isDisabled}
        />
      );
    },
    [habit],
  );

  return (
    <Container>
      <RNCalendar
        style={CALENDAR_STYLES}
        theme={CALENDAR_THEME}
        current={todayString}
        maxDate={todayString}
        firstDay={1}
        dayComponent={dayComponent}
        renderArrow={renderArrow}
        hideExtraDays
        markedDates={markedDates}
      />
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 30px;
`;

export default HabitCalendar;
