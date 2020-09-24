import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import colors from "../../utils/colors";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddTruck(props) {
  const { setShowModal, truckSelected, setIsRefresh } = props;
  const [numberPlate, setNumberPlate] = useState(
    truckSelected ? truckSelected.numberPlate : null
  );
  const [error, setError] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const f_add = () => {
    setError({});
    if (!numberPlate) {
      setError({
        numberPlate: !numberPlate ? "Required number plate" : "",
      });
    } else {
      setLoading(true);
      db.collection("trucks")
        .add({
          numberPlate,
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
            numberPlate: "Error creating truck, try again later",
          });
        });
    }
  };

  const f_update = () => {
    setError({});
    if (!numberPlate) {
      setError({
        numberPlate: !numberPlate ? "Required number plate" : "",
      });
    } else {
      setLoading(true);
      const truck = {
        numberPlate,
        createDate: new Date(),
        createBy: firebase.auth().currentUser.uid,
      };
      db.collection("trucks")
        .doc(truckSelected.id)
        .update(truck)
        .then(() => {
          setLoading(false);
          setIsRefresh(true);
          setShowModal(false);
        })
        .catch(() => {
          setLoading(false);
          setError({
            numberPlate: "Error updating truck, try again later",
          });
        });
    }
  };

  const f_delete = () => {
    setLoading(true);
    db.collection("trucks")
      .doc(truckSelected.id)
      .delete()
      .then(() => {
        setLoading(false);
        setIsRefresh(true);
        setShowModal(false);
      })
      .catch(() => {
        setLoading(false);
        setError({
          numberPlate: "Error deleting truck, try again later",
        });
      });
  };

  return (
    <View>
      <Input
        autoCapitalize={"characters"}
        autoCorrect={false}
        label="Number plate"
        placeholder="ZFK-217"
        defaultValue={numberPlate || ""}
        errorMessage={error.numberPlate}
        onChangeText={(e) => setNumberPlate(e)}
        leftIcon={{
          type: "material-community",
          name: "truck",
          size: 35,
          color: colors.SILVER,
        }}
        inputStyle={{
          color: colors.STRAW,
          fontWeight: "bold",
          paddingLeft: 10,
        }}
      />
      {truckSelected ? (
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
          title="Add truck"
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
    numberPlate: "",
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
