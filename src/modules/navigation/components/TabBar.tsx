import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useIsKeyboardVisible } from "hooks/useIsKeyboardVisible";
import styled from "styled-components/native";

import { useAppNavigation } from "../NavigationService";
import { Routes, TabBarRouteNumber } from "../types";

import TabBarItem from "./TabBarItem";

interface TabBarProps {
  currentScreen?: number;
}

const TabBar: FC<TabBarProps> = ({ currentScreen }) => {
  const navigation = useAppNavigation();
  const { t } = useTranslation();

  const isKeyboardVisible = useIsKeyboardVisible();

  const getActiveRouteIconColor = (routeName: number) =>
    currentScreen === routeName ? theme.colors.cyan600 : theme.colors.darkGray;

  const navigateToTab = (
    route: Routes.NOTES | Routes.CALENDAR | Routes.TASKS | Routes.HABITS,
  ) => {
    navigation.navigate(Routes.MAIN, { screen: route });
  };

  return (
    <STabBar isKeyboardVisible={isKeyboardVisible}>
      <TabBarItem
        label={t("note.notes")}
        color={getActiveRouteIconColor(TabBarRouteNumber.notes)}
        Icon={
          <FontAwesome
            name="book"
            color={getActiveRouteIconColor(TabBarRouteNumber.notes)}
            size={theme.fontSizes.xxl}
          />
        }
        onPress={() => navigateToTab(Routes.NOTES)}
      />
      <TabBarItem
        label={t("calendar.calendar")}
        color={getActiveRouteIconColor(TabBarRouteNumber.calendar)}
        Icon={
          <FontAwesome
            name="calendar-check-o"
            color={getActiveRouteIconColor(TabBarRouteNumber.calendar)}
            size={theme.fontSizes.xxl}
          />
        }
        onPress={() => navigateToTab(Routes.CALENDAR)}
      />
      <TabBarItem
        label={t("tasks.tasks")}
        color={getActiveRouteIconColor(TabBarRouteNumber.tasks)}
        Icon={
          <FontAwesome5
            name="tasks"
            color={getActiveRouteIconColor(TabBarRouteNumber.tasks)}
            size={theme.fontSizes.xxl}
          />
        }
        onPress={() => navigateToTab(Routes.TASKS)}
      />
      <TabBarItem
        label={t("habits.habits")}
        color={getActiveRouteIconColor(TabBarRouteNumber.habits)}
        Icon={
          <FontAwesome
            name="signal"
            color={getActiveRouteIconColor(TabBarRouteNumber.habits)}
            size={theme.fontSizes.xxl}
          />
        }
        onPress={() => navigateToTab(Routes.HABITS)}
      />
    </STabBar>
  );
};

const STabBar = styled.View<{ isKeyboardVisible: boolean }>`
  z-index: 1000;
  width: 100%;
  background-color: ${theme.colors.bgColor};
  z-index: 100;
  flex-direction: row;
  justify-content: space-around;

  ${({ isKeyboardVisible }) => isKeyboardVisible && `display: none;`}
`;

export default TabBar;
