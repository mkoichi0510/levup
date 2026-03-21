# モバイル技術スタック選定記録

作成日: 2026-03-21

## 背景

Life Game RPG（Webアプリ）のiOSネイティブ版として「Levup」を開発するにあたり、
モバイル開発の技術スタックを選定した。

## 検討した選択肢

| 観点 | Capacitor | Expo (React Native) | ネイティブ Swift |
|------|-----------|---------------------|----------------|
| コード共有 | Web（HTML/CSS/JS）をそのまま流用 | JS/TSのビジネスロジックを共有。UIはネイティブ書き直し | 共有不可 |
| ネイティブUIのクオリティ | WebView上でのレンダリング。iOSらしさが出にくい | React Nativeコンポーネントがネイティブビューに変換される | 最高品質 |
| プッシュ通知 | expo-notifications相当のCapacitorプラグインあり | expo-notificationsで対応 | 標準サポート |
| ウィジェット (iOS) | 非対応 | expo-widgetで試験的サポート | 標準サポート |
| 学習コスト | Web開発の延長。新規学習少ない | React知識を活かせる。RNの差異を学ぶ必要あり | Swift/SwiftUI習得必要 |
| TestFlight配布 | EAS Build経由で可能 | EAS Build経由で可能 | Xcode経由で可能 |
| 開発速度 | 速い（Webコードの流用） | 中程度 | 遅い |
| 長期メンテ | プラグインエコシステムに依存 | Expoエコシステムが充実 | 安定 |

## 決定: Expo (React Native)

### 採用理由

1. **ネイティブUIのクオリティ**: WebViewではなくネイティブビューにマップされるため、スクロールや遷移がiOSらしい挙動になる
2. **プッシュ通知・ウィジェット対応**: `expo-notifications` でプッシュ通知が実装可能。ウィジェットも将来的に対応予定
3. **React知識の活用**: 既存のReact/TypeScriptの知識がそのまま活かせる
4. **EAS Build**: クラウドビルド→TestFlight配布の自動化が容易
5. **エコシステム**: Expoのmanaged workflowで依存管理・ビルド設定を抽象化できる

### トレードオフ

- WebアプリのUIコード（Tailwind CSS / shadcn/ui）はそのまま流用できないため、モバイル向けに再実装が必要
- ビジネスロジック（API呼び出し、ストリーク計算など）はTypeScriptで共有可能

## 技術スタック

| カテゴリ | 採用技術 |
|---------|---------|
| フレームワーク | Expo (managed workflow) |
| 言語 | TypeScript |
| ナビゲーション | Expo Router (file-based) |
| API通信 | fetch / React Query |
| スタイリング | NativeWind (Tailwind for RN) または StyleSheet |
| プッシュ通知 | expo-notifications |
| ビルド/配布 | EAS Build + TestFlight |

## 関連Issue

- LIF-12: iOS技術スタック選定・リポジトリ作成
- LIF-13: Apple Developer Program登録
- LIF-14: TestFlight調査
