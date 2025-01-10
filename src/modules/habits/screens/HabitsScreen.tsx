import { isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl } from "react-native";
import theme from "theme";

import { Entypo, Ionicons } from "@expo/vector-icons";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
  SMALL_BUTTON_HIT_SLOP,
} from "modules/app/constants";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import HabitItem from "../components/habitItem/HabitItem";
import HabitsProgressBar from "../components/habitsHeader/HabitsProgressBar";
import HabitsWeekCalendar from "../components/habitsHeader/HabitsWeekCalendar";
import HabitLogInfoModal from "../components/habitStats/HabitLogInfoModal";
import { EMPTY_HABIT } from "../data";
import { habitsApi } from "../HabitsApi";
import { getHabitsBySelectedDate } from "../HabitsSelectors";
import { Habit } from "../types";

const contentContainerStyle = {
  paddingTop: 20,
  paddingBottom: 90,
  paddingHorizontal: 16,
};

const HabitsScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const [fetchHabits, { isLoading, isUninitialized, isFetching }] =
    habitsApi.useLazyFetchHabitsQuery();

  const [selectedDate, setSelectedDate] = useState(new Date().getTime());
  const [additionalInfoHabit, setAdditionalInfoHabit] = useState<Habit | null>(
    null,
  );

  const userId = useAppSelector(getUserId);
  const { mandatoryHabits, optionalHabits } = useAppSelector((state) =>
    getHabitsBySelectedDate(state, selectedDate),
  );

  const isTodaySelected = useMemo(
    () => isSameDay(selectedDate, new Date()),
    [selectedDate],
  );

  const navigateToCreateHabitScreen = useCallback(() => {
    navigation.navigate(Routes.EDIT_HABIT, {
      item: EMPTY_HABIT,
      isNewHabit: true,
    });
  }, [navigation]);

  const fetchInitialData = useCallback(async () => {
    if (!userId) return;

    await fetchHabits(userId);
  }, [fetchHabits, userId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <>
      <HeaderBar
        title={t("habits.habits")}
        trailingContent={(textColor) => (
          <>
            <ButtonContainer
              onPress={() => navigation.navigate(Routes.ARCHIVED_HABITS)}
              hitSlop={SMALL_BUTTON_HIT_SLOP}
            >
              <Entypo name="archive" size={26} color={textColor} />
            </ButtonContainer>
            <ButtonContainer
              onPress={() => navigation.navigate(Routes.HABITS_BULK_EDIT)}
              hitSlop={SMALL_BUTTON_HIT_SLOP}
            >
              <Ionicons name="filter" size={30} color={textColor} />
            </ButtonContainer>
          </>
        )}
      />
      <HabitsProgressBar
        mandatoryHabits={mandatoryHabits}
        selectedDate={selectedDate}
      />
      <AddButton contentItem={ContentItem.HABIT} />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        {isLoading || isUninitialized ? (
          <LoaderContainer>
            <ActivityIndicator size="large" color={theme.colors.cyan600} />
          </LoaderContainer>
        ) : (
          <Container
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
            automaticallyAdjustKeyboardInsets
            refreshControl={
              <RefreshControl
                colors={[theme.colors.cyan600]}
                refreshing={isFetching}
                onRefresh={fetchInitialData}
              />
            }
          >
            <HabitsWeekCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <HabitLogInfoModal
              habit={additionalInfoHabit}
              selectedLogTimestamp={selectedDate}
              onClose={() => setAdditionalInfoHabit(null)}
            />

            {mandatoryHabits.length > 0 || optionalHabits.length > 0 ? (
              <>
                {mandatoryHabits.map((habit) => (
                  <HabitItem
                    key={habit._id}
                    habit={habit}
                    selectedDate={selectedDate}
                    onLongPress={() => setAdditionalInfoHabit(habit)}
                  />
                ))}
                {optionalHabits.length > 0 && (
                  <Typography
                    fontWeight="semibold"
                    fontSize="lg"
                    paddingTop={mandatoryHabits.length > 0 ? 16 : 0}
                    paddingBottom={16}
                  >
                    {t(
                      isTodaySelected
                        ? "habits.optionalHabitsToday"
                        : "habits.optionalHabitsThatDay",
                    )}
                  </Typography>
                )}
                {optionalHabits.map((habit) => (
                  <HabitItem
                    key={habit._id}
                    habit={habit}
                    selectedDate={selectedDate}
                    onLongPress={() => setAdditionalInfoHabit(habit)}
                  />
                ))}
              </>
            ) : (
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
            )}
          </Container>
        )}
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const Container = styled.ScrollView``;

const EmptyContainer = styled.View`
  align-items: center;
`;

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export default HabitsScreen;
