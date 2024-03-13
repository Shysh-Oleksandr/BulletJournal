import { format, isSameDay, isToday, startOfToday } from "date-fns";
import React from "react";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import styled from "styled-components/native";

import { useHabitsWeekDates } from "../hooks/useHabitsWeekDates";
import { Habit } from "../types";

import WeekCalendarItem from "./WeekCalendarItem";

const today = startOfToday();

type Props = {
  habits: Habit[];
  selectedDate: Date;
  setSelectedDate: (val: Date) => void;
};

const HabitsWeekCalendar = ({
  habits,
  selectedDate,
  setSelectedDate,
}: Props): JSX.Element => {
  const isTodaySelected = isToday(selectedDate);

  const {
    mappedWeekDates,
    prevWeekLastDay,
    nextWeekFirstDay,
    isNextWeekDisabled,
  } = useHabitsWeekDates(selectedDate, habits);

  return (
    <Container>
      <HeaderContainer>
        <DateInfoContainer>
          <TodayContainer
            disabled={isTodaySelected}
            onPress={() => setSelectedDate(today)}
          >
            <Typography
              fontSize="xxl"
              color={
                isTodaySelected ? theme.colors.blackText : theme.colors.gray
              }
              fontWeight="bold"
            >
              Today{` `}
              {!isTodaySelected && (
                <FontAwesome5
                  name="arrow-right"
                  color={theme.colors.cyan500}
                  size={theme.fontSizes.xl}
                />
              )}
            </Typography>
          </TodayContainer>
          <Typography
            fontSize="sm"
            fontWeight="semibold"
            paddingTop={2}
            color={theme.colors.cyan600}
          >
            {format(selectedDate, "dd MMM yyyy")}
          </Typography>
        </DateInfoContainer>
        <ArrowsContainer>
          <ArrowContainer
            onPress={() => setSelectedDate(prevWeekLastDay)}
            hitSlop={BUTTON_HIT_SLOP}
          >
            <FontAwesome5
              name="chevron-left"
              color={theme.colors.cyan500}
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
          <ArrowContainer
            onPress={() => setSelectedDate(nextWeekFirstDay)}
            hitSlop={BUTTON_HIT_SLOP}
            disabled={isNextWeekDisabled}
          >
            <FontAwesome5
              name="chevron-right"
              color={
                isNextWeekDisabled ? theme.colors.gray : theme.colors.cyan500
              }
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
        </ArrowsContainer>
      </HeaderContainer>
      <CalendarContainer>
        {mappedWeekDates.map(({ date, progress }) => (
          <WeekCalendarItem
            key={date.getTime()}
            date={date}
            progress={progress}
            isActive={isSameDay(date, selectedDate)}
            setSelectedDate={setSelectedDate}
          />
        ))}
      </CalendarContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 20px;
  width: 100%;
`;

const CalendarContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DateInfoContainer = styled.View``;

const ArrowsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 30px;
`;

const TodayContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ArrowContainer = styled.TouchableOpacity``;

export default HabitsWeekCalendar;
