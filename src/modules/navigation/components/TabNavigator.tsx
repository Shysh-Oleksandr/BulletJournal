import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalendarScreen from "modules/calendar/screens/CalendarScreen";
import HabitsScreen from "modules/habits/screens/HabitsScreen";
import NotesScreen from "modules/notes/screens/NotesScreen";
import TasksScreen from "modules/tasks/screens/TasksScreen";

import { Routes } from "../types";

import TabBar from "./TabBar";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => (
      <TabBar currentScreen={props.navigation.getState().index} />
    )}
  >
    <Tab.Screen name={Routes.NOTES} component={NotesScreen} />
    <Tab.Screen name={Routes.CALENDAR} component={CalendarScreen} />
    <Tab.Screen name={Routes.TASKS} component={TasksScreen} />
    <Tab.Screen name={Routes.HABITS} component={HabitsScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
