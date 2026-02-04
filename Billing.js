import React, { useMemo, useState } from "react";
import { SafeAreaView, Pressable, View, Text, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export function BillingScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState("Billing");

    const planInfo = useMemo(
        () => ({
            name: "Geffery Addai",
            country: "Canada",
            planType: "standard",
        }),
        []
    );

    const billingHistory = useMemo(() => [], []);

    const goBack = () => navigation.goBack();

    const onAddNewCard = () => {
        // TODO
    };

    const showBilling = activeTab === "Billing";
    const showHistory = activeTab === "Plan";

    const HistoryList = () => {
        if (!billingHistory.length) {
            return (
                <View style={styles.emptyWrap}>
                    <View style={styles.emptyIcon}>
                        <Feather name="credit-card" size={18} color="#3E92CC" />
                    </View>
                    <Text style={styles.emptyTitle}>No previous charges</Text>
                    <Text style={styles.emptySub}>
                        Your billing history will appear here once you have payments.
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.historyList}>
                {billingHistory.map((item) => (
                    <View key={item.id} style={styles.historyRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.historyTitle}>{item.title}</Text>
                            <Text style={styles.historyDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.historyAmount}>{item.amount}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* HEADER */}
            <View style={styles.header}>


                <Text style={styles.headerTitle}>Billing</Text>

                <View style={styles.headerRightSpacer} />
            </View>

            {/* TABS */}
            <View style={styles.tabsWrap}>
                <Pressable
                    onPress={() => setActiveTab("Billing")}
                    style={styles.tabBtn}
                    android_ripple={{ color: "#00000008" }}
                >
                    <Text style={[styles.tabText, activeTab === "Billing" && styles.tabTextActive]}>Billing</Text>
                </Pressable>

                <Pressable
                    onPress={() => setActiveTab("Plan")}
                    style={styles.tabBtn}
                    android_ripple={{ color: "#00000008" }}
                >
                    <Text style={[styles.tabText, activeTab === "Plan" && styles.tabTextActive]}>Plan</Text>
                </Pressable>
            </View>

            {/* underline indicator */}
            <View style={styles.underlineTrack}>
                <View
                    style={[
                        styles.underlineActive,
                        activeTab === "Billing" ? { left: "0%" } : { left: "50%" },
                    ]}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {showBilling && (
                    <>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Your Plan</Text>

                            <View style={styles.kvRow}>
                                <Text style={styles.kLabel}>Name</Text>
                                <Text style={styles.kValue}>{planInfo.name}</Text>
                            </View>

                            <View style={styles.kvRow}>
                                <Text style={styles.kLabel}>Country</Text>
                                <Text style={styles.kValue}>{planInfo.country}</Text>
                            </View>

                            <View style={styles.kvRow}>
                                <Text style={styles.kLabel}>Plan type</Text>
                                <Text style={styles.kValue}>{planInfo.planType}</Text>
                            </View>
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Billing history</Text>

                            <Pressable
                                onPress={onAddNewCard}
                                style={({ pressed }) => [styles.newCardBtn, pressed && { opacity: 0.92 }]}
                            >
                                <Feather name="plus" size={16} color="#3E92CC" />
                                <Text style={styles.newCardText}>New card</Text>
                            </Pressable>
                        </View>

                        <View style={styles.card}>
                            <HistoryList />
                        </View>
                    </>
                )}

                {showHistory && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Billing history</Text>

                            <Pressable
                                onPress={onAddNewCard}
                                style={({ pressed }) => [styles.newCardBtn, pressed && { opacity: 0.92 }]}
                            >
                                <Feather name="plus" size={16} color="#3E92CC" />
                                <Text style={styles.newCardText}>New card</Text>
                            </Pressable>
                        </View>

                        <View style={styles.card}>
                            <HistoryList />
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F5F7FB" },
    header: {
        paddingHorizontal: 14,
        paddingTop: 6,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    headerTitle: { color: "#13293D", fontSize: 16, fontWeight: "900" },
    headerRightSpacer: { width: 40, height: 40 },

    tabsWrap: {
        marginTop: 6,
        marginHorizontal: 14,
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        overflow: "hidden",
    },
    tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
    tabText: { fontSize: 13, fontWeight: "800", color: "#6B7280" },
    tabTextActive: { color: "#13293D" },

    underlineTrack: {
        marginHorizontal: 14,
        height: 3,
        marginTop: 8,
        backgroundColor: "rgba(19,41,61,0.10)",
        borderRadius: 999,
        overflow: "hidden",
    },
    underlineActive: {
        position: "absolute",
        top: 0,
        width: "50%",
        height: 3,
        backgroundColor: "#3E92CC",
        borderRadius: 999,
    },

    scroll: { paddingBottom: 24, paddingTop: 14 },
    card: {
        marginHorizontal: 14,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        shadowColor: "#0B1220",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    cardTitle: { fontSize: 13, fontWeight: "900", color: "#13293D", marginBottom: 10 },

    kvRow: { marginTop: 8 },
    kLabel: { fontSize: 12, fontWeight: "800", color: "rgba(19,41,61,0.55)" },
    kValue: { marginTop: 4, fontSize: 15, fontWeight: "900", color: "#13293D" },

    sectionHeader: {
        marginTop: 2,
        marginBottom: 10,
        marginHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: { fontSize: 13, fontWeight: "900", color: "#13293D" },

    newCardBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#13293D",
    },
    newCardText: { fontSize: 12, fontWeight: "900", color: "#3E92CC" },

    historyList: { paddingTop: 2 },
    historyRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.06)",
    },
    historyTitle: { fontSize: 13, fontWeight: "900", color: "#13293D" },
    historyDate: { marginTop: 4, fontSize: 12, fontWeight: "700", color: "#6B7280" },
    historyAmount: { fontSize: 13, fontWeight: "900", color: "#13293D", marginLeft: 12 },

    emptyWrap: { paddingVertical: 28, alignItems: "center", justifyContent: "center" },
    emptyIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: "rgba(62,146,204,0.12)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    emptyTitle: { fontSize: 13, fontWeight: "900", color: "#13293D" },
    emptySub: {
        marginTop: 6,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
        paddingHorizontal: 18,
    },
});
