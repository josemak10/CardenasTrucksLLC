import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Image } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import colors from "../../utils/colors";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOption from "../../components/Account/AccountOption";
import ButtonsFunctionals from "../../components/Setting/ButtonsFunctionals";

import * as firebase from "firebase";

export default function SettingUser() {
  const [user, setUser] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState("");
  const navigation = useNavigation();
  const toastRef = useRef();

  const route = useRoute();

  useEffect(() => {
    const user = firebase.auth().currentUser;
    setUser(user);
    setIsChange(false);
  }, [isChange]);

  const logOut = () => {
    firebase.auth().signOut();
    navigation.navigate("account-stack", { screen: "account" });
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        source={require("../../../assets/img/Managment.png")}
        containerStyle={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <ButtonsFunctionals
        navigation={navigation}
        nameMenu={route.params.title}
        userAdmin={route.params.userAdmin}
      />
      {user && (
        <>
          <InfoUser
            user={user}
            toastRef={toastRef}
            setIsLoading={setIsLoading}
            setIsLoadingText={setIsLoadingText}
          />
          <AccountOption
            user={user}
            setIsChange={setIsChange}
            navigation={navigation}
          />
        </>
      )}
      <Button
        title="Sign off"
        containerStyle={styles.btnContainer}
        titleStyle={styles.btnTitle}
        buttonStyle={styles.btn}
        onPress={logOut}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text={isLoadingText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  btnContainer: {
    width: "100%",
  },
  btnTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.DARK_RED,
  },
  btn: {
    backgroundColor: "transparent",
  },
});
