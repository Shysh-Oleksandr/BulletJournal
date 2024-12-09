import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo } from "react";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import HabitBestStreaksChart from "../components/habitStats/HabitBestStreaksChart";
import HabitCalendar from "../components/habitStats/HabitCalendar";
import HabitInfoCard from "../components/habitStats/HabitInfoCard";
import HabitMonthlyBarChart from "../components/habitStats/HabitMonthlyBarChart";
import HabitWeeklyLineChart from "../components/habitStats/HabitWeeklyLineChart";
import { getHabitById } from "../HabitsSelectors";
import { HabitTypes } from "../types";
import { calculateHabitBestStreaks } from "../utils/calculateHabitBestStreaks";

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

  const bestStreaksData = useMemo(
    () => calculateHabitBestStreaks(item.logs),
    [item.logs],
  );

  const isCheckHabitType = item.habitType === HabitTypes.CHECK;

  return (
    <>
      <HeaderBar title={item.label} withBackArrow bgColor={item.color} />
      <AddButton
        contentItem={ContentItem.HABIT}
        withEditIcon
        withTabBarOffset={false}
        bgColor={item.color}
        onPress={() => navigation.navigate(Routes.EDIT_HABIT, { item })}
      />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <SScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={contentContainerStyle}
        >
          <HabitCalendar bestStreaksData={bestStreaksData} habit={item} />
          <HabitInfoCard bestStreaksData={bestStreaksData} habit={item} />
          <HabitBestStreaksChart
            bestStreaksData={bestStreaksData}
            color={item.color}
          />
          <HabitMonthlyBarChart habitLogs={item.logs} color={item.color} />
          {!isCheckHabitType && (
            <HabitWeeklyLineChart habitLogs={item.logs} color={item.color} />
          )}
        </SScrollView>
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const SScrollView = styled.ScrollView``;

export default HabitStatsScreen;
