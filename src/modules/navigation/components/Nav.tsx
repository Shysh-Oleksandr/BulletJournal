import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotesScreen from "../../notes/screens/NotesScreen";
import { RootStackParamList, Routes } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Nav = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={Routes.NOTES}
      >
        <Stack.Screen name={Routes.SIGN_IN} component={NotesScreen} />
        <Stack.Screen name={Routes.NOTES} component={NotesScreen} />
        <Stack.Screen name={Routes.EDIT_NOTE} component={NotesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
