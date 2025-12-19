import {SafeAreaView, Text} from "react-native";
import React from "react";
import {LevelProgression} from "./Goal";

export function QuestScreen({xp}) {

    return (
        <SafeAreaView>
            <LevelProgression input={xp} />
            <Text>Quest</Text>
        </SafeAreaView>
    );
}
