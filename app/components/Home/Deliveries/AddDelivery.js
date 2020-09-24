import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  Dimensions,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import Toast from "react-native-easy-toast";
import moment from "moment";
import colors from "../../../utils/colors";
import Modal from "../../Modal";
import Searcher from "../../Searcher";

import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddDelivery() {
  const [renderComponent, setRenderComponent] = useState(null);
  const [concept, setConcept] = useState(null);
  const [store, setStore] = useState(null);
  const [truck, setTruck] = useState(null);
  const [state, setState] = useState(true);
  const [user, setUser] = useState(null);
  const [sequence, setSequence] = useState(null);
  const [delivered, setDelivered] = useState(false);
  const [accident, setAccident] = useState(false);
  const [deliveredDate, setDeliveredDate] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const taostRef = useRef();
  const route = useRoute();
  const operation =
    route.params && route.params.operation ? route.params.operation : "create";

  useEffect(() => {
    if (route.params && route.params.delivery_id) {
      setLoading(true);
      db.collection("deliveries")
        .doc(route.params.delivery_id)
        .get()
        .then((response) => {
          const delivery = response.data();
          setConcept(delivery.concept);
          setAccident(delivery.accident);
          setDelivered(delivery.delivered);
          setState(delivery.state);
          setSequence(delivery.sequence);
          let tempDate = new Date(delivery.createDate.seconds * 1000);
          setCreateDate(moment(tempDate).format("lll"));
          if (delivery.deliveredDate) {
            tempDate = new Date(delivery.deliveredDate.seconds * 1000);
            setDeliveredDate(moment(tempDate).format("lll"));
          }
          db.collection("stores")
            .doc(delivery.store)
            .get()
            .then((respStore) => {
              const store = respStore.data();
              store.id = respStore.id;
              setStore(store);
            });
          db.collection("trucks")
            .doc(delivery.truck)
            .get()
            .then((respTruck) => {
              const truck = respTruck.data();
              truck.id = respTruck.id;
              setTruck(truck);
            });
          db.collection("users")
            .where("idUser", "==", delivery.user)
            .limit(1)
            .get()
            .then((respUsers) => {
              respUsers.forEach((doc) => {
                const user = doc.data();
                user.id = doc.id;
                setUser(user);
                setLoading(false);
              });
            });
        });
    }
  }, []);

  const onCreate = () => {
    if (!concept || !store || !truck || !user) {
      taostRef.current.show("All fields is required");
    } else {
      setLoading(true);
      let sequence = 0;
      db.collection("deliveries")
        .get()
        .then((snap) => {
          sequence = snap.size + 1;
          db.collection("deliveries")
            .add({
              sequence,
              concept,
              store: store.id,
              truck: truck.id,
              user: user.idUser,
              state,
              createBy: firebase.auth().currentUser.uid,
              createDate: new Date(),
              delivered,
              accident,
            })
            .then(() => {
              setLoading(false);
              navigation.goBack();
            })
            .catch(() => {
              setLoading(false);
              taostRef.current.show("Error creating delivery, try again later");
            });
        })
        .catch(() => {
          setLoading(false);
          taostRef.current.show("Error creating delivery, try again later");
        });
    }
  };

  const onUpdate = () => {
    let update;
    if (operation === "delivery") {
      if (!delivered) {
        taostRef.current.show("Requires delivery");
      } else {
        update = {
          accident,
          delivered,
          deliveredDate: new Date(),
        };
      }
    } else {
      if (!concept || !store || !truck || !user) {
        taostRef.current.show("All fields is required");
      } else {
        update = {
          concept,
          store: store.id,
          truck: truck.id,
          user: user.idUser,
          state,
          delivered,
          accident,
          writeBy: firebase.auth().currentUser.uid,
          writeDate: new Date(),
        };
      }
    }
    if (update) {
      setLoading(true);
      db.collection("deliveries")
        .doc(route.params.delivery_id)
        .update(update)
        .then(async () => {
          setLoading(false);
          navigation.goBack();
          if (operation === "delivery") {
            const driver = user && user.displayName;
            const title = `Travel ${sequence} Delivered`;
            const subtitile = `By: ${driver} - Accident: ${
              accident ? "Yes" : "No"
            }`;
            await sendPushNotification(title, subtitile);
          }
        })
        .catch(() => {
          setLoading(false);
          taostRef.current.show("Error updating delivery, try again later");
        });
    }
  };

  const onClick = (action) => {
    switch (action) {
      case "stores":
        setRenderComponent(
          <Searcher
            action={action}
            setSelectedRecord={setStore}
            setIsVisible={setIsVisible}
          />
        );
        setIsVisible(true);
        break;
      case "users":
        setRenderComponent(
          <Searcher
            action={action}
            setSelectedRecord={setUser}
            setIsVisible={setIsVisible}
          />
        );
        setIsVisible(true);
        break;
      case "trucks":
        setRenderComponent(
          <Searcher
            action={action}
            setSelectedRecord={setTruck}
            setIsVisible={setIsVisible}
          />
        );
        setIsVisible(true);
        break;
      default:
        break;
    }
  };

  const paddDates = () => {
    if (deliveredDate !== "") return { paddingBottom: 10 };
    else return {};
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        source={require("../../../../assets/img/Form.png")}
        style={styles.image}
      />
      <Input
        disabled={operation === "delivery"}
        autoCapitalize="characters"
        label="Concept"
        autoCorrect={false}
        value={concept}
        onChangeText={(e) => setConcept(e)}
      />
      <Input
        label="Store"
        disabled
        rightIcon={{
          type: "material-community",
          name: "home-circle",
          size: 30,
          color: colors.TURTLE_GREE,
          onPress: () => operation !== "delivery" && onClick("stores"),
        }}
        value={store ? `${store.name} - ${store.address}` : ""}
      />
      <Input
        label="User"
        disabled
        rightIcon={{
          type: "ionicons",
          name: "account-circle",
          size: 30,
          color: colors.TURTLE_GREE,
          onPress: () => operation !== "delivery" && onClick("users"),
        }}
        value={user ? user.displayName : ""}
      />
      <Input
        label="Truck"
        disabled
        rightIcon={{
          type: "material-community",
          name: "truck",
          size: 30,
          color: colors.TURTLE_GREE,
          onPress: () => operation !== "delivery" && onClick("trucks"),
        }}
        value={truck ? truck.numberPlate : ""}
      />
      {operation !== "create" && (
        <View
          style={{ ...styles.containerCheck, justifyContent: "space-between" }}
        >
          <Text style={styles.textCheck}>Delivered</Text>
          <Switch
            trackColor={{ false: colors.RAINE, true: colors.GAMBOGE }}
            thumbColor={delivered ? colors.RUST : colors.NOBEL}
            value={delivered}
            onValueChange={() => setDelivered(!delivered)}
          />
          <Text style={styles.textCheck}>Accident?</Text>
          <Switch
            trackColor={{ false: colors.RAINE, true: colors.GAMBOGE }}
            thumbColor={accident ? colors.RUST : colors.NOBEL}
            value={accident}
            onValueChange={() => setAccident(!accident)}
          />
        </View>
      )}
      {operation === "update" && (
        <>
          <View style={styles.containerCheck}>
            <Text style={styles.textCheck}>State?</Text>
            <Switch
              trackColor={{ false: colors.RAINE, true: colors.GAMBOGE }}
              thumbColor={state ? colors.RUST : colors.NOBEL}
              value={state}
              onValueChange={() => setState(!state)}
            />
            {sequence !== "" && (
              <Text style={styles.textSequence}>{`Sequence: ${sequence}`}</Text>
            )}
          </View>

          <View style={styles.containerDates}>
            {createDate !== "" && (
              <Text style={{ ...styles.textDeliveredDate, ...paddDates() }}>
                {`Create date: ${createDate}`}
              </Text>
            )}
            {deliveredDate !== "" && (
              <Text style={styles.textDeliveredDate}>
                {`Delivered date: ${deliveredDate}`}
              </Text>
            )}
          </View>
        </>
      )}
      <View style={{ paddingTop: 15, width: "100%" }}>
        {operation === "create" ? (
          <View style={styles.btnContainer}>
            <Button
              title="Cancel"
              buttonStyle={styles.btnCancel}
              containerStyle={styles.btn}
              onPress={() => navigation.goBack()}
              loading={loading}
            />
            <Button
              title="Create"
              buttonStyle={styles.btnCreate}
              containerStyle={styles.btn}
              onPress={() => onCreate()}
              loading={loading}
            />
          </View>
        ) : (
          <View style={{ width: "100%" }}>
            <Button
              title="Done"
              buttonStyle={{ backgroundColor: colors.FREE_SPEECH_AQUAMATINE }}
              containerStyle={{ width: "100%" }}
              onPress={() => onUpdate()}
              loading={loading}
            />
          </View>
        )}
      </View>
      <Toast ref={taostRef} position="center" opacity={0.8} />
      {renderComponent && (
        <Modal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          sizeDefault={"70%"}
        >
          {renderComponent}
        </Modal>
      )}
    </View>
  );
}

async function sendPushNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title} 📬`,
      body,
      // body: "Here is the notification body",
      // data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 15,
    paddingTop: 25,
  },
  image: {
    position: "absolute",
    opacity: 0.8,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  btnContainer: {
    width: "100%",
    flexDirection: "row",
  },
  btn: {
    width: "50%",
  },
  btnCreate: {
    backgroundColor: colors.REGAL_BLUE,
  },
  btnCancel: {
    backgroundColor: colors.DARK_RED,
  },
  containerCheck: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    height: 40,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  textCheck: {
    fontSize: 16,
    fontWeight: "700",
    width: 83,
    color: colors.GREY,
  },
  textDeliveredDate: {
    color: colors.RUST,
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "italic",
    paddingBottom: 15,
  },
  textSequence: {
    color: "grey",
    fontSize: 16,
    fontWeight: "700",
    paddingLeft: 15,
  },
  textDeliveredDate: {
    color: colors.BLACK_TRANSPARENT,
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
  },
  containerDates: {
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.STRAW,
    borderRadius: 25,
  },
});
