import { isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
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
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import HabitItem from "../components/HabitItem";
import HabitsWeekCalendar from "../components/HabitsWeekCalendar";
import { EMPTY_HABIT } from "../data";
import { getHabits } from "../HabitsSlice";
import { Habit } from "../types";

const contentContainerStyle = {
  paddingTop: 20,
  paddingBottom: 130,
  paddingHorizontal: 20,
};

const keyExtractor = (item: Habit, i: number) => `${i}-${item._id}`;

const HabitsScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const habits = useAppSelector(getHabits);

  const [extraData, setExtraData] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState(new Date().getTime());

  const navigateToCreateHabitScreen = useCallback(() => {
    navigation.navigate(Routes.EDIT_HABIT, {
      item: EMPTY_HABIT,
      isNewHabit: true,
    });
  }, [navigation]);

  const ListHeaderComponent = useMemo(
    () => (
      <HabitsWeekCalendar
        selectedDate={selectedDate}
        setSelectedDate={(val: number) => {
          setSelectedDate(val);
          setExtraData(val);
        }}
      />
    ),
    [selectedDate],
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
          onPress={navigateToCreateHabitScreen}
          bgColor={theme.colors.cyan600}
        />
      </EmptyContainer>
    ),
    [navigateToCreateHabitScreen, t],
  );

  const renderItem: ListRenderItem<Habit> = ({ item }) => (
    <HabitItem
      habit={item}
      isActive={item.logs.some(
        (log) =>
          log.percentageCompleted >= 100 && isSameDay(log.date, selectedDate),
      )}
    />
  );

  return (
    <>
      <HeaderBar title={t("habits.habits")} />
      <AddButton contentItem={ContentItem.HABIT} />
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
