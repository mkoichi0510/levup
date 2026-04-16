import { apiBaseUrl } from "../config/env";

/** AbortSignal.timeout はHermesで動作しない場合がある。AbortController + setTimeout を使う */
function makeTimeoutSignal(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

export async function exchangeGitHubCode(
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<string> {
  const { signal, clear } = makeTimeoutSignal(15000);
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/auth/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri, ...(codeVerifier ? { codeVerifier } : {}) }),
      signal,
    });
  } catch (cause) {
    throw new Error("Network error: /auth/github", { cause });
  } finally {
    clear();
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} /auth/github`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data?.token) {
    throw new Error("token missing in response: /auth/github");
  }
  return data.token;
}

export async function exchangeGoogleIdToken(idToken: string): Promise<string> {
  const { signal, clear } = makeTimeoutSignal(15000);
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      signal,
    });
  } catch (cause) {
    throw new Error("Network error: /auth/google", { cause });
  } finally {
    clear();
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} /auth/google`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data?.token) {
    throw new Error("token missing in response: /auth/google");
  }
  return data.token;
}
