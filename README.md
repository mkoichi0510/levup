# Levup

Life Game RPG のiOSネイティブアプリ版。毎日の行動を記録してキャラクターを育てる習慣管理アプリ。

## 技術スタック

- **フレームワーク**: Expo (React Native, managed workflow)
- **言語**: TypeScript
- **バックエンド**: Life Game RPG API (Next.js)
- **ビルド/配布**: EAS Build + TestFlight

詳細は [docs/mobile-tech-decision.md](./docs/mobile-tech-decision.md) を参照。

## セットアップ

### 前提条件

- Node.js 20+
- pnpm or npm
- Expo Go アプリ（実機確認用）

### インストール

```bash
cd levup
npm install
```

### 開発サーバー起動

```bash
npm start
```

QRコードをスキャンして Expo Go で確認できる。

### iOS シミュレーター

```bash
npm run ios
```

Xcode と iOS Simulator が必要。

## ディレクトリ構成

```
levup/
├── App.tsx          # エントリーポイント
├── app.json         # Expoアプリ設定
├── assets/          # 画像・フォントなどの静的アセット
├── docs/            # 設計ドキュメント
│   └── mobile-tech-decision.md
└── tsconfig.json
```

## 関連リポジトリ

- [life-game-rpg](https://github.com/mkoichi0510/life-game-rpg): WebアプリとAPIサーバー
