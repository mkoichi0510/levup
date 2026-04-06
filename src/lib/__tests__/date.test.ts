import { getTodayKey } from "../date";

describe("getTodayKey", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("YYYY-MM-DD 形式で返す", () => {
    const key = getTodayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("UTC 午後3時（JST 翌日 0時）は JST 翌日の日付を返す", () => {
    // UTC 2025-01-01T15:00:00Z = JST 2025-01-02T00:00:00+09:00
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T15:00:00Z"));
    expect(getTodayKey()).toBe("2025-01-02");
  });

  it("UTC 深夜 23:59 は JST 翌日になる", () => {
    // UTC 2025-03-31T23:59:59Z = JST 2025-04-01T08:59:59+09:00
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-03-31T23:59:59Z"));
    expect(getTodayKey()).toBe("2025-04-01");
  });

  it("月・日が1桁のとき 0 埋めされる", () => {
    // JST 2025-01-05
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-04T20:00:00Z")); // JST 2025-01-05T05:00:00
    expect(getTodayKey()).toMatch(/^\d{4}-01-05$/);
  });

  it("UTC 午後2時59分（JST 23:59）は当日の日付を返す", () => {
    // UTC 2025-06-15T14:59:59Z = JST 2025-06-15T23:59:59+09:00
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-15T14:59:59Z"));
    expect(getTodayKey()).toBe("2025-06-15");
  });
});
