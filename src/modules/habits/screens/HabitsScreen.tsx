import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import theme from "theme";

import { FlashList, ListRenderItem } from "@shopify/flash-list";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import HabitItem from "../components/HabitItem";
import HabitsWeekCalendar from "../components/HabitsWeekCalendar";
import { EMPTY_HABIT } from "../data";
import { habitsApi } from "../HabitsApi";
import { getHabitsBySelectedDate } from "../HabitsSelectors";
import { Habit } from "../types";

const contentContainerStyle = {
  paddingTop: 20,
  paddingBottom: 185,
  paddingHorizontal: 20,
};

const ESTIMATED_HABIT_HEIGHT = 150;

const keyExtractor = (item: Habit, i: number) => `${i}-${item._id}`;

const HabitsScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const [fetchHabits, { isLoading }] = habitsApi.useLazyFetchHabitsQuery();

  const [extraData, setExtraData] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState(new Date().getTime());

  const userId = useAppSelector(getUserId);
  const { habitsBySelectedDate, firstOptionalHabitId } = useAppSelector(
    (state) => getHabitsBySelectedDate(state, selectedDate),
  );

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

  const renderItem: ListRenderItem<Habit> = useCallback(
    ({ item }) => (
      <HabitItem
        habit={item}
        selectedDate={selectedDate}
        isFirstOptionalHabitId={item._id === firstOptionalHabitId}
      />
    ),
    [selectedDate, firstOptionalHabitId],
  );

  const fetchInitialData = useCallback(async () => {
    if (!userId) return;

    await fetchHabits(userId);
  }, [fetchHabits, userId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <>
      <HeaderBar title={t("habits.habits")} />
      <AddButton contentItem={ContentItem.HABIT} />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        {isLoading ? (
          <LoaderContainer>
            <ActivityIndicator size="large" color={theme.colors.cyan600} />
          </LoaderContainer>
        ) : (
          <FlashList
            data={habitsBySelectedDate}
            renderItem={renderItem}
            extraData={extraData}
            keyExtractor={keyExtractor}
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            estimatedItemSize={ESTIMATED_HABIT_HEIGHT}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          />
        )}
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

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

export default HabitsScreen;
