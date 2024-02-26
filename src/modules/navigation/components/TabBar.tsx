import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

import { useAppNavigation } from "../NavigationService";
import { Routes, TabBarRouteNumber } from "../types";

interface TabBarProps {
  currentScreen?: number;
}

const TabBar: FC<TabBarProps> = ({ currentScreen }) => {
  const navigation = useAppNavigation();
  const { t } = useTranslation();

  const getActiveRouteIconColor = (routeName: number) =>
    currentScreen === routeName ? theme.colors.cyan600 : theme.colors.darkGray;

  return (
    <STabBar>
      <TabBarItem onPress={() => navigation.navigate(Routes.NOTES)}>
        <FontAwesome
          name="book"
          color={getActiveRouteIconColor(TabBarRouteNumber.notes)}
          size={theme.fontSizes.xxl}
        />
        <Typography
          paddingTop={2}
          fontSize="xs"
          color={getActiveRouteIconColor(TabBarRouteNumber.notes)}
        >
          {t("note.notes")}
        </Typography>
      </TabBarItem>
      <TabBarItem onPress={() => navigation.navigate(Routes.CALENDAR)}>
        <FontAwesome
          name="calendar-check-o"
          color={getActiveRouteIconColor(TabBarRouteNumber.calendar)}
          size={theme.fontSizes.xxl}
        />
        <Typography
          paddingTop={2}
          fontSize="xs"
          color={getActiveRouteIconColor(TabBarRouteNumber.calendar)}
        >
          {t("calendar.calendar")}
        </Typography>
      </TabBarItem>
    </STabBar>
  );
};

const STabBar = styled.View`
  bottom: 40px;
  z-index: 1000;
  width: 100%;
  background-color: ${theme.colors.bgColor};
  z-index: 100;
  flex-direction: row;
  justify-content: space-around;
`;

const TabBarItem = styled.TouchableOpacity`
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  width: 50%;
`;

export default TabBar;
