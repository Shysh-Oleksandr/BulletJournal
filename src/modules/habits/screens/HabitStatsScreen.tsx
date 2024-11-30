import React, { FC } from "react";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import HabitBestStreaksChart from "../components/habitStats/HabitBestStreaksChart";
import HabitCalendar from "../components/habitStats/HabitCalendar";
import HabitMonthlyBarChart from "../components/habitStats/HabitMonthlyBarChart";
import HabitStreakCard from "../components/habitStats/HabitStreakCard";
import HabitWeeklyLineChart from "../components/habitStats/HabitWeeklyLineChart";
import { getHabitById } from "../HabitsSlice";
import { HabitTypes } from "../types";

const contentContainerStyle = {
  paddingTop: 30,
  paddingHorizontal: 20,
  paddingBottom: 70,
};

const HabitStatsScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.HABIT_STATS>;
}> = ({ route }) => {
  const navigation = useAppNavigation();

  const { id } = route.params;

  const item = useAppSelector((state) => getHabitById(state, id));

  const isCheckHabitType = item.habitType === HabitTypes.CHECK;

  return (
    <>
      <HeaderBar title={item.label} withBackArrow />
      <SScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={contentContainerStyle}
      >
        <HabitCalendar habit={item} />
        <HabitStreakCard habit={item} />
        <HabitBestStreaksChart habitLogs={item.logs} />
        <HabitMonthlyBarChart habitLogs={item.logs} />
        {!isCheckHabitType && <HabitWeeklyLineChart habitLogs={item.logs} />}
      </SScrollView>
      <AddButton
        contentItem={ContentItem.HABIT}
        withEditIcon
        withTabBarOffset={false}
        onPress={() => navigation.navigate(Routes.EDIT_HABIT, { item })}
      />
    </>
  );
};

const SScrollView = styled.ScrollView``;

export default HabitStatsScreen;
