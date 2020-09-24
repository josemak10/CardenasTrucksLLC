import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/Home/Home";
import Delivery from "../screens/Home/Delivery";
import AddDelivery from "../components/Home/Deliveries/AddDelivery";
import AddMiles from "../components/Home/Deliveries/AddMiles";
import SearcherGeneral from "../components/Home/SearcherGeneral";
import DriverMiles from "../screens/Home/DriverMiles";
import DriverDelivery from "../screens/Home/DriverDelivery";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen
        name="delivery"
        component={Delivery}
        initialParams={{ title: "Deliveries" }}
      />
      <Stack.Screen
        name="delivery-add"
        component={AddDelivery}
        options={{ headerShown: 1, title: "Delivery" }}
      />
      <Stack.Screen
        name="delivery-search"
        component={SearcherGeneral}
        options={{ headerShown: 1, title: "Searcher" }}
      />
      <Stack.Screen
        name="driver-miles"
        component={DriverMiles}
        initialParams={{ title: "Miles" }}
      />
      <Stack.Screen
        name="driver-miles-add"
        component={AddMiles}
        options={{ headerShown: 1, title: "Miles" }}
      />
      <Stack.Screen
        name="driver-delivery"
        component={DriverDelivery}
        initialParams={{ title: "Delivery" }}
      />
    </Stack.Navigator>
  );
}
