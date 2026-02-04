import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ProfileScreen } from "./Profile";
import { HomeScreen } from "./Home";
import { GoalScreen } from "./Goal";
import { QuestScreen } from "./Quest";
import { BillingScreen } from "./Billing";
import {Landing} from "./GoalLoadingPage"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            id="Tab-navigator"
            screenOptions={{
                // HEADER (top bar)
                headerStyle: { backgroundColor: "#13293D" },
                headerTitleStyle: { color: "#3E92CC", fontWeight: "800", fontSize: 18 },
                headerTintColor: "#3E92CC",

                // TAB BAR (bottom)
                tabBarStyle: {
                    backgroundColor: "#13293D",
                    borderTopColor: "rgba(255,255,255,0.08)",
                    borderTopWidth: 1,
                    height: 64,
                    paddingBottom: 6,
                },
                tabBarActiveTintColor: "#3E92CC",
                tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
                tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
            }}
        >
            <Tab.Screen name="home" component={HomeScreen} />
            <Tab.Screen name="goal" component={GoalScreen} />
            <Tab.Screen name="Quest" component={QuestScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name={"landing"} component={Landing}/>
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/*  tabs stay as the main app */}
                <Stack.Screen name="Back" component={Tabs} options={{ headerShown: false }} />

                {/* Extra screens that you navigate to from inside tabs */}
                <Stack.Screen
                    name="Billing"
                    component={BillingScreen}
                    options={{
                        headerStyle: { backgroundColor: "#13293D" },
                        headerTintColor: "#3E92CC",
                        headerTitleStyle: { color: "#3E92CC", fontWeight: "800", fontSize: 18 },
                        title: "Billing",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
