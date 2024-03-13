import { addDays, isSameDay, startOfToday } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FlashList, ListRenderItem } from "@shopify/flash-list";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import styled from "styled-components/native";

import HabitItem from "../components/HabitItem";
import HabitsWeekCalendar from "../components/HabitsWeekCalendar";
import { Habit } from "../types";

const today = startOfToday();

const HABITS: Habit[] = [
  {
    _id: "1",
    author: "6523fc221cfea2898fce9252",
    label: "Wake up early",
    description: "Until sunrise",
    color: theme.colors.darkBlueText,
    goal: 30,
    startDate: addDays(today, -1).getTime(),
    logs: [
      { date: today.getTime(), completed: false },
      {
        date: addDays(today, -1).getTime(),
        completed: true,
      },
    ],
  },
  {
    _id: "2",
    author: "6523fc221cfea2898fce9252",
    label: "Drink water",
    description: "More than 2l a day",
    color: theme.colors.cyan600,
    goal: 40,
    startDate: today.getTime(),
    logs: [
      { date: today.getTime(), completed: true },
      {
        date: addDays(today, -1).getTime(),
        completed: false,
      },
    ],
  },
  {
    _id: "3",
    author: "6523fc221cfea2898fce9252",
    label: "Eat healthy",
    color: theme.colors.green600,
    goal: 60,
    startDate: addDays(today, -3).getTime(),
    logs: [
      { date: today.getTime(), completed: true },
      {
        date: addDays(today, -2).getTime(),
        completed: true,
      },
    ],
  },
];

const contentContainerStyle = {
  paddingTop: 20,
  paddingBottom: 80,
  paddingHorizontal: 20,
};

const keyExtractor = (item: Habit, i: number) => `${i}-${item._id}`;

const HabitsScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const [habits] = useState(HABITS);
  const [extraData, setExtraData] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const addNewHabit = () => {};

  const ListHeaderComponent = useMemo(
    () => (
      <HabitsWeekCalendar
        habits={habits}
        selectedDate={selectedDate}
        setSelectedDate={(val: Date) => {
          setSelectedDate(val);
          setExtraData(val);
        }}
      />
    ),
    [selectedDate, habits],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <EmptyContainer>
        <Typography fontWeight="semibold" fontSize="lg">
          {t("habits.noHabitsText")}
        </Typography>
        <Button
          label={t("habits.addHabit")}
          marginTop={10}
          labelProps={{ fontSize: "xl", fontWeight: "bold" }}
          onPress={addNewHabit}
          bgColor={theme.colors.cyan600}
        />
      </EmptyContainer>
    ),
    [t],
  );

  const renderItem: ListRenderItem<Habit> = ({ item }) => (
    <HabitItem
      habit={item}
      isActive={item.logs.some(
        (log) => log.completed && isSameDay(log.date, selectedDate),
      )}
    />
  );

  return (
    <>
      <HeaderBar
        title={t("habits.habits")}
        withAddBtn
        onAddBtnPress={addNewHabit}
      />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <FlashList
          data={habits}
          renderItem={renderItem}
          extraData={extraData}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          estimatedItemSize={300}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        />
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const EmptyContainer = styled.View`
  align-items: center;
`;

export default HabitsScreen;
