import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import SettingUser from "../screens/Setting/SettingUser";
import SettingStore from "../screens/Setting/SettingStore";
import SettingTruck from "../screens/Setting/SettingTruck";
import SettingRole from "../screens/Setting/SettingRole";

const Drawer = createDrawerNavigator();

export default function SettingStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="setting-user"
        component={SettingUser}
        initialParams={{
          title: "User",
        }}
        options={{
          title: "User",
        }}
      />
      <Drawer.Screen
        name="setting-store"
        component={SettingStore}
        initialParams={{
          title: "Stores",
        }}
        options={{
          title: "Stores",
        }}
      />
      <Drawer.Screen
        name="setting-truck"
        component={SettingTruck}
        initialParams={{
          title: "Truck",
        }}
        options={{
          title: "Truck",
        }}
      />
      <Drawer.Screen
        name="setting-role"
        component={SettingRole}
        initialParams={{
          title: "Role",
        }}
        options={{
          title: "Role",
        }}
      />
    </Drawer.Navigator>
  );
}
