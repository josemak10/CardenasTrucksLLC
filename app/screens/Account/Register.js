import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { size, isEmpty } from "lodash";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

import { validateEmail } from "../../utils/validations";
import colors from "../../utils/colors";

export default function Register(props) {
  const { toastRef } = props;
  const [formData, setFormData] = useState(initialData());
  const [viewPassword, setViewPassword] = useState(false);

  const onChange = (text, type) => {
    setFormData({ ...formData, [type]: text });
  };

  const f_add = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      toastRef.current.show("All fields is required");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("Invalid email");
    } else if (formData.password !== formData.repeatPassword) {
      toastRef.current.show("Password not equal");
    } else if (size(formData.password) < 6) {
      toastRef.current.show("Password must have six minimum character");
    } else {
      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then((response) => {
          db.collection("users")
            .add({
              admin: false,
              displayName: response.user.email,
              driver: false,
              idUser: response.user.uid,
            })
            .then(() => {})
            .catch(() => {
              toastRef.current.show("Error creating, try again later");
            });
        })
        .catch(() => {
          toastRef.current.show("Email is already registered");
        });
    }
  };

  return (
    <View
      style={{
        height: "auto",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.containerInput}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          placeholder={"sn@gmail.com"}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor={"gray"}
          onChangeText={(text) => onChange(text, "email")}
          leftIcon={{
            type: "material-community",
            name: "at",
            size: 29,
            color: colors.SILVER,
          }}
          style={styles.inputText}
        />
      </View>
      <View style={styles.containerInput}>
        <Text style={styles.text}>Password</Text>
        <TextInput
          placeholder={"* * * * * *"}
          autoCorrect={false}
          autoCapitalize={"none"}
          placeholderTextColor={"gray"}
          password={true}
          secureTextEntry={viewPassword ? false : true}
          onChangeText={(text) => onChange(text, "password")}
          leftIcon={{
            type: "ionicons",
            name: "lock",
            size: 29,
            color: colors.SILVER,
          }}
          style={styles.inputText}
          rightIcon={{
            type: "ionicons",
            name: viewPassword ? "lock-open" : "lock-outline",
            size: 25,
            color: colors.SILVER,
            onPress: () => setViewPassword(!viewPassword),
          }}
        />
      </View>
      <View style={styles.containerInput}>
        <Text style={styles.text}>Pass again</Text>
        <TextInput
          placeholder={"* * * * * *"}
          autoCorrect={false}
          autoCapitalize={"none"}
          placeholderTextColor={"gray"}
          password={true}
          secureTextEntry={viewPassword ? false : true}
          onChangeText={(text) => onChange(text, "repeatPassword")}
          leftIcon={{
            type: "ionicons",
            name: "lock",
            size: 29,
            color: colors.SILVER,
          }}
          style={styles.inputText}
          rightIcon={{
            type: "ionicons",
            name: viewPassword ? "lock-open" : "lock-outline",
            size: 25,
            color: colors.SILVER,
            onPress: () => setViewPassword(!viewPassword),
          }}
        />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.touchableButton} onPress={f_add}>
          <Text
            style={{ fontSize: 22, fontWeight: "bold", color: colors.OLD_GOLD }}
          >
            SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function initialData() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
  };
}

const styles = StyleSheet.create({
  containerInput: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  btnContainer: {
    flexDirection: "row",
  },
  touchableButton: {
    backgroundColor: "rgba(24, 66, 114, 0.8)",
    height: 55,
    width: "90%",
    borderRadius: 35,
    borderLeftWidth: 7,
    borderLeftColor: colors.TURTLE_GREE,
    borderRightWidth: 7,
    borderRightColor: colors.TURTLE_GREE,
    borderTopWidth: 3,
    borderTopColor: colors.TURTLE_GREE,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    color: colors.MAROON,
    backgroundColor: colors.SILVER,
    alignItems: "center",
    borderRadius: 25,
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 10,
    width: "63%",
  },
  text: {
    color: colors.GREY,
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: "2%",
    width: "30%",
    paddingBottom: 17,
  },
});
