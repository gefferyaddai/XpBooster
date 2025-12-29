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
            <Tab.Navigator
                id="Tab-navigator"
                screenOptions={{
                    //  HEADER (top bar)
                    headerStyle: {
                        backgroundColor: "#13293D", // Deep Space Blue
                    },
                    headerTitleStyle: {
                        color: "#3E92CC", // Blue Bell
                        fontWeight: "800",
                        fontSize: 18,
                    },
                    headerTintColor: "#3E92CC",

                    //  TAB BAR (bottom)
                    tabBarStyle: {
                        backgroundColor: "#13293D", // Deep Space Blue
                        borderTopColor: "rgba(255,255,255,0.08)",
                        borderTopWidth: 1,
                        height: 64,
                        paddingBottom: 6,
                    },
                    tabBarActiveTintColor: "#3E92CC", // Blue Bell
                    tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: "600",
                    },
                }}
            >
                <Tab.Screen name="home" component={HomeScreen} />
                <Tab.Screen name="goal" component={GoalScreen} />
                <Tab.Screen name="Quest" component={QuestScreen} />
                <Tab.Screen name=" " component={ProfileScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
