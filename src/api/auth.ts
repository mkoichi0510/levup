import { apiBaseUrl } from "../config/env";

export async function exchangeGitHubCode(
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/auth/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri, ...(codeVerifier ? { codeVerifier } : {}) }),
    });
  } catch (cause) {
    throw new Error("Network error: /auth/github", { cause });
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} /auth/github`);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}
