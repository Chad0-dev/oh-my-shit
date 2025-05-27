import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  checkBiometricAvailability,
  authenticateWithBiometric,
} from "../../utils/biometricAuth";
import * as LocalAuthentication from "expo-local-authentication";

export const BiometricDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  const checkStatus = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const { isAvailable, biometricType } = await checkBiometricAvailability();

      setDebugInfo({
        hasHardware,
        isEnrolled,
        supportedTypes,
        isAvailable,
        biometricType,
      });
    } catch (error: any) {
      setDebugInfo({ error: error.message });
    }
  };

  const testAuth = async () => {
    const result = await authenticateWithBiometric();
    setDebugInfo((prev: any) => ({ ...prev, lastAuthResult: result }));
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>생체인증 디버그 정보</Text>

      <Text style={styles.label}>하드웨어 지원:</Text>
      <Text style={styles.value}>
        {debugInfo.hasHardware ? "✅ 지원" : "❌ 미지원"}
      </Text>

      <Text style={styles.label}>생체인증 등록:</Text>
      <Text style={styles.value}>
        {debugInfo.isEnrolled ? "✅ 등록됨" : "❌ 미등록"}
      </Text>

      <Text style={styles.label}>지원 타입:</Text>
      <Text style={styles.value}>
        {JSON.stringify(debugInfo.supportedTypes)}
      </Text>

      <Text style={styles.label}>사용 가능:</Text>
      <Text style={styles.value}>
        {debugInfo.isAvailable ? "✅ 가능" : "❌ 불가능"}
      </Text>

      <Text style={styles.label}>인증 타입:</Text>
      <Text style={styles.value}>{debugInfo.biometricType}</Text>

      {debugInfo.lastAuthResult && (
        <>
          <Text style={styles.label}>마지막 인증 결과:</Text>
          <Text style={styles.value}>
            {JSON.stringify(debugInfo.lastAuthResult)}
          </Text>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={checkStatus}>
        <Text style={styles.buttonText}>상태 새로고침</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testAuth}>
        <Text style={styles.buttonText}>생체인증 테스트</Text>
      </TouchableOpacity>

      {debugInfo.error && (
        <Text style={styles.error}>오류: {debugInfo.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginTop: 8,
    fontSize: 14,
  },
});
