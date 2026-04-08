import { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";
import { githubClientId } from "../src/config/env";
import { exchangeGitHubCode } from "../src/api/auth";
import { useAuth } from "../src/context/auth";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = makeRedirectUri({ scheme: "levup" });

const GITHUB_DISCOVERY = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
};

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubClientId,
      scopes: ["user:email"],
      redirectUri: REDIRECT_URI,
    },
    GITHUB_DISCOVERY
  );

  useEffect(() => {
    if (response?.type !== "success") return;
    const code = response.params.code;
    if (!code) return;

    setIsExchanging(true);
    setAuthError(null);
    exchangeGitHubCode(code, REDIRECT_URI, request?.codeVerifier)
      .then((token) => signIn(token))
      .then(() => router.replace("/"))
      .catch(() => setAuthError("サインインに失敗しました。もう一度お試しください。"))
      .finally(() => setIsExchanging(false));
  }, [response]);

  const isLoading = !request || isExchanging;

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
            promptAsync();
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
