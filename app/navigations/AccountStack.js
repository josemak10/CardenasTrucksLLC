import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserGuest from "../screens/Account/UserGuest";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="account" component={Account} />
      <Stack.Screen name="user-guest" component={UserGuest} />
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
}
