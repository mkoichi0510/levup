type CategoryResult = {
  categoryId: string;
  playCount: number;
  xpEarned: number;
};

export function aggregateDailyStats(categoryResults: CategoryResult[]): {
  totalPlays: number;
  totalXp: number;
} {
  return {
    totalPlays: categoryResults.reduce((sum, r) => sum + r.playCount, 0),
    totalXp: categoryResults.reduce((sum, r) => sum + r.xpEarned, 0),
  };
}
