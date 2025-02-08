import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import theme from "theme";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HeaderBar from "components/HeaderBar";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import AddButton, { ContentItem } from "modules/notes/components/AddButton";
import styled from "styled-components/native";

import AllTasksContent from "../components/AllTasksContent";
import CategorizedTasksSection from "../components/common/CategorizedTasksSection";
import TasksSearch from "../components/common/TasksSearch";
import TaskBottomSheet from "../components/tasks/TaskBottomSheet";
import { useFetchTaskElements } from "../hooks/useFetchTaskElements";

const Tab = createMaterialTopTabNavigator();

const TasksScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const { isLoading } = useFetchTaskElements();

  return (
    <>
      <HeaderBar
        title={t("tasks.tasks")}
        trailingContent={() => <TasksSearch />}
      />

      <TaskBottomSheet>
        {(openModal) => (
          <AddButton onPress={openModal} contentItem={ContentItem.TASK} />
        )}
      </TaskBottomSheet>

      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        {isLoading ? (
          <LoaderContainer>
            <ActivityIndicator size="large" color={theme.colors.cyan600} />
          </LoaderContainer>
        ) : (
          <Tab.Navigator
            screenOptions={{
              lazy: true,
              swipeEnabled: false,
              sceneStyle: { backgroundColor: "transparent" },
              tabBarStyle: {
                backgroundColor: theme.colors.cyan300,
                shadowColor: "transparent",
                marginHorizontal: 16,
                marginTop: 16,
                marginBottom: 8,
                borderRadius: 10,
                overflow: "hidden",
              },
              tabBarIndicatorStyle: {
                backgroundColor: theme.colors.cyan600,
                height: 3,
              },
              tabBarLabelStyle: {
                fontWeight: "bold",
                fontSize: theme.fontSizes.md,
              },
              tabBarInactiveTintColor: theme.colors.darkGray,
              tabBarActiveTintColor: theme.colors.darkBlueText,
              tabBarPressColor: theme.colors.cyan700 + "15",
            }}
          >
            <Tab.Screen
              name={t("tasks.categoriesTab")}
              component={CategorizedTasksSection}
            />
            <Tab.Screen
              name={t("tasks.allTasks")}
              component={AllTasksContent}
            />
          </Tab.Navigator>
        )}
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

export default TasksScreen;
