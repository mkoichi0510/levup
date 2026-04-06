const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
  console.warn(
    "[api/client] EXPO_PUBLIC_API_BASE_URL is not set. " +
      "Falling back to localhost:3000 — this will fail on a physical device."
  );
}

type StreakResponse = {
  streak: number;
  playedToday: boolean;
};

type Category = {
  id: string;
  name: string;
  visible: boolean;
};

type CategoriesResponse = {
  categories: Category[];
};

type DailyResultResponse = {
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
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (cause) {
    throw new Error(`Network error: ${path}`, { cause });
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
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
