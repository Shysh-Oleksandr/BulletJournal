import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import i18n from "localization/i18n";
import CalendarScreen from "modules/calendar/screens/CalendarScreen";
import NotesScreen from "modules/notes/screens/NotesScreen";

import { Routes } from "../types";

import TabBar from "./TabBar";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveBackgroundColor: theme.colors.cyan500,
      tabBarInactiveBackgroundColor: theme.colors.bgColor,
      tabBarActiveTintColor: theme.colors.white,
    }}
    tabBar={(props) => (
      <TabBar currentScreen={props.navigation.getState().index} />
    )}
  >
    <Tab.Screen
      name={Routes.NOTES}
      options={{
        tabBarLabel: i18n.t("note.notes"),
        tabBarIcon: ({ color }) => (
          <FontAwesome name="book" color={color} size={theme.fontSizes.xxl} />
        ),
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.xs,
        },
      }}
      component={NotesScreen}
    />
    <Tab.Screen
      name={Routes.CALENDAR}
      options={{
        tabBarLabel: i18n.t("calendar.calendar"),
        tabBarIcon: ({ color }) => (
          <FontAwesome
            name="calendar-check-o"
            color={color}
            size={theme.fontSizes.xxl}
          />
        ),
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.xs,
        },
      }}
      component={CalendarScreen}
    />
  </Tab.Navigator>
);

export default TabNavigator;
