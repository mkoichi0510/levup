import * as SecureStore from "expo-secure-store";
import { fetchStreak, fetchCategories, fetchDailyResult } from "../client";

jest.mock("expo-secure-store");
const mockGetItemAsync = SecureStore.getItemAsync as jest.Mock;

describe("api/client", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetItemAsync.mockResolvedValue(null);
  });

  afterEach(() => {
    (global as unknown as { fetch: unknown }).fetch = undefined;
  });

  describe("fetchStreak", () => {
    it("正常レスポンスを返す", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ streak: 5, playedToday: true }),
      } as Response);

      const result = await fetchStreak();
      expect(result).toEqual({ streak: 5, playedToday: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/streak"),
        expect.any(Object)
      );
    });

    it("HTTP エラー時に API error をスロー", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchStreak()).rejects.toThrow("API error: 500");
    });

    it("ネットワークエラー時に Network error をスロー", async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error("Failed to fetch"));

      await expect(fetchStreak()).rejects.toThrow("Network error:");
    });
  });

  describe("fetchCategories", () => {
    it("visible=true クエリ付きで呼ばれる", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ categories: [] }),
      } as Response);

      await fetchCategories();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/categories?visible=true"),
        expect.any(Object)
      );
    });
  });

  describe("fetchDailyResult", () => {
    it("dayKey をパスに含めて呼ばれる", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          dailyResult: { status: "done" },
          categoryResults: [],
        }),
      } as Response);

      await fetchDailyResult("2025-04-01");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/results/2025-04-01"),
        expect.any(Object)
      );
    });

    it("404 時に API error をスロー", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(fetchDailyResult("2025-04-01")).rejects.toThrow(
        "API error: 404"
      );
    });
  });

  describe("JWT 認証ヘッダー", () => {
    it("token あり → Authorization: Bearer ヘッダーが付与される", async () => {
      mockGetItemAsync.mockResolvedValue("test-jwt-token");
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ streak: 3, playedToday: false }),
      } as Response);

      await fetchStreak();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/streak"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-jwt-token",
          }),
        })
      );
    });

    it("token null → Authorization ヘッダーなしで fetch される", async () => {
      mockGetItemAsync.mockResolvedValue(null);
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ streak: 0, playedToday: false }),
      } as Response);

      await fetchStreak();
      const calledWith = (fetch as jest.Mock).mock.calls[0][1];
      expect(calledWith.headers).toEqual({});
    });

    it("401 レスポンス → Unauthorized エラーをスロー", async () => {
      mockGetItemAsync.mockResolvedValue("expired-token");
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      } as Response);

      await expect(fetchStreak()).rejects.toThrow("Unauthorized");
    });

    it("SecureStore 読み取り失敗時 → ヘッダーなしで fetch を続行する", async () => {
      mockGetItemAsync.mockRejectedValue(new Error("SecureStore error"));
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ streak: 0, playedToday: false }),
      } as Response);

      await expect(fetchStreak()).resolves.toBeDefined();
      const calledWith = (fetch as jest.Mock).mock.calls[0][1];
      expect(calledWith.headers).toEqual({});
    });
  });
});
