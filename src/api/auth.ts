import { apiBaseUrl } from "../config/env";

export async function exchangeGitHubCode(
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<string> {
  const res = await fetch(`${apiBaseUrl}/auth/github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirectUri, ...(codeVerifier ? { codeVerifier } : {}) }),
  });
  if (!res.ok) {
    throw new Error(`GitHub auth failed: ${res.status}`);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}
