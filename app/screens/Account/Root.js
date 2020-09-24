import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import Login from "./Login";
import Register from "./Register";

export default function Root(props) {
  const { toastRef } = props;
  const [isRegister, setIsRegister] = useState(false);

  return (
    <View>
      <Icon
        type="ionicons"
        name="person-add"
        onPress={() => setIsRegister(!isRegister)}
        containerStyle={styles.icon}
        size={30}
      />
      {isRegister ? (
        <View style={{ alignItems: "center" }}>
          <Register toastRef={toastRef} />
        </View>
      ) : (
        <Login toastRef={toastRef} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    width: "98%",
    top: -20,
    alignItems: "flex-end",
  },
});
