import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, ListItem, Icon } from "react-native-elements";
import { map } from "lodash";

import Modal from "../../components/Modal";
import ChangeNameForm from "./ChangeNameForm";
import ChangePasswordForm from "./ChangePasswordForm";
import colors from "../../utils/colors";

export default function AccountOption(props) {
  const { user, setIsChange, navigation } = props;
  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const selectComponent = (key) => {
    switch (key) {
      case "displayName":
        setRenderComponent(
          <ChangeNameForm
            user={user}
            setShowModal={setShowModal}
            setIsChange={setIsChange}
          />
        );
        setShowModal(true);
        break;
      case "password":
        setRenderComponent(
          <ChangePasswordForm
            setShowModal={setShowModal}
            navigation={navigation}
          />
        );
        setShowModal(true);
        break;
      default:
        setRenderComponent(null);
        setShowModal(false);
        break;
    }
  };

  const menuOptions = generateOptions(selectComponent);

  return (
    <View style={styles.optionUser}>
      {map(menuOptions, (menu, index) => (
        <ListItem
          key={index}
          title={menu.title}
          leftIcon={{
            type: menu.iconType,
            name: menu.iconLeftName,
            color: menu.iconLeftColor,
            size: 38,
          }}
          // rightIcon={{
          //   type: menu.iconType,
          //   name: menu.iconRightName,
          //   color: menu.iconRightColor,
          //   size: 30,
          // }}
          containerStyle={styles.containerList}
          titleStyle={styles.listText}
          style={{ borderRadius: 25 }}
          onPress={menu.onPress}
        />
      ))}
      {renderComponent && (
        <Modal isVisible={showModal} setIsVisible={setShowModal}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
}

function generateOptions(selectComponent) {
  return [
    {
      title: "Change Name",
      iconType: "ionicons",
      iconLeftName: "account-circle",
      iconLeftColor: colors.TURTLE_GREE,
      iconRightName: "chevron-right",
      iconRightColor: "#ccc",
      onPress: () => selectComponent("displayName"),
    },
    {
      title: "Change Password",
      iconType: "ionicons",
      iconLeftName: "lock",
      iconLeftColor: colors.TURTLE_GREE,
      iconRightName: "chevron-right",
      iconRightColor: "#ccc",
      onPress: () => selectComponent("password"),
    },
  ];
}

const styles = StyleSheet.create({
  optionUser: {
    width: "75%",
    paddingTop: 50,
  },
  containerList: {
    height: 65,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  listText: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.REGAL_BLUE,
  },
});
