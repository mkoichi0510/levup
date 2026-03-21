# TestFlight ベータ配布ガイド

作成日: 2026-03-21
対象: Expo (EAS Build) + TestFlight

## 1. TestFlight の仕組み

### 内部テスター (Internal Testers)

| 項目 | 内容 |
|------|------|
| 上限人数 | **最大100名** |
| 条件 | App Store Connect のチームメンバーであること |
| 審査 | **不要** — ビルドをアサインすると即座にテスト可能 |
| 用途 | 開発者自身・チーム内の動作確認 |

### 外部テスター (External Testers)

| 項目 | 内容 |
|------|------|
| 上限人数 | **最大10,000名** |
| 条件 | Apple ID があれば誰でも可（メール or 公開リンクで招待） |
| 審査 | **初回ビルドのみ** TestFlight App Review が必要（App Store審査より軽量） |
| 有効期限 | ビルドは **90日間** テスト可能 |

> **まず自分1人でテストする場合**: 内部テスターとして登録 → 審査不要で即日テスト可能

---

## 2. Apple Developer Program は必須か

**必須。**

TestFlight を使うには **Apple Developer Program（年間$99）** への加入が必要。

- App Store Connect へのアクセス自体が有料メンバーシップ限定
- TestFlight は $99 の中に含まれる機能（追加費用なし）
- 無料の Apple ID のみではビルドのアップロード・配布はできない

→ LIF-13（Apple Developer Program登録）が前提条件

---

## 3. EAS Build 無料プランでできること

| 項目 | 無料プラン |
|------|-----------|
| iOSビルド数 | **月15回** |
| ビルドタイムアウト | 45分 |
| キュー優先度 | 低（混雑時は待ち時間あり） |
| TestFlightへの提出 | **可能** |
| 同時ビルド数 | 1並列 |

月15回は個人開発には十分。TestFlightへの提出も無料プランで対応可能。

---

## 4. 初回ビルドから自分のiPhoneで開くまでの手順

### 事前準備（初回のみ）

1. **Apple Developer Program 加入** ($99/年)
   https://developer.apple.com/programs/

2. **Expo アカウント作成**（無料）
   https://expo.dev/signup

3. **EAS CLI インストール**
   ```bash
   npm install -g eas-cli
   eas login
   ```

### プロジェクト設定（初回のみ）

```bash
cd levup
eas build:configure
```

`app.json` に Bundle Identifier を追加:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourname.levup"
    }
  }
}
```

### ビルド & TestFlight アップロード

**方法A: ワンコマンド（推奨）**
```bash
npx testflight
```
認証・ビルド・アップロードまで全自動。初回はApple IDの認証が求められる。

**方法B: ステップ別**
```bash
# ビルドのみ
eas build --platform ios

# TestFlight にアップロード
eas submit --platform ios

# またはビルド+アップロードを一括で
eas build --platform ios --auto-submit
```

### App Store Connect での設定（初回のみ）

1. https://appstoreconnect.apple.com にログイン
2. 「TestFlight」タブ → ビルドの処理完了を確認（数分〜1時間）
3. 「Internal Testers」グループに自分のApple IDを追加

### iPhoneでの操作

1. iPhone に「TestFlight」アプリをインストール（App Storeで無料）
2. 招待メールを受信 → 「TestFlight で開く」をタップ
3. アプリをインストール → テスト開始

---

## 5. 所要時間の目安（初回）

| フェーズ | 所要時間 |
|---------|---------|
| Apple Developer 加入・審査 | 数時間〜数日 |
| EAS Build 実行（無料プラン） | 10〜30分（キュー待ち含む） |
| TestFlight 処理完了 | 数分〜1時間 |
| **合計（手続き除く）** | **1〜2時間程度** |

---

## 6. Levup プロジェクトでの確認事項

- [x] 技術スタック（Expo）はTestFlight配布に対応 ✅
- [ ] `app.json` に `bundleIdentifier` を設定する
- [ ] Apple Developer Program 加入後に EAS Build を実行する
- [ ] App Store Connect でアプリを新規作成する

---

## 参考リンク

- [TestFlight Overview - Apple](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)
- [EAS Submit - Expo Docs](https://docs.expo.dev/submit/introduction/)
- [npx testflight - Expo Docs](https://docs.expo.dev/build-reference/npx-testflight/)
- [EAS Build Setup - Expo Docs](https://docs.expo.dev/build/setup/)
- [EAS Billing Plans - Expo Docs](https://docs.expo.dev/billing/plans/)
