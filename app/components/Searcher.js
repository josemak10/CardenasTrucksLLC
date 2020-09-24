import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SearchBar, ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { size } from "lodash";
import colors from "../utils/colors";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Searcher(props) {
  const { action = "deliveries", setSelectedRecord, setIsVisible } = props;
  const [records, setRecords] = useState(null);
  const [search, setSearch] = useState("");
  const [isSearcher, setIsSearcher] = useState(false);
  const [searched, setSearched] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    setIsSearcher(true);
    const totalList = [];
    db.collection(action)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          totalList.push(data);
        });
        setRecords(totalList);
        setIsSearcher(false);
      })
      .catch(() => {
        setIsSearcher(false);
      });
  }, []);

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
        if (action === "trucks") {
          itemData = `${item.numberPlate.toUpperCase()}`;
          return itemData.includes(e.toUpperCase());
        }
        if (action === "stores") {
          itemData = `${item.name.toUpperCase()}`;
          return itemData.includes(e.toUpperCase());
        }
        if (action === "users") {
          itemData = `${item.displayName.toUpperCase()}`;
          return itemData.includes(e.toUpperCase());
        }
        if (action === "deliveries") {
          itemData = `${item.sequence.toString()} ${item.concept.toUpperCase()}`;
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
    if (action !== "deliveries") {
      setSelectedRecord(record);
      setIsVisible(false);
    } else {
      navigation.navigate("home-stack", {
        screen: "delivery-add",
        params: {
          delivery_id: record.id,
          isDelivery: false,
        },
      });
    }
  };

  const Item = (props) => {
    const { record } = props;
    let title = "";
    let subtitle = "";
    let rightTitle = "";
    let rightSubtitle = "";
    let nameIcon = "";
    let colorIcon = colors.TURTLE_GREE;
    switch (action) {
      case "deliveries":
        title = `Travel ${record.sequence ? record.sequence : 0}`;
        subtitle = `Acc. ${record.accident ? "Yes" : "No"}`;
        rightTitle = record.concept;
        rightSubtitle = `Delvd. ${record.delivered ? "Yes" : "No"}`;
        nameIcon = record.delivered ? "truck-check" : "truck-fast";
        colorIcon = record.delivered ? colors.RUST : colors.TURTLE_GREE;
        break;
      case "trucks":
        title = record.numberPlate;
        nameIcon = "truck";
        break;
      case "stores":
        title = record.name;
        subtitle = record.address;
        nameIcon = "home-circle";
        break;
      case "users":
        title = record.displayName;
        nameIcon = "account-circle";
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
          type: "material-community",
          name: nameIcon,
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
          backgroundColor: colors.MISCHKA_TRANSPARENT,
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
    paddingTop: action === "deliveries" ? 15 : 0,
  };

  return (
    <View style={container}>
      {action === "deliveries" && (
        <Image
          resizeMode="cover"
          source={require("../../assets/img/Form.png")}
          style={styles.image}
        />
      )}
      <View style={styles.containerList}>
        <SearchBar
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomWidth: 0,
            borderTopWidth: 0,
            paddingBottom: 20,
          }}
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
  containerList: {
    width: "90%",
    height: "100%",
    marginHorizontal: 20,
  },
});
