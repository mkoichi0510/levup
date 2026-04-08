import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { githubClientId, googleClientId } from "../src/config/env";
import { exchangeGitHubCode, exchangeGoogleIdToken } from "../src/api/auth";
import { useAuth } from "../src/context/auth";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  iosClientId: googleClientId,
});

const GITHUB_REDIRECT_URI = makeRedirectUri({ scheme: "levup" });

const GITHUB_DISCOVERY = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
};

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);

  const [githubRequest, githubResponse, promptGitHub] = useAuthRequest(
    {
      clientId: githubClientId,
      scopes: ["user:email"],
      redirectUri: GITHUB_REDIRECT_URI,
    },
    GITHUB_DISCOVERY
  );

  useEffect(() => {
    if (githubResponse?.type !== "success") return;
    const code = githubResponse.params.code;
    if (!code) return;

    setIsExchanging(true);
    setAuthError(null);
    exchangeGitHubCode(code, GITHUB_REDIRECT_URI, githubRequest?.codeVerifier)
      .then((token) => signIn(token))
      .then(() => router.replace("/"))
      .catch((e) => {
        console.error("[signin] GitHub auth failed:", e);
        setAuthError("サインインに失敗しました。もう一度お試しください。");
      })
      .finally(() => setIsExchanging(false));
  }, [githubResponse, signIn, router, githubRequest]);

  async function handleGoogleSignIn() {
    setAuthError(null);
    setIsExchanging(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      if (!data?.idToken) {
        throw new Error("ID token not returned");
      }
      const token = await exchangeGoogleIdToken(data.idToken);
      await signIn(token);
      router.replace("/");
    } catch (e) {
      console.error("[signin] Google auth failed:", e);
      setAuthError("サインインに失敗しました。もう一度お試しください。");
    } finally {
      setIsExchanging(false);
    }
  }

  const isLoading = !githubRequest || isExchanging;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>levup</Text>
        <Text style={styles.subtitle}>ゲームで毎日を記録しよう</Text>

        {authError && <Text style={styles.errorText}>{authError}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={() => {
            setAuthError(null);
            promptGitHub();
          }}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="GitHubでサインイン"
        >
          {isExchanging ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>GitHub でサインイン</Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonGoogle,
            pressed && styles.buttonPressed,
            isExchanging && styles.buttonDisabled,
          ]}
          onPress={handleGoogleSignIn}
          disabled={isExchanging}
          accessibilityRole="button"
          accessibilityLabel="Googleでサインイン"
        >
          {isExchanging ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Google でサインイン</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#6d28d9",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#24292e",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGoogle: {
    backgroundColor: "#4285F4",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
  },
});
