import { useEffect } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { Alert } from "react-native";

export function useDebugAppleAuth() {
  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then((avail) =>
      Alert.alert("AppleAuth available?", String(avail))
    );
  }, []);
}
