import { isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import theme from "theme";

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

import HabitItem from "../components/habitItem/HabitItem";
import HabitsWeekCalendar from "../components/HabitsWeekCalendar";
import { EMPTY_HABIT } from "../data";
import { habitsApi } from "../HabitsApi";
import { getHabitsBySelectedDate } from "../HabitsSelectors";

const contentContainerStyle = {
  paddingTop: 20,
  paddingBottom: 185,
  paddingHorizontal: 20,
};

const HabitsScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const [fetchHabits, { isLoading }] = habitsApi.useLazyFetchHabitsQuery();

  const [selectedDate, setSelectedDate] = useState(new Date().getTime());

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
          <Container
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          >
            <HabitsWeekCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {mandatoryHabits.length > 0 || optionalHabits.length > 0 ? (
              <>
                {mandatoryHabits.map((habit) => (
                  <HabitItem
                    key={habit._id}
                    habit={habit}
                    selectedDate={selectedDate}
                  />
                ))}
                {optionalHabits.length > 0 && (
                  <Typography
                    fontWeight="semibold"
                    fontSize="lg"
                    paddingTop={16}
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

export default HabitsScreen;
