import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTimerStore } from "../../stores/timerStore";
import { supabase } from "../../supabase/client";

const { width, height } = Dimensions.get("window");

// 캐릭터 상태 타입 정의
type CharacterState = "normal" | "pooping";

export const CharacterBox = () => {
  const { isRunning } = useTimerStore();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [characterState, setCharacterState] =
    useState<CharacterState>("normal");
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<
    Record<CharacterState, string | null>
  >({
    normal: null,
    pooping: null,
  });

  // 이미지 URL 로드
  useEffect(() => {
    loadImageUrls();
  }, []);

  // 타이머 상태에 따라 캐릭터 상태 변경
  useEffect(() => {
    if (isRunning) {
      setCharacterState("pooping");
    } else {
      setCharacterState("normal");
    }
  }, [isRunning]);

  // 이미지 URL 로드 함수
  const loadImageUrls = async () => {
    setIsLoading(true);
    try {
      const states: CharacterState[] = ["normal", "pooping"];
      const urls: Record<CharacterState, string | null> = {
        normal: null,
        pooping: null,
      };

      // 각 상태별 이미지 URL 가져오기
      for (const state of states) {
        const { data } = await supabase.storage
          .from("images")
          .getPublicUrl(`basic/${state}.png`);

        if (data && data.publicUrl) {
          urls[state] = data.publicUrl;
          console.log(`이미지 URL 로드 성공: ${state} - ${data.publicUrl}`);
        }
      }

      setImageUrls(urls);
    } catch (error) {
      console.error("이미지 URL 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 펄스 애니메이션
  React.useEffect(() => {
    if (isRunning) {
      // 타이머가 실행 중일 때 약간의 펄스 애니메이션 적용
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
      // 타이머가 중지되면 애니메이션 중지
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isRunning]);

  return (
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
            source={{ uri: imageUrls[characterState] || "" }}
            style={styles.image}
            resizeMode="contain"
            defaultSource={require("../../../assets/images/pooping-cat.png")} // 로드 실패 시 기본 이미지
          />
        </View>
      )}
    </Animated.View>
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
