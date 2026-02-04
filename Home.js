import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LevelProgression } from "./Goal";

export function HomeScreen({ xp }) {
    return (
        <SafeAreaView style={styles.safe}>
            {/* Top Progress */}
            <View style={styles.top}>
                <LevelProgression input={xp} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.titleCard}>
                    <Text style={styles.title}>XpBooster</Text>
                    <Text style={styles.subtitle}>Lock in goals • Earn XP • Level up</Text>
                </View>

                <View style={styles.menuCard}>
                    <MenuButton label="Goals" />
                    <MenuButton label="Explore " />
                    <MenuButton label="Leaderboard" />
                    <MenuButton label="Missions" />
                </View>
            </View>
        </SafeAreaView>
    );
}

function MenuButton({ label, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
            ]}
        >
            <Text style={styles.buttonText}>{label}</Text>
            <Text style={styles.buttonHint}>Tap to open</Text>
        </Pressable>
    );
}

const { width } = Dimensions.get("window");
const MAX_WIDTH = 420;

// 🎨 FINAL COLOR SYSTEM
const COLORS = {
    blueBell: "#3E92CC",
    balticBlue: "#2A628F",
    deepSpace: "#13293D",
    deepSpaceAlt: "#16324F",
    yaleBlue: "#18435A",
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.deepSpace,
        paddingHorizontal: 16,
    },

    top: {
        paddingTop: 8,
        paddingBottom: 12,
    },

    content: {
        flex: 1,
        alignItems: "center",
        gap: 16,
    },

    titleCard: {
        width: "100%",
        maxWidth: MAX_WIDTH,
        borderRadius: 22,
        padding: 18,
        backgroundColor: COLORS.deepSpaceAlt,
        borderWidth: 1,
        borderColor: "rgba(62,146,204,0.25)", // Blue Bell tint
    },

    title: {
        fontSize: Math.min(44, width * 0.11),
        fontWeight: "800",
        color: COLORS.blueBell,
        letterSpacing: 0.3,
    },

    subtitle: {
        marginTop: 6,
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
    },

    menuCard: {
        width: "100%",
        maxWidth: MAX_WIDTH,
        borderRadius: 22,
        padding: 14,
        gap: 12,
        backgroundColor: COLORS.yaleBlue,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    button: {
        width: "100%",
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: COLORS.balticBlue,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",

        // depth
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "800",
    },

    buttonHint: {
        marginTop: 4,
        color: "rgba(255,255,255,0.7)",
        fontSize: 12,
        fontWeight: "600",
    },
});
