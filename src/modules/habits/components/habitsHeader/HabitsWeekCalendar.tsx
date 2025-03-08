import { format, isSameDay, isToday, startOfToday } from "date-fns";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import styled from "styled-components/native";

import { useHabitsWeekDates } from "../../hooks/useHabitsWeekDates";

import HabitsCalendarSelector from "./HabitsCalendarSelector";
import WeekCalendarItem from "./WeekCalendarItem";

const today = startOfToday().getTime();

type Props = {
  selectedDate: number;
  setSelectedDate: (val: number) => void;
};

const HabitsWeekCalendar = ({
  selectedDate,
  setSelectedDate,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const isTodaySelected = useMemo(() => isToday(selectedDate), [selectedDate]);

  const mappedWeekDates = useHabitsWeekDates(selectedDate);

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
                isTodaySelected ? theme.colors.darkBlueText : theme.colors.gray
              }
              fontWeight="bold"
            >
              {t("habits.today")}
              {` `}
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
            {format(selectedDate, "dd MMM yyyy", {
              locale: getDateFnsLocale(),
            })}
          </Typography>
        </DateInfoContainer>
        <HabitsCalendarSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </HeaderContainer>
      <CalendarContainer>
        {mappedWeekDates.map(({ date, percentageCompleted }) => (
          <WeekCalendarItem
            key={date}
            date={date}
            percentageCompleted={percentageCompleted}
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
  justify-content: space-between;
`;

const DateInfoContainer = styled.View``;

const TodayContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export default React.memo(HabitsWeekCalendar);
