import * as SecureStore from "expo-secure-store";
import { apiBaseUrl } from "../config/env";
import { JWT_KEY } from "../constants/auth";
import type {
  CategoriesResponse,
  DailyResultResponse,
  StreakResponse,
} from "../types/api";

export type { CategoriesResponse, DailyResultResponse, StreakResponse };

// NOTE: AuthContext はコンポーネント外で参照できないため、
// client.ts は SecureStore を直接読む設計としている。
// AuthContext との二重読みが発生するが、読み取り専用のため整合性の問題は限定的。
async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(JWT_KEY);
  } catch {
    console.warn("[api/client] SecureStore read failed");
    return null;
  }
}

async function get<T>(path: string): Promise<T> {
  const token = await getToken();
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (cause) {
    throw new Error(`Network error: ${path}`, { cause });
  }
  if (res.status === 401) {
    // TODO: 401 時に signOut() + /signin リダイレクトを自動実行する（LIF-37）
    // client.ts は React Context 外のためイベントバス等の仕組みが必要
    console.warn("[api/client] 401 Unauthorized");
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  // TODO: add runtime validation with zod (LIF-31)
  return res.json() as T;
}

export async function fetchStreak(): Promise<StreakResponse> {
  return get<StreakResponse>("/api/streak");
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  return get<CategoriesResponse>("/api/categories?visible=true");
}

export async function fetchDailyResult(
  dayKey: string
): Promise<DailyResultResponse> {
  return get<DailyResultResponse>(`/api/results/${dayKey}`);
}
