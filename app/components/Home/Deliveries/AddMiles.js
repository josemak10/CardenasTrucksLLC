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
import Toast from "react-native-easy-toast";
import moment from "moment";
import colors from "../../../utils/colors";
import Modal from "../../Modal";

import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddMiles() {
  const [renderComponent, setRenderComponent] = useState(null);
  const [entryDate, setEntryDate] = useState(new Date().toDateString());
  const [outputDate, setOutputDate] = useState("");
  const [mile, setMile] = useState(null);
  const [startMile, setStartMile] = useState("0");
  const [endMile, setEndMile] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const taostRef = useRef();
  const route = useRoute();
  const isCreate =
    route.params &&
    (route.params.isCreate == true || route.params.isCreate == false)
      ? route.params.isCreate
      : true;

  useEffect(() => {
    if (route.params && route.params.mile_id) {
      setLoading(true);
      db.collection("miles")
        .doc(route.params.mile_id)
        .get()
        .then((response) => {
          const mile = response.data();
          mile.id = response.id;
          setMile(mile);
          setStartMile(mile.startMile);
          setEndMile(mile.endMile);
          let tempDate = new Date(mile.createDate.seconds * 1000);
          setEntryDate(moment(tempDate).format("lll"));
          if (mile.writeDate) {
            let tempDate = new Date(mile.writeDate.seconds * 1000);
            setOutputDate(moment(tempDate).format("lll"));
          }
          setLoading(false);
        });
    }
  }, []);

  const onCreate = () => {
    if (!startMile) {
      taostRef.current.show("Required start mile");
    } else {
      setLoading(true);
      db.collection("miles")
        .add({
          startMile,
          endMile,
          createBy: firebase.auth().currentUser.uid,
          createDate: new Date(),
        })
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch(() => {
          setLoading(false);
          taostRef.current.show("Error creating miles, try again later");
        });
    }
  };

  const onUpdate = () => {
    if (!endMile) {
      taostRef.current.show("Required end mile");
    } else {
      setLoading(true);
      const update = {
        endMile,
        writeDate: new Date(),
        writeBy: firebase.auth().currentUser.uid,
      };
      db.collection("miles")
        .doc(mile.id)
        .update(update)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch(() => {
          setLoading(false);
          taostRef.current.show("Error updating miles, try again later");
        });
    }
  };

  const onClick = (action) => {
    switch (action) {
      case "start":
        setRenderComponent(
          <AddMile
            action={action}
            setSelectedRecord={setStartMile}
            setIsVisible={setIsVisible}
          />
        );
        setIsVisible(true);
        break;
      case "end":
        setRenderComponent(
          <AddMile
            action={action}
            setSelectedRecord={setEndMile}
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
    if (outputDate !== "") return { paddingBottom: 10 };
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
        label="Start mile"
        disabled
        rightIcon={{
          type: "ionicons",
          name: "play-arrow",
          size: 30,
          color: colors.TURTLE_GREE,
          onPress: () => isCreate && onClick("start"),
        }}
        value={startMile}
      />
      <Input
        label="End mile"
        disabled
        rightIcon={{
          type: "ionicons",
          name: "stop",
          size: 30,
          color: colors.TURTLE_GREE,
          onPress: () => !isCreate && onClick("end"),
        }}
        value={endMile}
      />
      <View style={styles.containerDates}>
        {entryDate !== "" && (
          <Text style={{ ...styles.textDeliveredDate, ...paddDates() }}>
            {`Entry date: ${entryDate}`}
          </Text>
        )}
        {outputDate !== "" && (
          <Text style={styles.textDeliveredDate}>
            {`Output date: ${outputDate}`}
          </Text>
        )}
      </View>
      <View style={{ paddingTop: 15, width: "100%" }}>
        {isCreate ? (
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
          <Button
            title="Done"
            buttonStyle={{ backgroundColor: colors.FREE_SPEECH_AQUAMATINE }}
            containerStyle={{ width: "100%" }}
            onPress={() => onUpdate()}
            loading={loading}
          />
        )}
      </View>
      <Toast ref={taostRef} position="center" opacity={0.8} />
      {renderComponent && (
        <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
}

function AddMile(props) {
  const { action, setSelectedRecord, setIsVisible } = props;
  const [value, setValue] = useState("");
  const placeholder = `${action} mile`;

  const onClick = () => {
    if (value) {
      setSelectedRecord(value);
      setIsVisible(false);
    }
  };

  return (
    <View>
      <Input
        placeholder={placeholder}
        keyboardType="number-pad"
        value={value}
        onChangeText={(e) => setValue(e)}
      />
      <Button
        title="Done"
        buttonStyle={{ backgroundColor: colors.FREE_SPEECH_AQUAMATINE }}
        containerStyle={{ width: "100%" }}
        onPress={() => onClick()}
      />
    </View>
  );
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
    justifyContent: "space-between",
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
