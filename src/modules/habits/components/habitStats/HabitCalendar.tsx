import { format, isSameMonth, startOfMonth, startOfToday } from "date-fns";
import React, { useCallback, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { getCalendarTheme, SIMPLE_DATE_FORMAT } from "modules/calendar/data";
import { configureCalendarLocale } from "modules/calendar/data/calendarLocaleConfig";
import { useGetHabitCalendarDataQuery } from "modules/habits/api/habitsApi";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { Habit, HabitCalendarDataItem } from "modules/habits/types";
import { DateData, Direction } from "react-native-calendars/src/types";
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
};

const HabitCalendar = ({ habit }: Props): JSX.Element => {
  const [selectedLog, setSelectedLog] = useState<HabitCalendarDataItem | null>(
    null,
  );
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const { textColor } = useHabitStatColors(habit.color);

  const { data: calendarData } = useGetHabitCalendarDataQuery(
    habit._id,
    selectedMonth,
  );

  const customTheme = useMemo(() => getCalendarTheme(textColor), [textColor]);

  const dayComponent = useCallback(
    ({ date, state, marking }: any) => {
      const isDisabled = state === "disabled";

      if (!marking) return null;

      return (
        <HabitCalendarDayItem
          habit={habit}
          day={date.day}
          timestamp={date.timestamp}
          isDisabled={isDisabled}
          calendarData={marking}
          onLongPress={() => setSelectedLog(marking)}
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
        displayLoadingIndicator
        hideExtraDays
        disableArrowRight={isSameMonth(selectedMonth, today)}
        markedDates={calendarData}
        onMonthChange={(date: DateData) => {
          setSelectedMonth(startOfMonth(date.timestamp));
        }}
      />

      <HabitLogInfoModal
        habit={habit}
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 30px;
`;

export default HabitCalendar;
