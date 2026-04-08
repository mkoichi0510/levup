export type StreakResponse = {
  streak: number;
  playedToday: boolean;
};

export type Category = {
  id: string;
  name: string;
  visible: boolean;
};

export type CategoriesResponse = {
  categories: Category[];
};

export type CategoryResult = {
  categoryId: string;
  playCount: number;
  xpEarned: number;
};

export type DailyResultResponse = {
  dailyResult: {
    status: string;
  };
  categoryResults: CategoryResult[];
};
