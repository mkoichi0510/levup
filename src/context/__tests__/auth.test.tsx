import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { AuthProvider, useAuth } from "../auth";

jest.mock("expo-secure-store");
const mockGetItemAsync = SecureStore.getItemAsync as jest.Mock;
const mockSetItemAsync = SecureStore.setItemAsync as jest.Mock;
const mockDeleteItemAsync = SecureStore.deleteItemAsync as jest.Mock;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetItemAsync.mockResolvedValue(null);
    mockSetItemAsync.mockResolvedValue(undefined);
    mockDeleteItemAsync.mockResolvedValue(undefined);
  });

  it("初期ロード時に SecureStore からトークンを読み込む", async () => {
    mockGetItemAsync.mockResolvedValue("existing-jwt");

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await act(async () => {});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.token).toBe("existing-jwt");
    expect(mockGetItemAsync).toHaveBeenCalledWith("jwt");
  });

  it("トークンがない場合は token が null", async () => {
    mockGetItemAsync.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(result.current.token).toBeNull();
  });

  it("signIn が SecureStore の jwt キーに保存する", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    await act(async () => {
      await result.current.signIn("new-jwt-token");
    });

    expect(mockSetItemAsync).toHaveBeenCalledWith("jwt", "new-jwt-token");
    expect(result.current.token).toBe("new-jwt-token");
  });

  it("signOut が SecureStore から jwt を削除する", async () => {
    mockGetItemAsync.mockResolvedValue("some-token");

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockDeleteItemAsync).toHaveBeenCalledWith("jwt");
    expect(result.current.token).toBeNull();
  });
});
