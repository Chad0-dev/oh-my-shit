import { useRef, useEffect } from "react";
import { Animated } from "react-native";

interface UseAnimatedTickerProps {
  width: number;
  isRunning: boolean;
  isMounted: boolean;
  onAnimationComplete: () => void;
}

export const useAnimatedTicker = ({
  width,
  isRunning,
  isMounted,
  onAnimationComplete,
}: UseAnimatedTickerProps) => {
  // 애니메이션 값
  const translateX = useRef(new Animated.Value(width)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // 애니메이션 관리용 ref
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // 애니메이션 리셋
  const resetAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // 애니메이션 값 초기화
    translateX.setValue(width);
    opacity.setValue(1);
  };

  // 애니메이션 시작
  const startAnimation = () => {
    if (!isRunning || !isMounted) return;

    // 화면 오른쪽에서 시작
    translateX.setValue(width);
    opacity.setValue(1);

    // 애니메이션 시퀀스 생성
    animationRef.current = Animated.sequence([
      // 1. 오른쪽에서 왼쪽으로 슬라이드
      Animated.timing(translateX, {
        toValue: 10,
        duration: 3000,
        useNativeDriver: true,
      }),

      // 2. 잠시 멈춤
      Animated.delay(2000),

      // 3. 페이드아웃과 함께 왼쪽으로 사라짐
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -width / 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // 애니메이션 시작 및 완료 콜백 설정
    animationRef.current.start(({ finished }) => {
      // 애니메이션이 정상적으로 완료되고 타이머가 실행 중이면 다음 사이클 시작
      if (finished && isRunning && isMounted) {
        onAnimationComplete();
      }
    });
  };

  // isRunning이 변경될 때 애니메이션 상태 감지
  useEffect(() => {
    if (!isRunning) {
      // 타이머가 중지되면 애니메이션도 중지
      resetAnimation();
    }
  }, [isRunning]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, []);

  return {
    translateX,
    opacity,
    startAnimation,
    resetAnimation,
  };
};
