import { StyleSheet, Text, View } from "react-native";

type Props = {
  streak: number;
  playedToday: boolean;
};

export function StreakCounter({ streak, playedToday }: Props) {
  if (streak === 0) {
    return (
      <View style={[styles.container, styles.neutral]}>
        <Text style={styles.icon}>🔥</Text>
        <View>
          <Text style={styles.label}>今日が最初の一歩！</Text>
          <Text style={styles.sub}>プレイを記録してストリークを始めよう</Text>
        </View>
      </View>
    );
  }

  if (playedToday) {
    return (
      <View style={[styles.container, styles.active]}>
        <Text style={styles.icon}>🔥</Text>
        <View>
          <Text style={styles.labelActive}>
            <Text style={styles.count}>{streak}</Text>
            <Text> 日連続記録済み！</Text>
          </Text>
          <Text style={styles.subActive}>今日もクリア！この調子で続けよう</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.warning]}>
      <Text style={styles.icon}>⏰</Text>
      <View>
        <Text style={styles.labelWarning}>今日まだ記録してない！</Text>
        <Text style={styles.subWarning}>🔥 {streak} 日連続継続中 → 記録しよう</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  neutral: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  active: {
    backgroundColor: "#fff7ed",
    borderColor: "#fed7aa",
  },
  warning: {
    backgroundColor: "#fefce8",
    borderColor: "#fde68a",
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  labelActive: {
    fontSize: 15,
    fontWeight: "600",
    color: "#c2410c",
  },
  labelWarning: {
    fontSize: 15,
    fontWeight: "600",
    color: "#a16207",
  },
  count: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ea580c",
  },
  sub: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  subActive: {
    fontSize: 12,
    color: "#ea580c",
    opacity: 0.7,
    marginTop: 2,
  },
  subWarning: {
    fontSize: 12,
    color: "#ca8a04",
    opacity: 0.8,
    marginTop: 2,
  },
});
