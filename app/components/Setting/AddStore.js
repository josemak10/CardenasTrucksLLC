import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import colors from "../../utils/colors";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddStore(props) {
  const { setShowModal, storeSelected, setIsRefresh } = props;
  const [name, setName] = useState(storeSelected ? storeSelected.name : null);
  const [address, setAddress] = useState(
    storeSelected ? storeSelected.address : null
  );
  const [location, setLocation] = useState(defaultLocation);
  const [error, setError] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const f_add = () => {
    setError({});
    if (!name || !address) {
      setError({
        name: !name ? "Required name" : "",
        address: !address ? "Required address" : "",
      });
    } else {
      setLoading(true);
      db.collection("stores")
        .add({
          name,
          address,
          location,
          createDate: new Date(),
          createBy: firebase.auth().currentUser.uid,
        })
        .then(() => {
          setLoading(false);
          setIsRefresh(true);
          setShowModal(false);
        })
        .catch(() => {
          setLoading(false);
          setError({
            name: "Error creating store, try again later",
          });
        });
    }
  };

  const f_update = () => {
    setError({});
    if (!name || !address) {
      setError({
        name: !name ? "Required name" : "",
        address: !address ? "Required address" : "",
      });
    } else {
      setLoading(true);
      const store = {
        name,
        address,
        location,
        createDate: new Date(),
        createBy: firebase.auth().currentUser.uid,
      };
      db.collection("stores")
        .doc(storeSelected.id)
        .update(store)
        .then(() => {
          setLoading(false);
          setIsRefresh(true);
          setShowModal(false);
        })
        .catch(() => {
          setLoading(false);
          setError({
            name: "Error updating the store, try again later",
          });
        });
    }
  };

  const f_delete = () => {
    setLoading(true);
    db.collection("stores")
      .doc(storeSelected.id)
      .delete()
      .then(() => {
        setLoading(false);
        setIsRefresh(true);
        setShowModal(false);
      })
      .catch(() => {
        setLoading(false);
        setError({
          name: "Error deleting store, try again later",
        });
      });
  };

  return (
    <View>
      <Input
        autoCapitalize={"characters"}
        label="Name store"
        placeholder="Name"
        defaultValue={name || ""}
        errorMessage={error.name}
        onChangeText={(e) => setName(e)}
        leftIcon={{
          type: "material-community",
          name: "home-circle",
          size: 35,
          color: colors.SILVER,
        }}
        inputStyle={{
          color: colors.STRAW,
          fontWeight: "bold",
          paddingLeft: 10,
        }}
      />
      <Input
        autoCapitalize={"words"}
        label="Address store"
        placeholder="Address"
        defaultValue={address || ""}
        errorMessage={error.address}
        onChangeText={(e) => setAddress(e)}
        leftIcon={{
          type: "material-community",
          name: "location-enter",
          size: 35,
          color: colors.SILVER,
        }}
        inputStyle={{
          color: colors.STRAW,
          fontWeight: "bold",
          paddingLeft: 10,
        }}
      />
      {storeSelected ? (
        <View style={styles.btnContainer}>
          <Button
            title="Delete"
            buttonStyle={styles.btnDelete}
            titleStyle={styles.btnTitle}
            containerStyle={{ width: "50%" }}
            onPress={f_delete}
            loading={loading}
          />
          <Button
            title="Update"
            buttonStyle={styles.btn}
            titleStyle={styles.btnTitle}
            containerStyle={{ width: "50%" }}
            onPress={f_update}
            loading={loading}
          />
        </View>
      ) : (
        <Button
          title="Add store"
          buttonStyle={styles.btn}
          titleStyle={styles.btnTitle}
          containerStyle={{ paddingTop: 15 }}
          onPress={f_add}
          loading={loading}
        />
      )}
    </View>
  );
}

function defaultValue() {
  return {
    name: "",
    address: "",
  };
}

function defaultLocation() {
  return {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  };
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  btn: {
    backgroundColor: colors.REGAL_BLUE,
  },
  btnDelete: {
    backgroundColor: colors.DARK_RED,
  },
  btnTitle: {
    fontSize: 16,
  },
});
