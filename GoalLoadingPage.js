import React, {useState, useMemo, useRef} from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    ScrollView,

    ActivityIndicator,
} from 'react-native'

export function Landing(){
    return(
        <SafeAreaView style={landing.container}>

                <GoalCard/>



        </SafeAreaView>
    )
}
function GoalCard(){
    const GoalTitle = "hello" // get this from datbase
    const goal = "text" // get goal from database
    // for loop that goes through all goals saved by user
    return(
        <View style={styles.container}>
            <View>
                <Text>{GoalTitle}</Text>
            </View>
            <View style={styles.body}>
             <Text>
                 {goal}
             </Text>
            </View>
            <Pressable onPress={ShowGoalWithObjectives}>
                <Text>
                    Open
                </Text>
            </Pressable>
        </View>
    )
}
function ShowGoalWithObjectives(){
    // show the goal with objectives allowing user to complete
}
const landing = StyleSheet.create({
    container: {
        alignItems: "center"
    }
})
const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: "40%",
        backgroundColor: "rgba(19,41,61,0.85)",
        borderRadius: 10,
        alignItems: "center",
        marginLeft: 10,
        marginTop: 10

    },
    body: {
        width: "88%",
        height: "60%",
        backgroundColor: "grey"
    }

})