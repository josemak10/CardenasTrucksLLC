import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";

export default function ButtonsFuntionals(props) {
  const {
    navigation,
    nameMenu,
    setIsRefresh,
    action,
    isVisible = true,
  } = props;

  const funcAdd = () => {
    let parameters;
    if (action === "delivery") {
      parameters = {
        screen: "delivery-add",
        params: {},
      };
    } else if (action === "miles") {
      parameters = {
        screen: "driver-miles-add",
        params: {},
      };
    }
    return parameters;
  };

  const funcSearch = () => {
    let parameters;
    if (action === "delivery") {
      parameters = {
        screen: "delivery-search",
        params: {
          action: "deliveries",
        },
      };
    } else if (action === "miles") {
      parameters = {
        screen: "delivery-search",
        params: {
          action: "miles",
        },
      };
    }
    return parameters;
  };

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
        containerStyle={styles.containterIconHome}
        onPress={() => navigation.navigate("home-stack", { screen: "home" })}
      />
      <Avatar
        rounded
        icon={{
          type: "ionicons",
          name: "refresh",
          size: 20,
          color: "#143D69",
        }}
        containerStyle={styles.containterIconRefresh}
        onPress={() => setIsRefresh(true)}
      />
      {isVisible && (
        <>
          <Avatar
            rounded
            icon={{
              type: "ionicons",
              name: "search",
              size: 20,
              color: "#143D69",
            }}
            containerStyle={styles.containterIconSearcher}
            onPress={() => navigation.navigate("home-stack", funcSearch())}
          />
          <Avatar
            rounded
            icon={{
              type: "ionicons",
              name: "add",
              size: 20,
              color: "#143D69",
            }}
            containerStyle={styles.containterIconAdd}
            onPress={() => navigation.navigate("home-stack", funcAdd())}
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
  containterIconHome: {
    position: "absolute",
    left: 25,
    backgroundColor: "#c2c2c2",
    borderWidth: 1,
  },
  containterIconSearcher: {
    position: "absolute",
    left: 125,
    backgroundColor: "#c2c2c2",
    borderWidth: 1,
  },
  containterIconRefresh: {
    position: "absolute",
    left: 75,
    backgroundColor: "#c2c2c2",
    borderWidth: 1,
  },
  containterIconAdd: {
    position: "absolute",
    left: 175,
    backgroundColor: "#c2c2c2",
    borderWidth: 1,
  },
  menuContainer: {
    alignItems: "flex-end",
    left: 220,
    width: "40%",
  },
  textMenu: {
    fontSize: 22,
    fontWeight: "bold",
    color: "navy",
  },
});
