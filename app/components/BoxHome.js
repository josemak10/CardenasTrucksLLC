import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Icon } from "react-native-elements";
import { DataScreen } from "../data/DATA";

export default function BoxHome(props) {
  const { navigation, userAdmin, userDriver } = props;

  const onPress = (stack, screen) => {
    navigation.navigate(stack, {
      screen: screen,
      params: {
        userAdmin,
      },
    });
  };

  function Item({ item }) {
    return (
      <TouchableOpacity onPress={() => onPress(item.stack, item.screen)}>
        <View style={styles.box}>
          <View style={{ flex: 0.5 }}>
            <Text style={styles.title_top_box}>{item.title}</Text>
          </View>
          <Icon
            name={item.icon}
            type={item.iconType}
            iconStyle={styles.icon}
            size={38}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      horizontal={true}
      data={DataScreen}
      renderItem={({ item }) => {
        if (
          (userDriver && JSON.stringify(item.permission).includes("driver")) ||
          (userAdmin && JSON.stringify(item.permission).includes("admin"))
        ) {
          return <Item item={item} />;
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    width: 130,
    height: 200,
    backgroundColor: "rgba(249, 250, 254, 0.9)",
    borderRadius: 25,
    marginRight: 15,
    padding: 15,
    alignItems: "flex-start",
  },
  title_top_box: {
    paddingTop: "2%",
    fontSize: 18,
    fontWeight: "500",
    color: "#142555",
  },
  icon: {
    color: "#333822",
  },
});
