import React, { useState, useEffect } from "react";
import { StyleSheet, Switch, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import colors from "../../utils/colors";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddRole(props) {
  const { setShowModal, userSelected, setIsRefresh } = props;
  const displayName = userSelected ? userSelected.displayName : "";
  const [admin, setAdmin] = useState(userSelected ? userSelected.admin : null);
  const [driver, setDriver] = useState(
    userSelected ? userSelected.driver : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const f_update = () => {
    setLoading(true);
    const role = {
      admin,
      driver,
    };
    db.collection("users")
      .doc(userSelected.id)
      .update(role)
      .then(() => {
        setLoading(false);
        setIsRefresh(true);
        setShowModal(false);
      })
      .catch(() => {
        setLoading(false);
        setError({
          message: "Error updating the role, try again later",
        });
      });
  };

  return (
    <View>
      <Input
        disabled
        label="Name"
        placeholder="Name"
        defaultValue={displayName || ""}
        leftIcon={{
          type: "ionicons",
          name: "account-circle",
          size: 35,
          color: colors.SILVER,
        }}
        inputStyle={{
          color: colors.MAROON,
          fontWeight: "bold",
          paddingLeft: 10,
        }}
        errorMessage={error.message}
      />
      <View style={styles.containerCheck}>
        <Text style={styles.textCheck}>Admin</Text>
        <Switch
          trackColor={{ false: colors.RAINE, true: colors.GAMBOGE }}
          thumbColor={admin ? colors.RUST : colors.NOBEL}
          value={admin}
          onValueChange={() => setAdmin(!admin)}
        />
      </View>
      <View style={styles.containerCheck}>
        <Text style={styles.textCheck}>Driver</Text>
        <Switch
          trackColor={{ false: colors.RAINE, true: colors.GAMBOGE }}
          thumbColor={driver ? colors.RUST : colors.NOBEL}
          value={driver}
          onValueChange={() => setDriver(!driver)}
        />
      </View>
      <Button
        title="Update"
        buttonStyle={styles.btn}
        titleStyle={styles.btnTitle}
        onPress={f_update}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  btn: {
    backgroundColor: colors.REGAL_BLUE,
  },
  btnTitle: {
    fontSize: 16,
  },
  containerCheck: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  textCheck: {
    fontSize: 16,
    fontWeight: "700",
    width: 70,
    color: colors.GREY,
  },
});
