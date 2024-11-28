import React, { FC } from "react";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import styled from "styled-components/native";

import HabitLineChart from "../components/habitStats/HabitLineChart";
import HabitStreakCard from "../components/habitStats/HabitStreakCard";

const contentContainerStyle = {
  paddingTop: 30,
  paddingHorizontal: 20,
  paddingBottom: 70,
};

const HabitStatsScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.HABIT_STATS>;
}> = ({ route }) => {
  const navigation = useAppNavigation();

  const { item } = route.params;

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
        <HabitStreakCard habit={item} />
        <HabitLineChart habit={item} />
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
