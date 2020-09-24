import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

import Modal from "../../components/Modal";
import Addrole from "../../components/Setting/AddRole";
import ListSetting from "../../components/Setting/ListSetting";
import ButtonsFunctionals from "../../components/Setting/ButtonsFunctionals";

export default function SettingStore() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUser, setTotalUser] = useState(0);
  const [startUser, setStartUser] = useState(null);
  const navigation = useNavigation();
  const limitUser = 10;

  const route = useRoute();

  useEffect(() => {
    db.collection("users")
      .get()
      .then((snap) => {
        setTotalUser(snap.size);
      });

    const total = [];

    db.collection("users")
      .orderBy("idUser", "desc")
      .limit(limitUser)
      .get()
      .then((response) => {
        setStartUser(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          const user = doc.data();
          user.id = doc.id;
          total.push(user);
        });
        setUsers(total);
        setUserSelected(null);
        setIsRefresh(false);
      });
  }, [isRefresh]);

  const handleLoadMore = () => {
    const result = [];
    users.length < totalUser && setIsLoading(true);

    db.collection("users")
      .orderBy("idUser", "desc")
      .startAfter(startUser.data().idUser)
      .limit(limitUser)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartUser(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }
        response.forEach((doc) => {
          const user = doc.data();
          user.id = doc.id;
          result.push(user);
        });

        setUsers([...users, ...result]);
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
        records={users}
        totalRecord={totalUser}
        setRecordSelected={setUserSelected}
        setShowModal={setShowModal}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
        model="roles"
      />
      {showModal && (
        <Modal isVisible={showModal} setIsVisible={setShowModal}>
          <Addrole
            setShowModal={setShowModal}
            userSelected={userSelected}
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
});
