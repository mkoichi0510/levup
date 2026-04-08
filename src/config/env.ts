export const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

if (__DEV__ && !process.env.EXPO_PUBLIC_API_BASE_URL) {
  console.warn(
    "[config/env] EXPO_PUBLIC_API_BASE_URL is not set. " +
      "Falling back to localhost:3001 — this will fail on a physical device."
  );
}

export const githubClientId =
  process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? "";

if (__DEV__ && !process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID) {
  console.warn(
    "[config/env] EXPO_PUBLIC_GITHUB_CLIENT_ID is not set. GitHub OAuth will fail."
  );
}

export const googleClientId =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "";

if (__DEV__ && !process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
  console.warn(
    "[config/env] EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set. Google OAuth will fail."
  );
}
