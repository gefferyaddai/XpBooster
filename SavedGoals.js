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
import { Feather } from "@expo/vector-icons";
import { LevelProgression } from "./Goal";

export function QuestScreen({ xp }) {
    const [activeObjective, setActiveObjective] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // purely UI state for the segmented control (does not change your objective logic)
    const [tab, setTab] = useState("going");

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
    const objectives = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        name: `Quest ${i + 1}`,
        points: `${(i + 2) * 100}`,
        content: "Goal content goes here. Keep it short and clear.",
    }));

    return (
        <SafeAreaView style={styles.safe}>
            <LevelProgression input={xp} />

            {/* Header like the mockup */}
            <View style={styles.header}>
                <Pressable style={styles.headerIconBtn}>
                    <Feather name="menu" size={20} color={COLORS.deepSpaceAlt} />
                </Pressable>

                <Text style={styles.headerTitle}>wish list</Text>

                <Pressable style={styles.headerIconBtn}>
                    <Feather name="search" size={18} color={COLORS.deepSpaceAlt} />
                </Pressable>
            </View>

            {/* Tabs (going / done) */}
            <View style={styles.tabsWrap}>
                <View style={styles.tabs}>
                    <Pressable
                        onPress={() => setTab("going")}
                        style={[styles.tabBtn, tab === "going" && styles.tabBtnActive]}
                    >
                        <Text style={[styles.tabText, tab === "going" && styles.tabTextActive]}>going</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setTab("done")}
                        style={[styles.tabBtn, tab === "done" && styles.tabBtnActive]}
                    >
                        <Text style={[styles.tabText, tab === "done" && styles.tabTextActive]}>done</Text>
                    </Pressable>
                </View>
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {objectives.map((obj) => (
                    <QuestRow key={obj.id} objective={obj} onOpen={openObjective} />
                ))}
            </ScrollView>

            {/* Floating + button (visual; doesn’t change existing objective logic) */}
            <Pressable style={styles.fab} onPress={() => {}}>
                <Feather name="plus" size={22} color="white" />
            </Pressable>

            {/* Modal (same logic as before, just styled lighter) */}
            <Modal transparent visible={modalVisible} animationType="none" onRequestClose={closeObjective}>
                <Pressable style={overlay.backdrop} onPress={closeObjective}>
                    <Animated.View
                        style={[overlay.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={overlay.goalName}>{activeObjective?.name}</Text>
                        <Text style={overlay.goalContent}>{activeObjective?.content}</Text>

                        <View style={overlay.modalActions}>
                            <Pressable style={overlay.cancelBtn} onPress={closeObjective}>
                                <Text style={overlay.cancelText}>Close</Text>
                            </Pressable>

                            <Pressable style={overlay.verifyBtn} onPress={verifyObjective}>
                                <Text style={overlay.verifyText}>Verify</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

function QuestRow({ objective, onOpen }) {
    return (
        <Pressable style={row.container} onPress={() => onOpen(objective)}>
            <View style={row.left}>
                <View style={row.iconBubble}>
                    <Feather name="bookmark" size={16} color={COLORS.balticBlue} />
                </View>

                <View style={row.texts}>
                    <Text style={row.title}>{objective.name}</Text>
                    <Text style={row.sub} numberOfLines={1}>
                        Tap to view details
                    </Text>
                </View>
            </View>

            <Text style={row.points}>{objective.points}</Text>
        </Pressable>
    );
}

// Keep your color identity (blue accents), but the surface is light like the mockup
const COLORS = {
    blueBell: "#3E92CC",
    balticBlue: "#2A628F",
    deepSpace: "#13293D",
    deepSpaceAlt: "#16324F",
    yaleBlue: "#18435A",

    // light UI surfaces
    surface: "#F7F8FC",
    card: "#FFFFFF",
    shadow: "#0B1220",
    border: "rgba(19,41,61,0.08)",
    textDark: "#13293D",
    textMuted: "rgba(19,41,61,0.55)",
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },

    header: {
        height: 56,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textDark,
        letterSpacing: 0.2,
    },
    headerIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.8)",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: COLORS.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
    },

    tabsWrap: {
        paddingHorizontal: 14,
        paddingBottom: 8,
    },
    tabs: {
        backgroundColor: "rgba(19,41,61,0.06)",
        borderRadius: 14,
        padding: 4,
        flexDirection: "row",
        gap: 6,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    tabBtnActive: {
        backgroundColor: COLORS.card,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
    },
    tabText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.textMuted,
    },
    tabTextActive: {
        color: COLORS.textDark,
    },

    list: {
        paddingHorizontal: 14,
        paddingBottom: 90, // space for the FAB
        gap: 10,
    },

    fab: {
        position: "absolute",
        right: 18,
        bottom: 22,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: COLORS.balticBlue,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: COLORS.shadow,
        shadowOpacity: 0.20,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
    },
});

const row = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: COLORS.border,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        shadowColor: COLORS.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 1,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
        paddingRight: 12,
    },
    iconBubble: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: "rgba(62,146,204,0.14)",
        alignItems: "center",
        justifyContent: "center",
    },
    texts: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.textDark,
        marginBottom: 3,
    },
    sub: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    points: {
        fontSize: 13,
        fontWeight: "900",
        color: COLORS.blueBell,
    },
});

const overlay = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(19,41,61,0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "92%",
        borderRadius: 20,
        backgroundColor: COLORS.card,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,

        shadowColor: COLORS.shadow,
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 14 },
        elevation: 6,
    },
    goalName: {
        fontSize: 16,
        fontWeight: "900",
        color: COLORS.textDark,
        marginBottom: 10,
    },
    goalContent: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 19,
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: "rgba(19,41,61,0.06)",
    },
    cancelText: {
        color: COLORS.textDark,
        fontWeight: "800",
    },
    verifyBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: COLORS.balticBlue,
    },
    verifyText: {
        color: "white",
        fontWeight: "900",
        fontSize: 14,
    },
});
