import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView,
    Modal,
    Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import { LevelProgression } from "./Goal";

export function QuestScreen({ xp }) {
    const [activeObjective, setActiveObjective] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openObjective = (objective) => {
        setActiveObjective(objective);
        setModalVisible(true);

        scaleAnim.setValue(0.9);
        fadeAnim.setValue(0);

        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
                tension: 40,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 140,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeObjective = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 0.98, duration: 120, useNativeDriver: true }),
        ]).start(() => {
            setModalVisible(false);
            setActiveObjective(null);
        });
    };

    const verifyObjective = () => {
        // TODO: call backend verify endpoint here using activeObjective
        closeObjective();
    };

    // dummy objectives for now (replace with backend later)
    const objectives = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        name: `objective name ${i + 1}`,
        content: "Goal content goes here. This can be 1–2 lines max so it stays clean.",
    }));

    return (
        <SafeAreaView style={styles.safe}>
            <LevelProgression input={xp} />
            <Text style={styles.title}>Daily Side Quest</Text>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {objectives.map((obj) => (
                    <QuestCard key={obj.id} objective={obj} onOpen={openObjective} />
                ))}
            </ScrollView>

            {/* EXPANDED CARD MODAL */}
            <Modal transparent visible={modalVisible} animationType="none" onRequestClose={closeObjective}>
                <Pressable style={overlay.backdrop} onPress={closeObjective}>
                    <Animated.View
                        style={[
                            overlay.card,
                            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                        ]}
                        onStartShouldSetResponder={() => true} // stops closing when tapping inside card
                    >
                        <Text style={overlay.goalName}>{activeObjective?.name}</Text>

                        <Text style={overlay.goalContent}>{activeObjective?.content}</Text>

                        <Pressable style={overlay.verifyBtn} onPress={verifyObjective}>
                            <Text style={overlay.verifyText}>Verify</Text>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

function QuestCard({ objective, onOpen }) {
    return (
        <View style={card.container}>
            <Text style={card.goalName}>{objective.name}</Text>

            <Text style={card.goalContent} numberOfLines={2}>
                {objective.content}
            </Text>

            <Pressable style={card.openBtn} onPress={() => onOpen(objective)}>
                <Text style={card.openText}>Open</Text>
            </Pressable>
        </View>
    );
}

// ✅ add this near your styles (once)
const COLORS = {
    blueBell: "#3E92CC",
    balticBlue: "#2A628F",
    deepSpace: "#13293D",
    deepSpaceAlt: "#16324F",
    yaleBlue: "#18435A",
    text: "rgba(255,255,255,0.92)",
    muted: "rgba(255,255,255,0.65)",
    border: "rgba(255,255,255,0.10)",
};
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: COLORS.deepSpace, // ✅ page background
    },
    title: {
        fontWeight: "800",
        fontSize: 42,
        marginTop: 8,
        marginBottom: 12,
        color: COLORS.blueBell, // ✅ accent title
        letterSpacing: 0.2,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
        gap: 12,
        alignItems: "center",
    },
});
const card = StyleSheet.create({
    container: {
        width: "90%",
        minHeight: 110,
        borderRadius: 16,
        backgroundColor: COLORS.deepSpaceAlt,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,

        // subtle depth
        shadowColor: "#000",
        shadowOpacity: 0.22,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    goalName: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.text, // white-ish
        marginBottom: 8,
    },
    goalContent: {
        fontSize: 14,
        color: COLORS.muted, //muted white
        paddingRight: 70,
    },
    openBtn: {
        position: "absolute",
        right: 14,
        bottom: 14,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: COLORS.balticBlue, //  primary button color
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    openText: {
        color: "white",
        fontWeight: "800",
        fontSize: 14,
    },
});
const overlay = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(19,41,61,0.75)", //  deepSpace tint
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "92%",
        borderRadius: 18,
        backgroundColor: COLORS.yaleBlue, //  modal surface
        padding: 18,
        minHeight: 220,
        borderWidth: 1,
        borderColor: "rgba(62,146,204,0.18)",

        shadowColor: "#000",
        shadowOpacity: 0.30,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
    },
    goalName: {
        fontSize: 20,
        fontWeight: "900",
        color: COLORS.blueBell, //  accent title in modal
        marginBottom: 10,
    },
    goalContent: {
        fontSize: 16,
        color: COLORS.text,
        opacity: 0.95,
        marginBottom: 18,
    },
    verifyBtn: {
        alignSelf: "flex-end",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: COLORS.balticBlue, //  primary
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    verifyText: {
        color: "white",
        fontWeight: "900",
        fontSize: 16,
    },
});
