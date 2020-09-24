import React, { useEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as firebase from "firebase";

import UserGuest from "./UserGuest";
import Loading from "../../components/Loading";

export default function Account() {
  const [login, setLogin] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) setLogin(true);
        else setLogin(false);
      });
    }, [])
  );

  if (login === null) return <Loading isVisible={true} text="Loading ..." />;

  return login ? <>{navigation.navigate("home-stack")}</> : <UserGuest />;
}
