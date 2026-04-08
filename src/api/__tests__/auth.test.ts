import { exchangeGitHubCode, exchangeGoogleIdToken } from "../auth";

describe("exchangeGitHubCode", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("POST /auth/github に code と redirectUri を送信しトークンを返す", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ token: "jwt-token-abc", userId: "user-1" }),
    } as Response);

    const token = await exchangeGitHubCode("auth-code-xyz", "levup://");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/github"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify({ code: "auth-code-xyz", redirectUri: "levup://" }),
      })
    );
    expect(token).toBe("jwt-token-abc");
  });

  it("codeVerifier がある場合はボディに含める", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ token: "jwt-token-xyz" }),
    } as Response);

    await exchangeGitHubCode("code", "levup://", "verifier-abc");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ code: "code", redirectUri: "levup://", codeVerifier: "verifier-abc" }),
      })
    );
  });

  it("HTTP エラー時に API error をスロー", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(exchangeGitHubCode("bad-code", "levup://")).rejects.toThrow(
      "API error: 400 /auth/github"
    );
  });

  it("ネットワークエラー時に Network error をスロー", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

    await expect(exchangeGitHubCode("code", "levup://")).rejects.toThrow(
      "Network error: /auth/github"
    );
  });

  it("レスポンスに token フィールドがない場合に token missing エラーをスロー", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ userId: "user-1" }),
    } as Response);

    await expect(exchangeGitHubCode("code", "levup://")).rejects.toThrow(
      "token missing in response: /auth/github"
    );
  });
});

describe("exchangeGoogleIdToken", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("POST /auth/google に idToken を送信しトークンを返す", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ token: "google-jwt-token", userId: "user-2" }),
    } as Response);

    const token = await exchangeGoogleIdToken("google-id-token-xyz");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/google"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify({ idToken: "google-id-token-xyz" }),
      })
    );
    expect(token).toBe("google-jwt-token");
  });

  it("HTTP エラー時に API error をスロー", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await expect(exchangeGoogleIdToken("invalid-token")).rejects.toThrow(
      "API error: 401 /auth/google"
    );
  });

  it("ネットワークエラー時に Network error をスロー", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

    await expect(exchangeGoogleIdToken("token")).rejects.toThrow(
      "Network error: /auth/google"
    );
  });

  it("レスポンスに token フィールドがない場合に token missing エラーをスロー", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ userId: "user-2" }),
    } as Response);

    await expect(exchangeGoogleIdToken("id-token")).rejects.toThrow(
      "token missing in response: /auth/google"
    );
  });
});
