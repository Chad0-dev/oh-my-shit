import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const BIOMETRIC_ENABLED_KEY = "biometric_enabled";
const USER_CREDENTIALS_KEY = "user_credentials";

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export interface StoredCredentials {
  email: string;
  hashedPassword: string;
}

// 비밀번호 해시화 함수
async function hashPassword(password: string): Promise<string> {
  try {
    // SHA-256으로 해시화 (실제 프로덕션에서는 더 강력한 해시 함수 사용 권장)
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + "salt_key_for_biometric" // 솔트 추가
    );
    return hashedPassword;
  } catch (error) {
    console.error("비밀번호 해시화 실패:", error);
    return password; // 해시화 실패 시 원본 반환 (임시)
  }
}

// 생체인증 하드웨어 및 등록 상태 확인
export async function checkBiometricAvailability(): Promise<{
  isAvailable: boolean;
  biometricType: string;
}> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType = "none";
    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      biometricType = "Face ID";
    } else if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      biometricType = "Touch ID";
    }

    return {
      isAvailable: hasHardware && isEnrolled,
      biometricType,
    };
  } catch (error) {
    console.error("생체인증 가용성 확인 실패:", error);
    return { isAvailable: false, biometricType: "none" };
  }
}

// 생체인증 실행
export async function authenticateWithBiometric(): Promise<BiometricAuthResult> {
  try {
    const { isAvailable, biometricType } = await checkBiometricAvailability();

    if (!isAvailable) {
      return {
        success: false,
        error:
          "생체인증을 사용할 수 없습니다. 설정에서 Face ID 또는 Touch ID를 활성화해주세요.",
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `${biometricType}로 인증하세요`,
      cancelLabel: "취소",
      fallbackLabel: "비밀번호 사용",
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error:
          result.error === "user_cancel"
            ? "사용자가 취소했습니다."
            : "인증에 실패했습니다.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "생체인증 중 오류가 발생했습니다.",
    };
  }
}

// 생체인증 사용 설정 저장
export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  try {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled.toString());
  } catch (error) {
    console.error("생체인증 설정 저장 실패:", error);
  }
}

// 생체인증 사용 설정 확인
export async function isBiometricEnabled(): Promise<boolean> {
  try {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return enabled === "true";
  } catch (error) {
    console.error("생체인증 설정 확인 실패:", error);
    return false;
  }
}

// 사용자 인증 정보 안전하게 저장 (생체인증 성공 시에만 사용)
export async function storeCredentialsSecurely(
  email: string,
  password: string
): Promise<void> {
  try {
    const credentials: StoredCredentials = {
      email,
      hashedPassword: await hashPassword(password),
    };
    await SecureStore.setItemAsync(
      USER_CREDENTIALS_KEY,
      JSON.stringify(credentials)
    );
  } catch (error) {
    console.error("인증 정보 저장 실패:", error);
  }
}

// 저장된 인증 정보 가져오기
export async function getStoredCredentials(): Promise<StoredCredentials | null> {
  try {
    const credentialsString = await SecureStore.getItemAsync(
      USER_CREDENTIALS_KEY
    );
    if (credentialsString) {
      return JSON.parse(credentialsString);
    }
    return null;
  } catch (error) {
    console.error("인증 정보 가져오기 실패:", error);
    return null;
  }
}

// 저장된 인증 정보 삭제
export async function clearStoredCredentials(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(USER_CREDENTIALS_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  } catch (error) {
    console.error("인증 정보 삭제 실패:", error);
  }
}
