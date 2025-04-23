import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useTimerStore } from "../../stores/timerStore";
import { supabase } from "../../supabase/client";

const { width, height } = Dimensions.get("window");

// 캐릭터 상태 타입 정의
type CharacterState = "normal" | "pooping" | "success" | "fail";

export const CharacterBox = () => {
  // resultState 직접 구독 추가
  const { isRunning, buttonState, resultState, setResultState } =
    useTimerStore();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [characterState, setCharacterState] =
    useState<CharacterState>("normal");
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<
    Record<CharacterState, string | null>
  >({
    normal: null,
    pooping: null,
    success: null,
    fail: null,
  });

  // 이미지 URL 로드
  useEffect(() => {
    loadImageUrls();
  }, []);

  // 상태 변경 감지
  useEffect(() => {
    if (resultState === "success") {
      setCharacterState("success");
    } else if (resultState === "fail") {
      setCharacterState("fail");
    } else if (isRunning) {
      setCharacterState("pooping");
    } else {
      setCharacterState("normal");
    }
  }, [isRunning, resultState, buttonState]);

  // 이미지 URL 로드 함수
  const loadImageUrls = async () => {
    setIsLoading(true);
    try {
      const states: CharacterState[] = ["normal", "pooping", "success", "fail"];
      const urls: Record<CharacterState, string | null> = {
        normal: null,
        pooping: null,
        success: null,
        fail: null,
      };

      for (const state of states) {
        const { data } = await supabase.storage
          .from("images")
          .getPublicUrl(`basic/${state}.png`);

        if (data && data.publicUrl) {
          urls[state] = data.publicUrl;
        }
      }

      setImageUrls(urls);
    } catch (error) {
      // 오류 처리는 유지
    } finally {
      setIsLoading(false);
    }
  };

  // 펄스 애니메이션
  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isRunning]);

  // 캐릭터 클릭 핸들러
  const handleCharacterPress = () => {
    if (isRunning) {
      return;
    }

    setResultState(null);
    setCharacterState("normal");
  };

  return (
    <TouchableOpacity
      activeOpacity={isRunning ? 1 : 0.6}
      onPress={handleCharacterPress}
      disabled={isRunning}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#636B2F" />
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={imageUrls[characterState] || ""}
              style={styles.image}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={300}
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "transparent",
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 15,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
