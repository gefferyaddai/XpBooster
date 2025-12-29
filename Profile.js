import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const DefaultAvatar = require("./assets/NPP.png");

function RowItem({ icon, label, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.row} android_ripple={{ color: "#00000010" }}>
            <View style={styles.rowLeft}>
                <View style={styles.rowIcon}>{icon}</View>
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9AA3AF" />
        </Pressable>
    );
}

export function ProfileScreen() {

    const name = "Geffery Addai";
    const [photoUri, setPhotoUri] = useState(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission needed", "Please allow photo access to choose a profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.safe}>
            <StatusBar style="light" />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* HERO */}
                <LinearGradient
                    colors={["#0B3B5A", "#0F4C6B", "#0B3B5A"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hero}
                >
                    <SafeAreaView>
                        <View style={styles.heroTop}>
                            <Pressable style={styles.iconBtn}>
                                <Feather name="settings" size={20} color="#E5E7EB" />
                            </Pressable>

                            <Text style={styles.heroTitle}>Profile</Text>

                            <Pressable style={styles.iconBtn}>
                                <Feather name="bell" size={20} color="#E5E7EB" />
                            </Pressable>
                        </View>

                        <View style={styles.heroBody}>
                            <View style={styles.avatarWrap}>
                                <Image
                                    source={photoUri ? { uri: photoUri } : DefaultAvatar}
                                    style={styles.avatar}
                                />
                            </View>

                            <Text style={styles.name}>{name}</Text>

                            {/* hooked to pickImage */}
                            <Pressable style={styles.editBtn} onPress={pickImage}>
                                <Text style={styles.editText}>Edit</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/* CARDS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <RowItem
                        icon={<Feather name="user" size={18} color="#0F4C6B" />}
                        label="Account info"
                        onPress={() => {}}
                    />
                    <RowItem
                        icon={<MaterialIcons name="payment" size={18} color="#0F4C6B" />}
                        label="Billing"
                        onPress={() => {}}
                    />
                    <RowItem
                        icon={<Feather name="sliders" size={18} color="#0F4C6B" />}
                        label="General"
                        onPress={() => {}}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Support</Text>

                    <RowItem
                        icon={<Feather name="help-circle" size={18} color="#0F4C6B" />}
                        label="Help & FAQs"
                        onPress={() => {}}
                    />
                    <RowItem
                        icon={<Feather name="log-out" size={18} color="#B42318" />}
                        label="Log out"
                        onPress={() => {}}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
//TODO create functions to handle account info
//TODO create functions to handle billing info
//TODO create functions to handle genral information
//TODO create functions to handle help FAQs
//TODO create functions to handle log out
// TODO settings and notifications



const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F5F7FB" },
    scroll: { paddingBottom: 24 },

    hero: {
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        paddingBottom: 18,
    },
    heroTop: {
        height: 56,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    heroTitle: {
        color: "#E5E7EB",
        fontSize: 16,
        fontWeight: "700",
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF14",
    },

    heroBody: {
        alignItems: "center",
        paddingTop: 10,
        paddingHorizontal: 16,
    },

    avatarWrap: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#FFFFFF20",
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        width: 108,
        height: 108,
        borderRadius: 54,
    },

    name: {
        marginTop: 10,
        color: "#F9FAFB",
        fontSize: 18,
        fontWeight: "800",
    },

    editBtn: {
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    editText: {
        color: "#0B3B5A",
        fontWeight: "800",
        fontSize: 13,
    },

    card: {
        marginTop: 14,
        marginHorizontal: 14,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#0B1220",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    sectionTitle: {
        paddingHorizontal: 8,
        paddingTop: 2,
        paddingBottom: 8,
        fontSize: 13,
        fontWeight: "800",
        color: "#111827",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    rowIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#EAF3F8",
        alignItems: "center",
        justifyContent: "center",
    },
    rowLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
});
