import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";

export default function ButtonsFunctionals(props) {
  const { navigation, nameMenu, userAdmin } = props;

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        icon={{
          type: "ionicons",
          name: "home",
          size: 20,
          color: "#143D69",
        }}
        containerStyle={styles.containterIconPanel}
        onPress={() => navigation.navigate("home-stack", { screen: "home" })}
      />
      {userAdmin && (
        <>
          <Avatar
            rounded
            icon={{
              type: "ionicons",
              name: "settings",
              size: 20,
              color: "#143D69",
            }}
            containerStyle={styles.containterIconSetting}
            onPress={() => navigation.openDrawer()}
          />
        </>
      )}

      <View style={styles.menuContainer}>
        <Text style={styles.textMenu}>{nameMenu || ""}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    top: 55,
    width: "95%",
    height: 43,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    borderRadius: 15,
    borderEndWidth: 2,
    borderStartWidth: 2,
  },
  containterIconPanel: {
    position: "absolute",
    left: 25,
    backgroundColor: "#c2c2c2",
    borderWidth: 1,
  },
  containterIconSetting: {
    position: "absolute",
    left: 75,
    backgroundColor: "#c2c2c2",
    borderWidth: 1,
  },
  menuContainer: {
    alignItems: "flex-end",
    left: 150,
    width: "58%",
  },
  textMenu: {
    fontSize: 22,
    fontWeight: "bold",
    color: "navy",
  },
});
