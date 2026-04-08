import { exchangeGitHubCode } from "../auth";

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

  it("HTTP エラー時に GitHub auth failed をスロー", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(exchangeGitHubCode("bad-code", "levup://")).rejects.toThrow(
      "GitHub auth failed: 400"
    );
  });

  it("ネットワークエラー時にエラーをスロー", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(exchangeGitHubCode("code", "levup://")).rejects.toThrow(
      "Network error"
    );
  });
});
