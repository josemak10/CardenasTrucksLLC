import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SearchBar, ListItem } from "react-native-elements";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { size } from "lodash";
import colors from "../../utils/colors";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function SearcherGeneral() {
  const [records, setRecords] = useState(null);
  const [search, setSearch] = useState("");
  const [isSearcher, setIsSearcher] = useState(false);
  const [searched, setSearched] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const [option, setOption] = useState("");
  const [visibleDate, setVisibleDate] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const action = route.params.action || "progress";

  useFocusEffect(
    useCallback(() => {
      if (startDate && endDate) {
        setIsSearcher(true);
        const totalList = [];
        if (action !== "progress") {
          db.collection("users")
            .get()
            .then((response) => {
              const dictUser = {};
              response.forEach((doc) => {
                dictUser[doc.data().idUser] = doc.data().displayName;
              });
              db.collection(action)
                .where("createDate", ">=", startDate)
                .where("createDate", "<=", endDate)
                .get()
                .then((response) => {
                  response.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    data.displayName = dictUser[data.createBy];
                    totalList.push(data);
                  });
                  setRecords(totalList);
                  setIsSearcher(false);
                })
                .catch(() => {
                  setIsSearcher(false);
                });
            });
        } else {
          const dict = {};
          db.collection("miles")
            .where("createDate", ">=", startDate)
            .where("createDate", "<=", endDate)
            .get()
            .then((response) => {
              response.forEach((doc) => {
                if (dict[doc.data().createBy]) {
                  dict[doc.data().createBy] +=
                    doc.data().endMile - doc.data().startMile;
                } else {
                  dict[doc.data().createBy] =
                    doc.data().endMile - doc.data().startMile;
                }
              });
              db.collection("users")
                .where("idUser", "in", Object.keys(dict))
                .get()
                .then((response) => {
                  response.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    data.miles = dict[data.idUser];
                    totalList.push(data);
                  });
                  setRecords(totalList);
                  setIsSearcher(false);
                });
            })
            .catch(() => {
              setIsSearcher(false);
            });
        }
      }
    }, [startDate, endDate])
  );

  const getPhotoURL = (uid) => {
    return firebase.storage().ref(`avatar/${uid}`).getDownloadURL();
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 8,
        }}
      />
    );
  };

  const addSearch = (e) => {
    setSearch(e);
    if (e) {
      setIsSearcher(true);
      const newData = records.filter((item) => {
        let itemData = "";
        if (action === "deliveries") {
          itemData = `${item.sequence.toString()} ${item.concept.toUpperCase()}`;
          return itemData.includes(e.toUpperCase());
        }
        if (action === "miles") {
          const createDate = new Date(item.createDate.seconds * 1000);
          let date = moment(createDate).format("ll");
          itemData = `${item.displayName.toUpperCase()} ${date.toString()}`;
          return itemData.includes(e.toUpperCase());
        }
        if (action === "progress") {
          itemData = `${item.displayName.toUpperCase()}`;
          return itemData.includes(e.toUpperCase());
        }
      });
      setIsSearcher(false);
      setSearched(newData);
    } else {
      setSearched([]);
    }
  };

  const getRecord = (record) => {
    let data;
    if (action === "deliveries") {
      data = {
        screen: "delivery-add",
        params: {
          delivery_id: record.id,
          operation: "update",
        },
      };
    } else if (action === "miles") {
      data = {
        screen: "driver-miles-add",
        params: {
          mile_id: record.id,
          isCreate: false,
        },
      };
    }
    navigation.navigate("home-stack", data);
  };

  const Item = (props) => {
    const { record } = props;
    let title = "";
    let subtitle = "";
    let rightTitle = "";
    let rightSubtitle = "";
    let nameIcon = "";
    let typeIcon = "material-community";
    let colorIcon = colors.TURTLE_GREE;
    let state = true;
    switch (action) {
      case "deliveries":
        title = `Travel ${record.sequence ? record.sequence : 0}`;
        subtitle = `Acc. ${record.accident ? "Yes" : "No"}`;
        rightTitle = record.concept;
        rightSubtitle = `Delvd. ${record.delivered ? "Yes" : "No"}`;
        nameIcon = record.delivered ? "truck-check" : "truck-fast";
        colorIcon = record.delivered ? colors.RUST : colors.TURTLE_GREE;
        state = record.state;
        break;
      case "miles":
        const createDate = new Date(record.createDate.seconds * 1000);
        title = moment(createDate).format("ll");
        subtitle = `${record.displayName}`;
        rightTitle = `Diff ${record.endMile - record.startMile}`;
        rightSubtitle = `${record.startMile} to ${record.endMile}` || "";
        nameIcon = "speedometer-slow";
        break;
      case "progress":
        title = record.displayName;
        subtitle = `Miles ${record.miles}`;
        nameIcon = "account-circle";
        typeIcon = "material-community";
        break;
      default:
        break;
    }
    return (
      <ListItem
        bottomDivider={false}
        topDivider={false}
        title={title}
        subtitle={subtitle}
        rightTitle={rightTitle}
        rightSubtitle={rightSubtitle}
        leftIcon={{
          type: state ? typeIcon : "ionicons",
          name: state ? nameIcon : "close",
          size: 35,
          color: colorIcon,
        }}
        rightIcon={{
          type: "ionicons",
          name: "chevron-right",
          size: 30,
        }}
        onPress={() => getRecord(record)}
        containerStyle={{
          height: 65,
          borderRadius: 25,
          backgroundColor: state
            ? colors.MISCHKA_TRANSPARENT
            : colors.SUNDOWN_TRANSPARENT,
        }}
        style={{
          borderRadius: 25,
        }}
        titleStyle={{
          color: colors.MAROON,
          fontWeight: "600",
          fontStyle: "italic",
        }}
        rightSubtitleStyle={{
          color: colors.RUST,
          fontWeight: "500",
        }}
      />
    );
  };

  const container = {
    height: "100%",
    paddingTop: 15,
  };

  const handleClick = (option) => {
    setOption(option);
    setVisibleDate(true);
  };

  const handleConfirm = (date) => {
    if (option === "startDate") {
      setStartDateText(date.toDateString());
      setStartDate(date);
    } else if (option === "endDate") {
      setEndDateText(date.toDateString());
      setEndDate(date);
    }
    setVisibleDate(false);
  };

  return (
    <View style={container}>
      <Image
        resizeMode="cover"
        source={require("../../../assets/img/Form.png")}
        style={styles.image}
      />
      <View style={styles.containerList}>
        <View style={styles.containerDates}>
          <View>
            <TouchableOpacity onPress={() => handleClick("startDate")}>
              <Text style={styles.textDate}>Insert start date</Text>
            </TouchableOpacity>
            <Text style={styles.text}>{startDateText}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => handleClick("endDate")}>
              <Text style={styles.textDate}>Insert end date</Text>
            </TouchableOpacity>
            <Text style={styles.text}>{endDateText}</Text>
          </View>
        </View>
        <SearchBar
          containerStyle={styles.containerSearch}
          inputStyle={{ color: colors.DARK_RED }}
          inputContainerStyle={{ height: 40 }}
          placeholder="Type here...."
          lightTheme
          round
          onChangeText={(e) => addSearch(e)}
          value={search}
        />

        {size(records) > 0 && (
          <FlatList
            ItemSeparatorComponent={renderSeparator}
            data={!search ? records : searched}
            renderItem={({ item }) => <Item record={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {isSearcher && (
          <View style={styles.loaderRecords}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <DateTimePickerModal
          isVisible={visibleDate}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setVisibleDate(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  containerSearch: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    paddingBottom: 20,
    paddingTop: 20,
  },
  containerList: {
    width: "90%",
    height: "100%",
    marginHorizontal: 20,
  },
  containerDates: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  textDate: {
    fontSize: 17,
    fontWeight: "700",
    fontStyle: "italic",
    color: colors.GAMBOGE,
  },
  text: {
    color: colors.OLD_GOLD,
    fontSize: 15,
  },
});
