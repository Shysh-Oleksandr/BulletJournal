import React from "react";
import theme from "theme";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IS_ANDROID } from "modules/app/constants";
import EditNoteScreen from "modules/notes/screens/EditNoteScreen";

import NotesScreen from "../../notes/screens/NotesScreen";
import { RootStackParamList, Routes } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Nav = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bgColor },
          presentation: IS_ANDROID ? "modal" : "card",
          animationTypeForReplace: "push",
          animation: "slide_from_right",
        }}
        initialRouteName={Routes.NOTES}
      >
        <Stack.Screen name={Routes.SIGN_IN} component={NotesScreen} />
        <Stack.Screen name={Routes.NOTES} component={NotesScreen} />
        <Stack.Screen name={Routes.EDIT_NOTE} component={EditNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
