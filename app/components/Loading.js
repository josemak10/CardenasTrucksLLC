import React from "react";
import {View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading(props) {
    const { isVisible, text } = props;

    return (
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor= 'rgba(0, 0, 0, 0.5)'
            overlayBackgroundColor= "transparent"
            overlayStyle={styles.overlay}
        >
            <View style={styles.container}>
                <ActivityIndicator size={"large"} color='#184272' />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
)
}

const styles = StyleSheet.create({
    overlay: {
        width: 200,
        height: 100,
        backgroundColor: '#e8f1fa',
        borderWidth: 2,
        borderColor: '#184272',
        borderRadius: 15,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#184272',
        textTransform: 'uppercase',
        marginTop: 10,
    }
})
