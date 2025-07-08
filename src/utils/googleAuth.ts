import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";
import { supabase } from "../supabase/client";
import Constants from "expo-constants";

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

// Google OAuth Client IDs (나중에 실제 값으로 교체)
const GOOGLE_OAUTH_CONFIG = {
  // iOS Client ID (Google Cloud Console에서 생성된 iOS 전용 ID)
  iosClientId:
    "922025916834-lih548ncqi7dsmbravuq1h7f8be92qe1.apps.googleusercontent.com",
  // Android Client ID (Android 개발시에만 필요)
  androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  // Web Client ID (리디렉트 URI 설정을 위해 사용)
  webClientId:
    "922025916834-v1corvaophnc71q2o8mld514ehj0ofgr.apps.googleusercontent.com",
};

export interface GoogleAuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// 현재 플랫폼에 따라 올바른 Client ID 반환
function getGoogleClientId(): string {
  const { Platform } = require("react-native");

  if (Platform.OS === "ios") {
    // Supabase와 함께 사용하려면 Web Client ID 필요
    return GOOGLE_OAUTH_CONFIG.webClientId;
  } else {
    throw new Error("Google 로그인은 현재 iOS에서만 지원됩니다.");
  }
}

// WebBrowser 설정 (필수)
WebBrowser.maybeCompleteAuthSession();

// 랜덤 문자열 생성
function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Google OAuth 로그인 실행
export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  try {
    // 1. 함수 시작 로그
    console.log("🚀 Google 로그인 시작");

    const clientId = getGoogleClientId();

    // 2. Client ID 확인
    console.log("📋 Client ID:", clientId);

    // 개발 환경에서는 Client ID 설정 확인
    if (clientId.includes("YOUR_")) {
      const errorMsg =
        "Google OAuth Client ID가 설정되지 않았습니다. 개발자에게 문의하세요.";
      console.log("❌ Client ID 오류:", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    // 3. Redirect URI 생성 (iOS 클라이언트 ID용)
    // iOS 클라이언트 ID는 Bundle ID 기반으로 자동 처리되므로 간단한 URI 사용
    const redirectUri = makeRedirectUri({
      scheme: "com.chad.ohmypoop",
    });

    console.log("🔄 생성된 Redirect URI:", redirectUri);

    // 4. PKCE를 위한 코드 베리파이어 생성
    const codeVerifier = generateRandomString(128);

    const codeChallengeRaw = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    // PKCE requires base64url encoding (without padding)
    const codeChallenge = codeChallengeRaw
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    console.log("🔐 PKCE 코드 생성 완료");

    // 5. 인증 URL 생성
    const authUrl = `${discovery.authorizationEndpoint}?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    }).toString()}`;

    console.log("🌐 인증 URL 생성:", authUrl);

    // 6. 브라우저에서 Google OAuth 페이지 열기
    console.log("🌍 브라우저에서 인증 페이지 열기 시도...");

    // iOS 시뮬레이터에서 WebAuthenticationSession 오류 발생 시 대안
    let result;
    try {
      result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri, {
        showInRecents: true,
      });
    } catch (error) {
      console.log("🔄 WebAuthSession 실패, 일반 브라우저로 재시도...");
      // 대안: 일반 브라우저 열기
      await WebBrowser.openBrowserAsync(authUrl);
      return {
        success: false,
        error: "브라우저에서 수동으로 로그인을 완료해주세요.",
      };
    }

    console.log("🔄 브라우저 결과:", result);

    if (result.type !== "success") {
      if (result.type === "cancel") {
        console.log("❌ 사용자가 로그인을 취소했습니다.");
        return {
          success: false,
          error: "사용자가 로그인을 취소했습니다.",
        };
      }
      console.log("❌ Google 인증에 실패했습니다:", result.type);
      return {
        success: false,
        error: "Google 인증에 실패했습니다.",
      };
    }

    // 7. URL에서 인증 코드 추출
    console.log("🔍 결과 URL:", result.url);

    const url = new URL(result.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    console.log("🔑 인증 코드:", code ? "있음" : "없음");
    console.log("❌ 에러:", error);

    if (error) {
      console.log("❌ Google 인증 오류:", error);
      return {
        success: false,
        error: `Google 인증 오류: ${error}`,
      };
    }

    if (!code) {
      console.log("❌ Google에서 인증 코드를 받을 수 없습니다.");
      return {
        success: false,
        error: "Google에서 인증 코드를 받을 수 없습니다.",
      };
    }

    // 8. 인증 코드를 액세스 토큰으로 교환
    console.log("🔄 토큰 교환 시도...");

    const tokenResponse = await fetch(discovery.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: codeVerifier,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    console.log("🔄 토큰 응답 상태:", tokenResponse.status);
    console.log("🔄 토큰 응답 데이터:", tokenData);

    if (!tokenResponse.ok) {
      console.error("❌ 토큰 교환 실패:", tokenData);
      return {
        success: false,
        error: "Google 토큰 교환에 실패했습니다.",
      };
    }

    // 9. ID 토큰 검증 및 사용자 정보 추출
    const { id_token } = tokenData;
    console.log("🎫 ID 토큰:", id_token ? "있음" : "없음");

    if (!id_token) {
      console.log("❌ Google ID 토큰을 받을 수 없습니다.");
      return {
        success: false,
        error: "Google ID 토큰을 받을 수 없습니다.",
      };
    }

    // 10. Supabase에 Google ID 토큰 전달
    console.log("🔄 Supabase 로그인 시도...");

    const { data, error: supabaseError } =
      await supabase.auth.signInWithIdToken({
        provider: "google",
        token: id_token,
      });

    if (supabaseError) {
      console.error("❌ Supabase Google 로그인 실패:", supabaseError);
      throw supabaseError;
    }

    console.log("✅ Supabase 로그인 성공:", data);

    if (!data.user) {
      console.log("❌ 사용자 정보를 가져올 수 없습니다.");
      return {
        success: false,
        error: "사용자 정보를 가져올 수 없습니다.",
      };
    }

    // 11. 최종 결과 반환
    const finalResult = {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || "",
        name:
          data.user.user_metadata?.full_name || data.user.user_metadata?.name,
      },
    };

    console.log("🎉 Google 로그인 완료:", finalResult);

    return finalResult;
  } catch (error: any) {
    console.error("💥 Google 로그인 실패:", error);

    let errorMessage = "Google 로그인에 실패했습니다.";

    if (
      error.message?.includes("Provider") &&
      error.message?.includes("not enabled")
    ) {
      errorMessage = "Google 로그인이 현재 비활성화되어 있습니다.";
    } else if (error.message?.includes("network")) {
      errorMessage = "네트워크 연결을 확인해주세요.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.log("❌ 최종 에러 메시지:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Google 로그아웃 (Supabase 세션 종료)
export async function signOutGoogle(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
}
