import * as SecureStore from "expo-secure-store";
import { apiBaseUrl } from "../config/env";

export type StreakResponse = {
  streak: number;
  playedToday: boolean;
};

type Category = {
  id: string;
  name: string;
  visible: boolean;
};

export type CategoriesResponse = {
  categories: Category[];
};

export type DailyResultResponse = {
  dailyResult: {
    status: string;
  };
  categoryResults: {
    categoryId: string;
    playCount: number;
    xpEarned: number;
  }[];
};

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync("jwt");
}

async function get<T>(path: string): Promise<T> {
  const token = await getToken();
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (cause) {
    throw new Error(`Network error: ${path}`, { cause });
  }
  if (res.status === 401) {
    // TODO: LIF-XX ログイン画面実装後にリダイレクト
    console.warn("[api/client] 401 Unauthorized");
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  // TODO: add runtime validation with zod (LIF-31)
  return res.json() as Promise<T>;
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
