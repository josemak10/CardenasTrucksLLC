import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import Animated, {
  Easing,
  block,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  cond,
  eq,
  event,
  set,
  interpolate,
  Value,
  Extrapolate,
  concat,
} from "react-native-reanimated";
import { Icon } from "react-native-elements";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { Image, Circle, ClipPath, Svg } from "react-native-svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Toast from "react-native-easy-toast";
import colors from "../../utils/colors";
import Root from "./Root";

const { height, width } = Dimensions.get("window");

export default function UserGuest() {
  const buttonOpactity = new Value(1);
  const onStateChange = stateOpenClose(buttonOpactity, 1, 0);
  const onCloseState = stateOpenClose(buttonOpactity, 0, 1);
  const buttonY = fieldInterpole(buttonOpactity, [0, 1], [100, 0]);
  const logInY = fieldInterpole(buttonOpactity, [0, 1], [-height / 3 - 50, 0]);
  const textInputZindex = fieldInterpole(buttonOpactity, [0, 1], [1, -1]);
  const textInputY = fieldInterpole(buttonOpactity, [0, 1], [0, 100]);
  const textInputOpacity = fieldInterpole(buttonOpactity, [0, 1], [1, 0]);
  const rotateCross = fieldInterpole(buttonOpactity, [0, 1], [180, 360]);

  const toastRef = useRef();

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "flex-end",
      }}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          transform: [{ translateY: logInY }],
        }}
      >
        <Svg height={height + 50} width={width}>
          <ClipPath id={"clip"}>
            <Circle r={height + 50} cx={width / 2} />
          </ClipPath>
          <Image
            href={require("../../../assets/img/Home.png")}
            height={height + 50}
            width={width}
            preserveAspectRatio={"xMidYMid slice"}
            clipPath={"url(#clip)"}
          />
        </Svg>
      </Animated.View>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          transform: [{ translateY: logInY }],
          alignItems: "flex-end",
          right: "10%",
          top: "13%",
          shadowColor: "yellow",
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.2,
        }}
      >
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            color: colors.TURTLE_GREE,
          }}
        >
          CARDENAS
        </Text>
        <Text
          style={{
            fontSize: 29,
            fontWeight: "700",
            color: colors.TURTLE_GREE,
          }}
        >
          Truck's LLC
        </Text>
      </Animated.View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <View style={{ height: height / 3, justifyContent: "center" }}>
        <TapGestureHandler onHandlerStateChange={onStateChange}>
          <Animated.View
            style={{
              ...styles.button,
              opacity: buttonOpactity,
              transform: [{ translateY: buttonY }],
            }}
          >
            <TouchableOpacity style={styles.touchableButton}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: colors.OLD_GOLD,
                }}
              >
                LOG IN
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TapGestureHandler>

        <Animated.View
          style={{
            zIndex: textInputZindex,
            opacity: textInputOpacity,
            transform: [{ translateY: textInputY }],
            height: height / 3,
            ...StyleSheet.absoluteFill,
            top: null,
            justifyContent: "center",
          }}
        >
          <TapGestureHandler onHandlerStateChange={onCloseState}>
            <Animated.View style={styles.closeButton}>
              <TouchableOpacity style={styles.touchableCloseButton}>
                <Animated.Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    transform: [{ rotate: concat(rotateCross, "deg") }],
                  }}
                >
                  X
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          </TapGestureHandler>

          <Root toastRef={toastRef} />
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  );
}

function stateOpenClose(buttonOpactity, val1, val2) {
  return event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpactity, runTiming(new Clock(), val1, val2))
          ),
        ]),
    },
  ]);
}

function fieldInterpole(buttonOpactity, inputRange, outputRange) {
  return interpolate(buttonOpactity, {
    inputRange: inputRange,
    outputRange: outputRange,
    extrapolate: Extrapolate.CLAMP,
  });
}

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}

const styles = StyleSheet.create({
  button: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 35,
  },
  touchableButton: {
    backgroundColor: colors.DARK_CERULEAN_TRANSPARENT,
    height: 55,
    width: "90%",
    borderRadius: 35,
    borderLeftWidth: 7,
    borderLeftColor: colors.TURTLE_GREE,
    borderRightWidth: 7,
    borderRightColor: colors.TURTLE_GREE,
    borderTopWidth: 3,
    borderTopColor: colors.TURTLE_GREE,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -20,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
  },
  touchableCloseButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.MISCHKA,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: colors.TURTLE_GREE,
    shadowOpacity: 0.2,
  },
});
