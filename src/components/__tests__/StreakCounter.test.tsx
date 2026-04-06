import React from "react";
import { render, screen } from "@testing-library/react-native";
import { StreakCounter } from "../StreakCounter";

describe("StreakCounter", () => {
  it("streak=0 のとき「今日が最初の一歩！」を表示する", () => {
    render(<StreakCounter streak={0} playedToday={false} />);
    expect(screen.getByText("今日が最初の一歩！")).toBeTruthy();
    expect(
      screen.getByText("プレイを記録してストリークを始めよう")
    ).toBeTruthy();
  });

  it("streak>0 かつ playedToday=true のとき連続記録数を表示する", () => {
    render(<StreakCounter streak={7} playedToday={true} />);
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText("今日もクリア！この調子で続けよう")).toBeTruthy();
  });

  it("streak>0 かつ playedToday=false のとき警告を表示する", () => {
    render(<StreakCounter streak={3} playedToday={false} />);
    expect(screen.getByText("今日まだ記録してない！")).toBeTruthy();
    expect(screen.getByText("🔥 3 日連続継続中 → 記録しよう")).toBeTruthy();
  });

  it("streak=1 のとき playedToday=true で「1」を表示する", () => {
    render(<StreakCounter streak={1} playedToday={true} />);
    expect(screen.getByText("1")).toBeTruthy();
  });
});
