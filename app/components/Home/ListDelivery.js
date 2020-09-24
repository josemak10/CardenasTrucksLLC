import React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  FlatList,
} from "react-native";
import { ListItem } from "react-native-elements";
import moment from "moment";
import { size } from "lodash";
import colors from "../../utils/colors";

export default function ListDelivery(props) {
  const { records, model, totalRecord, selectDelivery } = props;

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 8,
        }}
      />
    );
  };

  const Item = (props) => {
    const { record } = props;
    let title = "";
    let subtitle = "";
    let rightTitle = "";
    let rightSubtitle = "";
    let nameIcon = "";
    let typeIcon = "";
    switch (model) {
      case "deliveries":
        title = `Travel ${record.sequence ? record.sequence : 0}`;
        subtitle = `Acc. ${record.accident ? "Yes" : "No"}`;
        rightTitle = record.concept;
        rightSubtitle = `Delvd. ${record.delivered ? "Yes" : "No"}`;
        nameIcon = record.delivered ? "truck-check" : "truck-fast";
        typeIcon = "material-community";
        break;
      case "miles":
        const createDate = new Date(record.createDate.seconds * 1000);
        title = moment(createDate).format("ll");
        subtitle = `Start ${record.startMile}`;
        rightTitle = `Diff ${record.endMile - record.startMile}`;
        rightSubtitle = `End ${record.endMile}` || "0";
        nameIcon = "speedometer-slow";
        typeIcon = "material-community";
        break;
      default:
        break;
    }
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        rightTitle={rightTitle}
        rightSubtitle={rightSubtitle}
        leftIcon={{
          type: typeIcon,
          name: nameIcon,
          size: 35,
          color: colors.TURTLE_GREE,
        }}
        rightIcon={{
          type: "ionicons",
          name: "chevron-right",
          size: 30,
        }}
        onPress={() => selectDelivery(record.id)}
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
        {size(records) > 0 ? (
          <FlatList
            ItemSeparatorComponent={renderSeparator}
            data={records}
            renderItem={({ item }) => <Item record={item} />}
            keyExtractor={(item, index) => index.toString()}
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

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
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
