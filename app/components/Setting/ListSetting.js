import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  FlatList,
} from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { size } from "lodash";
import { FireSQL } from "firesql";
import colors from "../../utils/colors";

import firebase from "firebase/app";
import "firebase/firestore";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function ListSetting(props) {
  const {
    records,
    setRecordSelected,
    setShowModal,
    isLoading,
    handleLoadMore,
    totalRecord,
    model,
    isVisible = true,
  } = props;
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(null);
  const [isSearcher, setIsSearcher] = useState(false);

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: colors.BLACK_TRANSPARENT,
          marginLeft: "14%",
        }}
      />
    );
  };

  const searcher = (e) => {
    setSearch(e);
    if (e) {
      setIsSearcher(true);
      fireSQL.query(getQuery(e)).then((response) => {
        setIsSearcher(false);
        setSearched(response);
      });
    } else {
      setSearched([]);
    }
  };

  const getQuery = (e) => {
    let query = "";
    switch (model) {
      case "trucks":
        query = `select * from trucks where numberPlate like '${e}%' `;
        break;
      case "stores":
        query = `select * from stores where name like '${e}%' `;
        break;
      case "roles":
        query = `select * from users where displayName like '${e}%' `;
        break;
      default:
        break;
    }
    return query;
  };

  const selectedRecord = (record) => {
    setRecordSelected(record);
    setShowModal(true);
  };

  const Item = (props) => {
    const { record } = props;
    let title = "";
    let subtitle = "";
    let nameIcon = "";
    switch (model) {
      case "trucks":
        title = record.numberPlate;
        nameIcon = "truck";
        break;
      case "stores":
        title = record.name;
        subtitle = record.address;
        nameIcon = "home-circle";
        break;
      case "roles":
        title = record.displayName;
        subtitle = `Admin = ${record.admin ? "Yes" : "No"} - Driver = ${
          record.driver ? "Yes" : "No"
        }`;
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
        leftIcon={{
          type: "material-community",
          name: nameIcon,
          size: 35,
          color: colors.TURTLE_GREE,
        }}
        rightIcon={{
          type: "ionicons",
          name: "chevron-right",
          size: 30,
        }}
        containerStyle={{
          height: 65,
          backgroundColor: colors.SNOW_TRANSPARENT,
        }}
        onPress={() => selectedRecord(record)}
      />
    );
  };

  if (totalRecord === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundRecords}>
          <Text style={styles.textNoMore}>Nothing register</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {isVisible && (
          <SearchBar
            inputStyle={{ color: colors.DARK_RED }}
            placeholder="Type here...."
            lightTheme
            round
            onChangeText={(e) => searcher(e)}
            value={search}
          />
        )}
        {size(records) > 0 ? (
          <FlatList
            ItemSeparatorComponent={renderSeparator}
            data={!search ? records : searched}
            renderItem={({ item }) => <Item record={item} />}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={
              <FooterList
                isLoading={isLoading}
                search={search}
                isSearcher={isSearcher}
              />
            }
          />
        ) : (
          <View style={styles.loaderRecords}>
            <ActivityIndicator size="large" />
            <Text style={styles.textLoading}>Loading...</Text>
          </View>
        )}
      </View>
    );
  }
}

function FooterList(props) {
  const { isLoading, search, isSearcher } = props;
  if (isSearcher) {
    return (
      <View style={styles.loaderRecords}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!search) {
    if (isLoading) {
      return (
        <View style={styles.loaderRecords}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.notFoundRecords}>
          <Text style={styles.textNoMore}>No more register</Text>
        </View>
      );
    }
  } else {
    return <></>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    top: 125,
    width: "100%",
  },
  loaderRecords: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  notFoundRecords: {
    alignItems: "center",
    paddingTop: 10,
  },
  textLoading: {
    paddingTop: 5,
    color: colors.REGAL_BLUE,
    fontSize: 17,
    fontWeight: "700",
  },
  textNoMore: {
    paddingTop: 5,
    color: colors.DARK_RED,
    fontSize: 17,
    fontWeight: "700",
  },
});
