import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../supabase/client";

export interface AppleAuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}

// Apple ID 로그인 가능 여부 확인
export async function isAppleAuthAvailable(): Promise<boolean> {
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.error("Apple 인증 가용성 확인 실패:", error);
    return false;
  }
}

// Apple ID 로그인 실행
export async function signInWithApple(): Promise<AppleAuthResult> {
  try {
    const available = await isAppleAuthAvailable();

    if (!available) {
      return {
        success: false,
        error:
          "Apple ID 로그인을 사용할 수 없습니다. iOS 13+ 기기에서만 지원됩니다.",
      };
    }

    // Apple 인증 요청
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // 보안을 위해 민감한 정보는 로그에 출력하지 않음
    console.log("Apple 인증 성공 - 토큰 검증 중...");

    // identityToken 검증
    if (!credential.identityToken) {
      return {
        success: false,
        error: "Apple 인증 토큰을 받을 수 없습니다.",
      };
    }

    // Supabase에 Apple ID 토큰 전달 (Bundle ID 사용)
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
      nonce: undefined, // Bundle ID 사용 시 nonce 비활성화
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
    console.error("Apple ID 로그인 실패:", error);

    let errorMessage = "로그인에 실패했습니다.";

    if (error.code === "ERR_REQUEST_CANCELED") {
      errorMessage = "사용자가 로그인을 취소했습니다.";
    } else if (error.code === "ERR_INVALID_RESPONSE") {
      errorMessage = "유효하지 않은 응답입니다. 다시 시도해주세요.";
    } else if (error.message?.includes("Unacceptable audience")) {
      errorMessage =
        "Apple 로그인 설정에 문제가 있습니다. 잠시 후 다시 시도해주세요.";
    } else if (
      error.message?.includes("Provider") &&
      error.message?.includes("not enabled")
    ) {
      errorMessage = "Apple 로그인이 현재 비활성화되어 있습니다.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Apple ID 로그아웃 (Supabase 세션 종료)
export async function signOutApple(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
}
