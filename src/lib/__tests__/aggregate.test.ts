import { aggregateDailyStats } from "../aggregate";

describe("aggregateDailyStats", () => {
  it("空配列のとき totalPlays=0, totalXp=0 を返す", () => {
    expect(aggregateDailyStats([])).toEqual({ totalPlays: 0, totalXp: 0 });
  });

  it("単一カテゴリの合計を返す", () => {
    const result = aggregateDailyStats([
      { categoryId: "cat-1", playCount: 3, xpEarned: 30 },
    ]);
    expect(result).toEqual({ totalPlays: 3, totalXp: 30 });
  });

  it("複数カテゴリの合計を返す", () => {
    const result = aggregateDailyStats([
      { categoryId: "cat-1", playCount: 2, xpEarned: 20 },
      { categoryId: "cat-2", playCount: 5, xpEarned: 50 },
      { categoryId: "cat-3", playCount: 1, xpEarned: 10 },
    ]);
    expect(result).toEqual({ totalPlays: 8, totalXp: 80 });
  });

  it("playCount=0 のカテゴリが含まれていても正しく集計する", () => {
    const result = aggregateDailyStats([
      { categoryId: "cat-1", playCount: 0, xpEarned: 0 },
      { categoryId: "cat-2", playCount: 4, xpEarned: 40 },
    ]);
    expect(result).toEqual({ totalPlays: 4, totalXp: 40 });
  });
});
