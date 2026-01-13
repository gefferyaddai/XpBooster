import React from "react";
import {SafeAreaView, Pressable, View, Text, ScrollView} from "react-native";
import { Feather } from "@expo/vector-icons";

function HeaderItem({name}){

    <Pressable>
        <View>
            <Text>{name}</Text>
        </View>
    </Pressable>

}

export function Billing({navigation}){
    const goback = () => {
        navigation.goBack()
    };

    return(
        <SafeAreaView>
            <View>
                <Pressable onPress={goback}>
                    <Feather name={"arrow-left"} size={22} />
                </Pressable>
                <View>
                    <HeaderItem name={Billing}/>
                    <HeaderItem name={PLan}/>
                </View>

            </View>
            <Pressable>
                <Text> +  New Card</Text>
            </Pressable>
            <View>
                <Text>Billing history</Text>
                <ScrollView>
                    {/* where billing history will go*/}
                </ScrollView>
            </View>

        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F5F7FB", padding: 16 },
    title: { fontSize: 28, fontWeight: "900", marginBottom: 14, color: "#13293D" },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    label: { fontSize: 12, fontWeight: "800", color: "rgba(19,41,61,0.55)", marginTop: 12 },
    value: { fontSize: 16, fontWeight: "800", color: "#13293D", marginTop: 4 },
});