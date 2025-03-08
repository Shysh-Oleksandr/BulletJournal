import { differenceInMonths, format } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { CalendarList } from "react-native-calendars";
import theme from "theme";

import BottomModal from "components/BottomModal";
import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import { SIMPLE_DATE_FORMAT } from "modules/calendar/data";
import { useActiveHabits } from "modules/habits/api/habitsSelectors";
import { EXTREME_PAST_DATE } from "modules/habits/data";
import { getAllHabitsMarkedDates } from "modules/habits/utils/getAllHabitsMarkedDates";
import styled from "styled-components/native";

import HabitsCalendarDayItem from "./HabitsCalendarDayItem";

const locale = getDateFnsLocale();

const TODAY = format(new Date(), SIMPLE_DATE_FORMAT);

const CALENDAR_HEIGHT = 350;

type Props = {
  selectedDate: number;
  setSelectedDate: (val: number) => void;
  hideBottomSheet: () => void;
};

const HabitsCalendarBottomSheet = ({
  selectedDate,
  setSelectedDate,
  hideBottomSheet,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { activeHabits } = useActiveHabits();

  const calendarListRef = useRef<typeof CalendarList>(null);

  const [isVisible, setIsVisible] = useState(true);
  const [closeTriggered, setCloseTriggered] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const pastScrollRange = useMemo(() => {
    const now = new Date().getTime();

    const oldestHabitLogDate = Math.min(
      ...[
        ...activeHabits.map((habit) => habit.oldestLogDate ?? now),
        EXTREME_PAST_DATE.getTime(),
      ],
    );

    return differenceInMonths(now, oldestHabitLogDate);
  }, [activeHabits]);

  const formattedSelectedDate = useMemo(
    () => format(selectedDate, SIMPLE_DATE_FORMAT),
    [selectedDate],
  );

  const markedDates = useMemo(
    () => getAllHabitsMarkedDates(activeHabits),
    [activeHabits],
  );

  const onClose = useCallback(() => {
    setIsVisible(false);

    setTimeout(() => {
      hideBottomSheet();
    }, 300);
  }, [hideBottomSheet]);

  const dayComponent = useCallback(
    ({ date, state, marking }: any) => {
      const percentageCompleted = marking?.percentageCompleted ?? 0;

      const isDisabled = state === "disabled";

      return (
        <HabitsCalendarDayItem
          percentageCompleted={percentageCompleted}
          day={date.day}
          isDisabled={isDisabled}
          onDayPress={() => {
            setSelectedDate(date.timestamp);
            onClose();
          }}
        />
      );
    },
    [onClose, setSelectedDate],
  );
  const renderHeader = useCallback(
    (date: string) => (
      <Typography fontSize="xl" fontWeight="semibold" paddingBottom={5}>
        {format(new Date(date), "LLLL yyyy", {
          locale,
        })}
      </Typography>
    ),
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      calendarListRef?.current?.scrollToMonth(formattedSelectedDate);
    }, 1000);
  }, [formattedSelectedDate]);

  return (
    <BottomModal
      title={t("calendar.calendar")}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      onClose={onClose}
      closeTriggered={closeTriggered}
      setCloseTriggered={setCloseTriggered}
      paddingHorizontal={0}
    >
      {isLoading && (
        <LoaderContainer>
          <ActivityIndicator size="large" color={theme.colors.cyan600} />
        </LoaderContainer>
      )}

      <CalendarList
        ref={calendarListRef}
        date={formattedSelectedDate}
        current={TODAY}
        maxDate={TODAY}
        pastScrollRange={pastScrollRange}
        futureScrollRange={0}
        alwaysBounceVertical={false}
        firstDay={1}
        calendarHeight={CALENDAR_HEIGHT}
        contentContainerStyle={{
          paddingBottom: 100,
          opacity: isLoading ? 0 : 1,
        }}
        calendarStyle={{
          width: "100%",
        }}
        overScrollMode="never"
        bounces={false}
        renderHeader={renderHeader}
        dayComponent={dayComponent}
        markedDates={markedDates}
      />
    </BottomModal>
  );
};

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

export default HabitsCalendarBottomSheet;
