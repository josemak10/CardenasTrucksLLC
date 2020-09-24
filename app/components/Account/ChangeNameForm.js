import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function ChangeNameForm(props) {
  const { user, setShowModal, setIsChange } = props;
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const saveName = () => {
    setError(null);
    if (!name) {
      setError("Name is required");
    } else if (user.displayName === name) {
      setError("The names must be different");
    } else {
      const update = {
        displayName: name,
      };
      setLoading(true);
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          db.collection("users")
            .where("idUser", "==", user.uid)
            .get()
            .then((response) => {
              response.forEach((doc) => {
                db.collection("users")
                  .doc(doc.id)
                  .update(update)
                  .then(() => {
                    setLoading(false);
                    setShowModal(false);
                    setIsChange(true);
                  })
                  .catch(() => {
                    setLoading(false);
                    setError("Error updating name");
                  });
              });
            });
        })
        .catch(() => {
          setLoading(false);
          setError("Error updating name");
        });
    }
  };

  return (
    <View>
      <Input
        placeholder="Insert Name"
        defaultValue={user.displayName || ""}
        onChangeText={(e) => setName(e)}
        rightIcon={{
          type: "ionicons",
          name: "account-circle",
          color: "#c2c2c2",
        }}
        errorMessage={error || ""}
      />
      <Button
        title="Change name"
        buttonStyle={styles.btn}
        onPress={saveName}
        containerStyle={{ paddingTop: 10 }}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#143D69",
  },
});
