// テスト環境では env を固定してモジュールロード時の warn を抑制
process.env.EXPO_PUBLIC_API_BASE_URL = "http://localhost:3001";
process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID = "test-client-id";
