import React from "react";
import { View } from "react-native";
import { Overlay } from "react-native-elements";

export default function Modal(props) {
  const { sizeDefault = "auto", isVisible, setIsVisible, children } = props;
  const closeModal = () => setIsVisible(false);

  const overlay = {
    height: sizeDefault,
    width: "90%",
    backgroundColor: "#fff",
  };

  return (
    <View style={{ margin: 10 }}>
      <Overlay
        isVisible={isVisible}
        windowBackgroundColor="rgba(0, 0, 0, 0.5)"
        overlayBackgroundColor="transparent"
        overlayStyle={{ ...overlay }}
        onBackdropPress={closeModal}
      >
        {children}
      </Overlay>
    </View>
  );
}
