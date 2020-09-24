import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";

export default function InfoUser(props) {
  const {
    user: { uid, displayName, photoURL, email },
    toastRef,
    setIsLoading,
    setIsLoadingText,
  } = props;

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show("Access to gallery denied");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show("Not selected image");
      } else {
        uploadAvatar(result.uri)
          .then(() => {
            updateProfile();
          })
          .catch(() => {
            toastRef.current.show("Error updating image");
          });
      }
    }
  };

  const uploadAvatar = async (uri) => {
    setIsLoadingText("Upload image");
    setIsLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
  };

  const updateProfile = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setIsLoading(false);
      })
      .catch(() => {
        toastRef.current.show("Error updating image");
      });
  };

  return (
    <View style={styles.header}>
      <Avatar
        rounded
        onPress={changeAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpg")
        }
        containerStyle={{
          borderWidth: 1,
          width: 110,
          height: 110,
        }}
        showAccessory
      />
      <View style={styles.infoUser}>
        <Text style={styles.textName}>
          {displayName ? displayName : "Anonimo"}
        </Text>
        <Text style={styles.textEmail}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  infoUser: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },
  textName: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  textEmail: {
    fontSize: 17,
  },
});
