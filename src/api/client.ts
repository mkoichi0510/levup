import { apiBaseUrl } from "../config/env";

const BASE_URL = apiBaseUrl;

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

async function get<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`);
  } catch (cause) {
    throw new Error(`Network error: ${path}`, { cause });
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
