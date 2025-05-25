import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { ActivityIndicator } from "react-native";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import styled from "styled-components/native";

import { useGetHabitQuery } from "../api/habitsApi";
import HabitBestStreaksChart from "../components/habitStats/HabitBestStreaksChart";
import HabitCalendar from "../components/habitStats/HabitCalendar";
import HabitInfoCard from "../components/habitStats/HabitInfoCard";
import HabitInfoSection from "../components/habitStats/HabitInfoSection";
import HabitProgressBar from "../components/habitStats/HabitProgressBar";

const contentContainerStyle = {
  paddingBottom: 70,
};

const HabitStatsScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.HABIT_STATS>;
}> = ({ route }) => {
  const navigation = useAppNavigation();

  const { id, color, label } = route.params;

  const { data: item, isLoading } = useGetHabitQuery(id);

  // const isCheckHabitType = item.habitType === HabitTypes.CHECK;

  if (!item || isLoading) {
    return (
      <>
        <HeaderBar title={label} withBackArrow bgColor={color} />
        <SLinearGradient
          locations={BG_GRADIENT_LOCATIONS}
          colors={BG_GRADIENT_COLORS}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* TODO: add skeleton */}
          <ActivityIndicator size="large" color={color} />
        </SLinearGradient>
      </>
    );
  }

  return (
    <>
      <HeaderBar title={item.label} withBackArrow bgColor={item.color} />
      <AddButton
        contentItem={ContentItem.HABIT}
        withEditIcon
        withTabBarOffset={false}
        bgColor={item.color}
        onPress={() =>
          navigation.navigate(Routes.EDIT_HABIT, {
            id: item._id,
            color: item.color,
          })
        }
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
          stickyHeaderIndices={[1]}
        >
          <HabitInfoSection habit={item} />
          <HabitProgressBar habit={item} />
          <StatsContainer>
            <HabitCalendar habit={item} />
            <HabitInfoCard habit={item} />
            {item.cachedMetrics.bestStreaks && (
              <HabitBestStreaksChart
                bestStreaksData={item.cachedMetrics.bestStreaks}
                color={item.color}
              />
            )}
            {/* <HabitMonthlyBarChart
              oldestHabitLog={item.cachedMetrics.oldestLogDate}
              color={item.color}
            /> */}
          </StatsContainer>
        </SScrollView>
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const SScrollView = styled.ScrollView``;

const StatsContainer = styled.View`
  padding: 20px 20px 0;
`;

export default HabitStatsScreen;
