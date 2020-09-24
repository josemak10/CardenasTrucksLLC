import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  PixelRatio,
  Image,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import colors from "../../utils/colors";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

import BoxHome from "../../components/BoxHome";
import Loading from "../../components/Loading";

export default function Home() {
  const [reload, setReload] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [userDriver, setUserDriver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true);
    const user = firebaseApp.auth().currentUser;
    setUserId(user.uid);
    setUserName(
      user.displayName
        ? user.displayName
        : user.email.substr(0, user.email.indexOf("@"))
    );
    setUserAvatar(user.photoURL);
    setIsLoading(false);
    setReload(true);
  }, []);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      db.collection("users")
        .where("idUser", "==", userId)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            setUserAdmin(doc.data().admin);
            setUserDriver(doc.data().driver);
          });
          setReload(false);
          setIsLoading(false);
        });
    }
  }, [reload]);

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        source={require("../../../assets/img/Home.png")}
        style={styles.image}
      />
      {userId && (
        <>
          <View style={styles.panel1}>
            <Avatar
              size="large"
              containerStyle={styles.pic}
              rounded
              source={
                userAvatar
                  ? { uri: userAvatar }
                  : require("../../../assets/img/avatar-default.jpg")
              }
            />
            <Text style={styles.name}>
              Hi,{"  "}
              {userName}
            </Text>
          </View>

          <View style={styles.panel2}>
            {userAdmin || userDriver ? (
              <BoxHome
                navigation={navigation}
                userAdmin={userAdmin}
                userDriver={userDriver}
              />
            ) : (
              <UserWaitPermission setReload={setReload} />
            )}
          </View>
        </>
      )}

      <View style={styles.panel3}>
        <View style={styles.date}>
          <Text
            style={{ color: colors.MAROON, fontSize: 14, fontWeight: "500" }}
          >
            {new Date().toDateString()}
          </Text>
        </View>
      </View>
      <Loading isVisible={isLoading} text="Loading" />
    </View>
  );
}

function UserWaitPermission(props) {
  const { setReload } = props;
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ alignItems: "center", paddingBottom: 15 }}>
        <Text style={styles.textWait}>Wait for</Text>
        <Text style={styles.textWait}>permission</Text>
        <Text style={styles.textWait}>to admin</Text>
      </View>
      <View>
        <Text style={styles.textRefresh} onPress={() => setReload(true)}>
          Click to refresh
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  panel1: {
    flex: 0.43,
    width: "100%",
    marginTop: "10%",
    justifyContent: "center",
  },
  panel2: {
    height: "auto",
    flexDirection: "row",
    paddingTop: "8%",
    marginHorizontal: "5%",
  },
  panel3: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  pic: {
    alignSelf: "flex-end",
    right: 25,
  },
  name: {
    color: colors.SNOW,
    fontSize: 25,
    alignSelf: "flex-start",
    paddingLeft: "8%",
    fontWeight: "bold",
    paddingTop: 15,
  },
  date: {
    backgroundColor: colors.STRAW,
    width: 145,
    height: 30,
    borderRadius: 50 / PixelRatio.get(),
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderBottomColor: colors.OLD_GOLD,
    borderRightColor: colors.OLD_GOLD,
    borderLeftColor: colors.OLD_GOLD,
  },
  textWait: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textRefresh: {
    fontSize: 13,
    fontWeight: "600",
    fontStyle: "italic",
    color: colors.OLD_GOLD,
  },
});
