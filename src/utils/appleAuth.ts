import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../supabase/client";
import Constants from "expo-constants";
import { Alert } from "react-native";

export interface AppleAuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}

// 현재 실행 환경에 따라 올바른 Bundle ID 반환
function getCurrentBundleId(): string {
  // Expo Go에서 실행 중인지 확인
  if (Constants.appOwnership === "expo") {
    return "host.exp.Exponent"; // Expo Go Bundle ID
  }

  // 실제 앱 Bundle ID
  return "com.chad.ohmypoop";
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
    // 함수 실행 확인용 Alert
    Alert.alert("테스트", "Apple 로그인 함수 시작됨");

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
    console.log(`현재 환경: ${Constants.appOwnership}`);
    console.log(`실행 모드: ${__DEV__ ? "Development" : "Production"}`);

    // identityToken 검증
    if (!credential.identityToken) {
      return {
        success: false,
        error: "Apple 인증 토큰을 받을 수 없습니다.",
      };
    }

    // Supabase에 Apple ID 토큰 전달 (동적 Bundle ID 사용)
    const currentBundleId = getCurrentBundleId();
    console.log(`사용 중인 Bundle ID: ${currentBundleId}`);
    console.log(`토큰 길이: ${credential.identityToken.length}`);

    // 디버깅용 Alert (모든 환경)
    Alert.alert(
      "디버그 정보",
      `환경: ${Constants.appOwnership}\n` +
        `Bundle ID: ${currentBundleId}\n` +
        `토큰 길이: ${credential.identityToken.length}`,
      [{ text: "확인", onPress: () => {} }]
    );

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
      nonce: undefined, // Bundle ID 사용 시 nonce 비활성화
    });

    if (error) {
      // 상세 에러 Alert (모든 환경)
      Alert.alert(
        "Supabase 에러 상세",
        `에러 메시지: ${error.message}\n` +
          `에러 코드: ${error.status || "N/A"}\n` +
          `Bundle ID: ${currentBundleId}`,
        [{ text: "확인" }]
      );
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
