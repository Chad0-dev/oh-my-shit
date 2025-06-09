import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { supabase } from "../supabase/client";
import { Platform } from "react-native";

export interface GoogleAuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}

// Google OAuth 설정
const GOOGLE_CLIENT_ID = {
  // Google Cloud Console에서 생성한 실제 Client ID로 교체하세요
  ios: "922025916834-lih548ncqi7dsmbravuq1h7f8be92qe1.apps.googleusercontent.com", // iOS OAuth 2.0 Client ID
  android: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com", // Android OAuth 2.0 Client ID
  web: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com", // Web OAuth 2.0 Client ID (Supabase용)
};

// 플랫폼별 Client ID 선택
const getClientId = () => {
  if (Platform.OS === "ios") {
    return GOOGLE_CLIENT_ID.ios;
  } else if (Platform.OS === "android") {
    return GOOGLE_CLIENT_ID.android;
  }
  return GOOGLE_CLIENT_ID.web;
};

// Google 로그인 실행
export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  try {
    // PKCE 플로우 설정
    const redirectUri = AuthSession.makeRedirectUri();

    const codeChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString(36),
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    // Google OAuth 요청
    const authRequest = new AuthSession.AuthRequest({
      clientId: getClientId(),
      scopes: ["openid", "email", "profile"],
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      extraParams: {
        code_challenge: codeChallenge,
        code_challenge_method: AuthSession.CodeChallengeMethod.S256,
      },
    });

    const result = await authRequest.promptAsync({
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    });

    if (result.type !== "success") {
      return {
        success: false,
        error: "사용자가 로그인을 취소했습니다.",
      };
    }

    // 인증 코드를 토큰으로 교환
    const tokenResult = await AuthSession.exchangeCodeAsync(
      {
        clientId: getClientId(),
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: codeChallenge,
        },
      },
      {
        tokenEndpoint: "https://oauth2.googleapis.com/token",
      }
    );

    if (!tokenResult.accessToken) {
      return {
        success: false,
        error: "Google 토큰을 받을 수 없습니다.",
      };
    }

    // Supabase에 Google 토큰 전달
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: tokenResult.accessToken,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      return {
        success: false,
        error: "사용자 정보를 가져올 수 없습니다.",
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || "",
      },
    };
  } catch (error: any) {
    console.error("Google 로그인 실패:", error);

    let errorMessage = "로그인에 실패했습니다.";

    if (
      error.message?.includes("Provider") &&
      error.message?.includes("not enabled")
    ) {
      errorMessage = "Google 로그인이 현재 비활성화되어 있습니다.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
