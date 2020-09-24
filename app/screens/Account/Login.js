import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { Input, Icon } from "react-native-elements";
import { isEmpty } from "lodash";
import * as firebase from "firebase";

import { validateEmail } from "../../utils/validations";
import Loading from "../../components/Loading";
import colors from "../../utils/colors";

export default function Login(props) {
  const { toastRef } = props;
  const [formData, setFormData] = useState(initialData());
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onChange = (text, type) => {
    setFormData({ ...formData, [type]: text });
  };

  const onSubmit = () => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      toastRef.current.show("All fields are requireds");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("Invalid email");
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show("Incorrect email or password");
        });
    }
  };

  return (
    <View>
      <View style={{ alignItems: "center", paddingBottom: 10 }}>
        <Input
          label="Email"
          placeholder={"sn@gmail.com"}
          autoCorrect={false}
          autoCapitalize={"none"}
          containerStyle={styles.textInput}
          placeholderTextColor={"gray"}
          onChangeText={(text) => onChange(text, "email")}
          leftIcon={{
            type: "material-community",
            name: "at",
            size: 29,
            color: colors.SILVER,
          }}
          inputStyle={{
            color: colors.MAROON,
            fontWeight: "bold",
            paddingLeft: 10,
          }}
        />
        <Input
          label="Password"
          placeholder={"* * * * *"}
          autoCorrect={false}
          autoCapitalize={"none"}
          containerStyle={styles.textInput}
          placeholderTextColor={"gray"}
          password={true}
          secureTextEntry={isVisible ? false : true}
          onChangeText={(text) => onChange(text, "password")}
          leftIcon={{
            type: "ionicons",
            name: "lock",
            size: 29,
            color: colors.SILVER,
          }}
          inputStyle={{
            color: colors.MAROON,
            fontWeight: "bold",
            paddingLeft: 10,
          }}
          rightIcon={{
            type: "ionicons",
            name: isVisible ? "lock-open" : "lock-outline",
            size: 25,
            color: colors.SILVER,
            onPress: () => setIsVisible(!isVisible),
          }}
        />
      </View>
      <Animated.View style={styles.button}>
        <TouchableOpacity style={styles.touchableButton} onPress={onSubmit}>
          <Text
            style={{ fontSize: 22, fontWeight: "bold", color: colors.OLD_GOLD }}
          >
            LOG IN
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <Loading isVisible={loading} text="Log in..." />
    </View>
  );
}

function initialData() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  btnRegster: {
    color: colors.DARK_CERULEAN,
    fontWeight: "bold",
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 35,
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
  textInput: {
    width: "90%",
    height: 70,
  },
});
