import {Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React from "react";
import {LevelProgression} from "./Goal";

export function HomeScreen({xp}){

    return(
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
            <View style={{marginTop: 5}}>
                <LevelProgression input={xp} />
            </View>


            <View style={landingPage.titleContainer}>
                <Text style={landingPage.title}>XpBooster</Text>
            </View>

            <View style={landingPage.container}>
                <Pressable style={landingPage.button} ><Text style={landingPage.buttonText}>button 1</Text></Pressable>
                <Pressable style={landingPage.button}><Text style={landingPage.buttonText}>button 2</Text></Pressable>
                <Pressable style={landingPage.button}><Text style={landingPage.buttonText}>button 3</Text></Pressable>
                <Pressable style={landingPage.button}><Text style={landingPage.buttonText}>button 4</Text></Pressable>
            </View>
        </SafeAreaView>
    )
}
const { width } = Dimensions.get("window");
const landingPage = StyleSheet.create({
    title: {
        textAlign: "center",
        fontSize: Math.min(48, width * 0.12),
        marginTop: 20,
        color: "white",
        fontWeight: "bold",
    },

    titleContainer: {
        width: "90%",
        maxWidth: 420,
        height: 100,
        backgroundColor: "lightgrey",
        borderRadius: 20,
        marginTop: 16,
        borderColor: "black",
        borderWidth: 5,
        justifyContent: "center",
    },

    container: {
        width: "90%",
        maxWidth: 420,
        height: 500,          // <-- let it grow with screen height
        backgroundColor: "lightgrey",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 16,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 5,
        paddingBottom: 16,

    },

    button: {
        width: "85%",
        maxWidth: 340,
        height: 70,
        backgroundColor: "grey",
        borderColor: "black",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginTop: 40,
    },

    buttonText: { fontSize: 26, color: "white" },
});