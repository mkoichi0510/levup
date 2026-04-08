import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StreakCounter } from "../src/components/StreakCounter";
import { fetchCategories, fetchDailyResult, fetchStreak } from "../src/api/client";
import { getTodayKey } from "../src/lib/date";
import { aggregateDailyStats } from "../src/lib/aggregate";
import type { HomeData } from "../src/types/home";
import { useAuth } from "../src/context/auth";

export default function HomeScreen() {
  const { token, isLoading: authLoading, signOut } = useAuth();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (authLoading || !token) return;
    isMounted.current = true;

    async function load() {
      try {
        const todayKey = getTodayKey();
        const [streakRes, categoriesRes, dailyRes] = await Promise.all([
          fetchStreak().catch((e) => {
            console.warn("[HomeScreen] fetchStreak failed:", e);
            return { streak: 0, playedToday: false };
          }),
          fetchCategories().catch((e) => {
            console.warn("[HomeScreen] fetchCategories failed:", e);
            return { categories: [] };
          }),
          fetchDailyResult(todayKey).catch((e) => {
            console.warn("[HomeScreen] fetchDailyResult failed:", e);
            return { dailyResult: { status: "pending" }, categoryResults: [] };
          }),
        ]);

        const { totalPlays, totalXp } = aggregateDailyStats(
          dailyRes.categoryResults
        );

        if (isMounted.current) {
          setData({
            streak: streakRes.streak,
            playedToday: streakRes.playedToday,
            totalPlays,
            totalXp,
            hasCategories: categoriesRes.categories.length > 0,
          });
        }
      } catch (e) {
        if (isMounted.current) {
          setError("データの読み込みに失敗しました");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }
    void load();

    return () => {
      isMounted.current = false;
    };
  }, [authLoading, token]);

  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator
          size="large"
          color="#6d28d9"
          accessibilityLabel="読み込み中"
        />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "エラーが発生しました"}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ストリークカウンター（最上部） */}
        <StreakCounter streak={data.streak} playedToday={data.playedToday} />

        {/* 見出し */}
        <Text style={styles.heading}>今日の進捗</Text>

        {/* プライマリCTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="プレイを記録する"
          onPress={() => {
            if (__DEV__) {
              console.log("[HomeScreen] CTA tapped — /play screen not yet implemented");
            }
            Alert.alert("準備中", "プレイ記録画面は近日公開予定です");
          }}
        >
          <Text style={styles.ctaText}>🎮　プレイを記録する</Text>
        </Pressable>

        {/* 今日のサマリー */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>今日のプレイ</Text>
            <Text style={styles.statValue}>
              {data.totalPlays}
              <Text style={styles.statUnit}> 回</Text>
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardXp]}>
            <Text style={styles.statLabel}>獲得 XP</Text>
            <Text style={[styles.statValue, styles.statValueXp]}>
              +{data.totalXp}
              <Text style={styles.statUnit}> XP</Text>
            </Text>
          </View>
        </View>

        {/* 空状態 */}
        {!data.hasCategories && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>まだカテゴリがありません</Text>
            <Text style={styles.emptySub}>
              設定からカテゴリを追加してください
            </Text>
          </View>
        )}

        {/* ログアウト */}
        <Pressable
          style={({ pressed }) => [styles.signOutButton, pressed && styles.buttonPressed]}
          onPress={() =>
            Alert.alert("ログアウト", "ログアウトしますか？", [
              { text: "キャンセル", style: "cancel" },
              { text: "ログアウト", style: "destructive", onPress: signOut },
            ])
          }
          accessibilityRole="button"
          accessibilityLabel="ログアウト"
        >
          <Text style={styles.signOutText}>ログアウト</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  // CTA ボタン
  ctaButton: {
    backgroundColor: "#6d28d9",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#6d28d9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // 統計カード
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  statCardXp: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  statValueXp: {
    color: "#d97706",
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9ca3af",
  },
  // 空状態
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  emptySub: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
  signOutButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
