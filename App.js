import {NavigationContainer} from "@react-navigation/native";
import {ProfileScreen} from "./Profile";
import {HomeScreen} from "./Home"
import {GoalScreen} from "./Goal"
import {QuestScreen} from "./Quest"
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();


export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator id={"Tab-navigator"}>
                <Tab.Screen name={"home"} component={HomeScreen}/>
                <Tab.Screen name={'goal'} component={GoalScreen} />
                <Tab.Screen name={'Quest'} component={QuestScreen} />
                <Tab.Screen name={'Profile'} component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}