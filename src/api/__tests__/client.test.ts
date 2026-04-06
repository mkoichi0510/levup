import { fetchStreak, fetchCategories, fetchDailyResult } from "../client";

describe("api/client", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchStreak", () => {
    it("正常レスポンスを返す", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ streak: 5, playedToday: true }),
      } as Response);

      const result = await fetchStreak();
      expect(result).toEqual({ streak: 5, playedToday: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/streak")
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
        json: async () => ({ categories: [] }),
      } as Response);

      await fetchCategories();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/categories?visible=true")
      );
    });
  });

  describe("fetchDailyResult", () => {
    it("dayKey をパスに含めて呼ばれる", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          dailyResult: { status: "done" },
          categoryResults: [],
        }),
      } as Response);

      await fetchDailyResult("2025-04-01");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/results/2025-04-01")
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
});
