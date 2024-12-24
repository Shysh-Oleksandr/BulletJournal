import { format, startOfToday } from "date-fns";
import React, { useCallback, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { getCalendarTheme, SIMPLE_DATE_FORMAT } from "modules/calendar/data";
import { configureCalendarLocale } from "modules/calendar/data/calendarLocaleConfig";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { Habit, HabitStreak } from "modules/habits/types";
import { getMarkedHabitLogsDates } from "modules/habits/utils/getMarkedHabitLogsDates";
import { Direction } from "react-native-calendars/src/types";
import styled from "styled-components/native";

import HabitCalendarDayItem from "./HabitCalendarDayItem";
import HabitLogInfoModal from "./HabitLogInfoModal";

const today = startOfToday();
const todayString = format(today, SIMPLE_DATE_FORMAT);

configureCalendarLocale();

const CALENDAR_STYLES: StyleProp<ViewStyle> = {
  height: 345,
  overflow: "hidden",
  borderRadius: 8,
  elevation: 8,
};

const renderArrow = (direction: Direction, color: string) => (
  <FontAwesome5
    name={direction === "left" ? "chevron-left" : "chevron-right"}
    color={color ?? theme.colors.cyan600}
    size={theme.fontSizes.md}
  />
);

type Props = {
  habit: Habit;
  bestStreaksData: HabitStreak[];
};

const HabitCalendar = ({ habit, bestStreaksData }: Props): JSX.Element => {
  const [selectedLogTimestamp, setSelectedLogTimestamp] = useState<
    number | null
  >(null);
  const { textColor } = useHabitStatColors(habit.color);

  const markedDates = useMemo(
    () => getMarkedHabitLogsDates(habit, bestStreaksData),
    [bestStreaksData, habit],
  );

  const customTheme = useMemo(() => getCalendarTheme(textColor), [textColor]);

  const dayComponent = useCallback(
    ({ date, state, marking }: any) => {
      const isDisabled = state === "disabled";

      return (
        <HabitCalendarDayItem
          habit={habit}
          day={date.day}
          timestamp={date.timestamp}
          isDisabled={isDisabled}
          streakState={marking?.streakState}
          onLongPress={() => setSelectedLogTimestamp(date.timestamp)}
        />
      );
    },
    [habit],
  );

  return (
    <Container>
      <RNCalendar
        style={CALENDAR_STYLES}
        theme={customTheme}
        current={todayString}
        maxDate={todayString}
        firstDay={1}
        dayComponent={dayComponent}
        renderArrow={(direction: Direction) =>
          renderArrow(direction, textColor)
        }
        hideExtraDays
        markedDates={markedDates}
      />

      <HabitLogInfoModal
        habit={habit}
        selectedLogTimestamp={selectedLogTimestamp}
        onClose={() => setSelectedLogTimestamp(null)}
      />
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 30px;
`;

export default HabitCalendar;
