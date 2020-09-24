import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Image } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

import Modal from "../../components/Modal";
import AddStore from "../../components/Setting/AddStore";
import ListSetting from "../../components/Setting/ListSetting";
import ButtonsFunctionals from "../../components/Setting/ButtonsFunctionals";

export default function SettingStore() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [storeSelected, setStoreSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStore, setTotalStore] = useState(0);
  const [startStore, setStartStore] = useState(null);
  const navigation = useNavigation();
  const limitStore = 10;

  const route = useRoute();

  useEffect(() => {
    db.collection("stores")
      .get()
      .then((snap) => {
        setTotalStore(snap.size);
      });

    const totalStores = [];

    db.collection("stores")
      .orderBy("createDate", "desc")
      .limit(limitStore)
      .get()
      .then((response) => {
        setStartStore(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          const store = doc.data();
          store.id = doc.id;
          totalStores.push(store);
        });
        setStores(totalStores);
        setStoreSelected(null);
        setIsRefresh(false);
      });
  }, [isRefresh]);

  const add = () => {
    setStoreSelected(null);
    setShowModal(true);
  };

  const handleLoadMore = () => {
    const resultStores = [];
    stores.length < totalStore && setIsLoading(true);

    db.collection("stores")
      .orderBy("createDate", "desc")
      .startAfter(startStore.data().createDate)
      .limit(limitStore)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartStore(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }
        response.forEach((doc) => {
          const store = doc.data();
          store.id = doc.id;
          resultStores.push(store);
        });

        setStores([...stores, ...resultStores]);
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
        records={stores}
        totalRecord={totalStore}
        setRecordSelected={setStoreSelected}
        setShowModal={setShowModal}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
        model="stores"
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
          <AddStore
            setShowModal={setShowModal}
            storeSelected={storeSelected}
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
