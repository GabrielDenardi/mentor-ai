import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";

type StudyItem = {
    id: number;
    day: string;
    content: string;
    duration: number;
    completed: boolean;
};

interface Props {
    plan: StudyItem[];
    subject: string;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 11,
        color: "#333",
        backgroundColor: "#F5F7FA",
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        color: "#4F46E5",
    },
    progressContainer: {
        marginTop: 12,
        marginBottom: 30,
    },
    progressBackground: {
        width: "100%",
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: (pct: number) => ({
        width: `${pct}%`,
        height: 8,
        backgroundColor: "#4F46E5",
    }),
    dayCard: {
        marginBottom: 18,
        borderRadius: 8,
        border: "1pt solid #D1D5DB",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    dayHeader: {
        backgroundColor: "#4F46E5",
        color: "#FFFFFF",
        paddingVertical: 6,
        paddingHorizontal: 12,
        fontSize: 14,
        fontWeight: "bold",
    },
    entries: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    entryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    entryText: {
        flex: 1,
        paddingRight: 8,
        fontSize: 12,
        lineHeight: 1.2,
    },
    entryTextCompleted: {
        color: "#9CA3AF",
        textDecoration: "line-through",
    },
    duration: {
        width: 40,
        textAlign: "right",
        fontSize: 12,
        fontWeight: "bold",
        color: "#4F46E5",
    },
    check: {
        marginRight: 4,
        color: "#10B981",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 9,
        color: "#999999",
    },
});

export function StudyPlanPDF({ plan, subject }: Props) {
    const grouped = plan.reduce<Record<string, StudyItem[]>>((acc, it) => {
        (acc[it.day] ||= []).push(it);
        return acc;
    }, {});

    const completedCount = plan.filter((it) => it.completed).length;
    const pct = plan.length ? Math.round((completedCount / plan.length) * 100) : 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Plano de Estudos — {subject}</Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                        <View style={styles.progressFill(pct)} />
                    </View>
                    <Text
                        style={{
                            textAlign: "right",
                            fontSize: 10,
                            marginTop: 4,
                            color: "#6B7280",
                        }}
                    >
                        {pct}% concluído
                    </Text>
                </View>

                {Object.entries(grouped).map(([day, items]) => (
                    <View key={day} style={styles.dayCard}>
                        <Text style={styles.dayHeader}>{day}</Text>
                        <View style={styles.entries}>
                            {items.map((it) => (
                                <View key={it.id} style={styles.entryRow}>
                                    <Text
                                        style={[
                                            styles.entryText,
                                            it.completed && styles.entryTextCompleted,
                                        ]}
                                    >
                                        {it.completed ? "✓ " : "• "}
                                        {it.content}
                                    </Text>
                                    <Text style={styles.duration}>{it.duration} min</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) =>
                        `Página ${pageNumber} de ${totalPages}`
                    }
                    fixed
                />
            </Page>
        </Document>
    );
}
