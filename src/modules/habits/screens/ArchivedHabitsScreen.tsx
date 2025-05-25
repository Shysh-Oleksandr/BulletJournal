import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import theme from "theme";

import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";

import { habitsApi, useGetArchivedHabitsQuery } from "../api/habitsApi";
import ArchivedHabitItem from "../components/habitItem/ArchivedHabitItem";

const contentContainerStyle = {
  paddingTop: 20,
  paddingBottom: 185,
  paddingHorizontal: 16,
};

const ArchivedHabitsScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const navigation = useAppNavigation();

  const { mutate: updateHabit } = habitsApi.useUpdateHabitMutation();

  const { data: archivedHabits = [], isLoading } = useGetArchivedHabitsQuery();

  const onUnarchive = useCallback(
    (_id: string) => {
      updateHabit({
        _id,
        isArchived: false,
      });
    },
    [updateHabit],
  );

  if (isLoading) {
    return (
      <>
        <HeaderBar withBackArrow title={t("habits.theArchive")} />
        <SLinearGradient
          locations={BG_GRADIENT_LOCATIONS}
          colors={BG_GRADIENT_COLORS}
          style={{
            paddingTop: 50,
            alignItems: "center",
          }}
        >
          {/* TODO: add skeleton */}
          <ActivityIndicator size="large" color={theme.colors.cyan600} />
        </SLinearGradient>
      </>
    );
  }

  return (
    <>
      <HeaderBar withBackArrow title={t("habits.theArchive")} />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <Container
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        >
          {archivedHabits.length > 0 ? (
            archivedHabits.map((habit) => (
              <ArchivedHabitItem
                key={habit._id}
                label={habit.label}
                onPress={() =>
                  navigation.navigate(Routes.HABIT_STATS, {
                    id: habit._id,
                    color: habit.color,
                    label: habit.label,
                  })
                }
                onUnarchive={() => onUnarchive(habit._id)}
              />
            ))
          ) : (
            <Typography fontWeight="semibold" fontSize="lg" align="center">
              {t("habits.noArchivedHabitsText")}
            </Typography>
          )}
        </Container>
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const Container = styled.ScrollView``;

export default ArchivedHabitsScreen;
