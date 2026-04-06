// 日本標準時（JST = UTC+9）はDSTなし
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function getTodayKey(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + JST_OFFSET_MS);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
