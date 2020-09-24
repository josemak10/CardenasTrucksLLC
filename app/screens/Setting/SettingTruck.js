import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Image } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

import Modal from "../../components/Modal";
import AddTruck from "../../components/Setting/AddTruck";
import ListSetting from "../../components/Setting/ListSetting";
import ButtonsFunctionals from "../../components/Setting/ButtonsFunctionals";

export default function SettingStore() {
  const [showModal, setShowModal] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [truckSelected, setTruckSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTruck, setTotalTruck] = useState(0);
  const [startTruck, setStartTruck] = useState(null);
  const navigation = useNavigation();
  const limitTruck = 10;

  const route = useRoute();

  useEffect(() => {
    db.collection("trucks")
      .get()
      .then((snap) => {
        setTotalTruck(snap.size);
      });

    const totalTrucks = [];

    db.collection("trucks")
      .orderBy("createDate", "desc")
      .limit(limitTruck)
      .get()
      .then((response) => {
        setStartTruck(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          const truck = doc.data();
          truck.id = doc.id;
          totalTrucks.push(truck);
        });
        setTrucks(totalTrucks);
        setTruckSelected(null);
        setIsRefresh(false);
      });
  }, [isRefresh]);

  const add = () => {
    setTruckSelected(null);
    setShowModal(true);
  };

  const handleLoadMore = () => {
    const resultTrucks = [];
    trucks.length < totalTruck && setIsLoading(true);

    db.collection("trucks")
      .orderBy("createDate", "desc")
      .startAfter(startTruck.data().createDate)
      .limit(limitTruck)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartTruck(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }
        response.forEach((doc) => {
          const truck = doc.data();
          truck.id = doc.id;
          resultTrucks.push(truck);
        });

        setTrucks([...trucks, ...resultTrucks]);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        source={require("../../../assets/img/Managment.png")}
        containerStyle={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ButtonsFunctionals
          navigation={navigation}
          nameMenu={route.params.title}
          userAdmin={true}
        />
      </View>
      <ListSetting
        records={trucks}
        totalRecord={totalTruck}
        setRecordSelected={setTruckSelected}
        setShowModal={setShowModal}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
        model="trucks"
      />
      <Icon
        type="ionicons"
        name="add-circle"
        size={50}
        onPress={add}
        containerStyle={styles.iconContainer}
      />
      {showModal && (
        <Modal isVisible={showModal} setIsVisible={setShowModal}>
          <AddTruck
            setShowModal={setShowModal}
            truckSelected={truckSelected}
            setIsRefresh={setIsRefresh}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    bottom: 15,
    borderRadius: 25,
  },
});
