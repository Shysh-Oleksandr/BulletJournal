import { format, parse, startOfToday } from "date-fns";
import React, { useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { useAllNotes } from "modules/notes/api/notesSelectors";
import { Direction } from "react-native-calendars/src/types";
import styled from "styled-components/native";

import { getCalendarTheme, SIMPLE_DATE_FORMAT } from "../data";
import { configureCalendarLocale } from "../data/calendarLocaleConfig";
import { getMarkedDates } from "../util/getMarkedDates";

const today = startOfToday();
const todayString = format(today, SIMPLE_DATE_FORMAT);

configureCalendarLocale();

const CALENDAR_STYLES: StyleProp<ViewStyle> = {
  height: 335,
  overflow: "hidden",
  borderRadius: 8,
  elevation: 12,
};

const CALENDAR_THEME = getCalendarTheme();

const renderArrow = (direction: Direction) => (
  <FontAwesome5
    name={direction === "left" ? "chevron-left" : "chevron-right"}
    color={theme.colors.cyan600}
    size={theme.fontSizes.md}
  />
);

type Props = {
  selectedDate: Date;
  setSelectedDate: (val: Date) => void;
};

const Calendar = ({ selectedDate, setSelectedDate }: Props): JSX.Element => {
  const { notes } = useAllNotes();

  const markedDates = useMemo(() => getMarkedDates(notes), [notes]);

  const formattedSelectedDate = useMemo(
    () => format(selectedDate, SIMPLE_DATE_FORMAT),
    [selectedDate],
  );

  return (
    <Container>
      <RNCalendar
        style={CALENDAR_STYLES}
        theme={CALENDAR_THEME}
        current={todayString}
        firstDay={1}
        onDayPress={(day: any) => {
          setSelectedDate(
            parse(day.dateString, SIMPLE_DATE_FORMAT, new Date()),
          );
        }}
        renderArrow={renderArrow}
        markedDates={{
          ...markedDates,
          [todayString]: {
            marked: true,
            dotColor: theme.colors.green600,
          },
          [formattedSelectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: theme.colors.cyan600,
            dotColor: theme.colors.white,
            marked: !!markedDates[formattedSelectedDate],
          },
        }}
      />
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 40px;
`;

export default Calendar;
