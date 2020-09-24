import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AccountStack from "./AccountStack";
import HomeStack from "./HomeStack";
import SettingStack from "./SettingStack";

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: 0 }}>
        <Stack.Screen name="account-stack" component={AccountStack} />
        <Stack.Screen name="home-stack" component={HomeStack} />
        <Stack.Screen name="setting-stack" component={SettingStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
