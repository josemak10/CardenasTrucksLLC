import React, { useState, useCallback } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import ButtonsFuntionals from "../../components/Home/ButtonsFuntionals";
import ListDelivery from "../../components/Home/ListDelivery";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function DriverMiles() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      setTotal(0);
      const listAll = [];
      db.collection("miles")
        .where("createBy", "==", firebase.auth().currentUser.uid)
        .limit(10)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            listAll.push(data);
          });
          setTotal(listAll.length);
          setRecords(listAll);
        });
      setIsRefresh(false);
    }, [isRefresh])
  );

  const selectRecord = (mile_id) => {
    navigation.navigate("home-stack", {
      screen: "driver-miles-add",
      params: { mile_id, isCreate: false },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        source={require("../../../assets/img/Form.png")}
        style={styles.image}
      />
      <ButtonsFuntionals
        navigation={navigation}
        nameMenu={route.params.title}
        setIsRefresh={setIsRefresh}
        action="miles"
      />
      <View style={styles.containerList}>
        <ListDelivery
          records={records}
          model="miles"
          totalRecord={total}
          selectDelivery={selectRecord}
        />
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
  containerList: {
    width: "90%",
    height: "100%",
    top: 125,
    marginHorizontal: 20,
  },
});
