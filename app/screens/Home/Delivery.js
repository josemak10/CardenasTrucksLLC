import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
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

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      setTotalDeliveries(0);
      const listAll = [];
      db.collection("deliveries")
        .where("delivered", "==", false)
        .where("state", "==", true)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            listAll.push(data);
          });
          setTotalDeliveries(listAll.length);
          setDeliveries(listAll);
        });
      setIsRefresh(false);
    }, [isRefresh])
  );

  const selectDelivery = (delivery_id) => {
    navigation.navigate("home-stack", {
      screen: "delivery-add",
      params: { delivery_id, operation: "update" },
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
        action="delivery"
      />
      <View style={styles.containerList}>
        <ListDelivery
          records={deliveries}
          model="deliveries"
          totalRecord={totalDeliveries}
          selectDelivery={selectDelivery}
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
