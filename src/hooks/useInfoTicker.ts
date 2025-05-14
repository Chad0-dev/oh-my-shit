import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useTimerStore } from "../stores/timerStore";
import { constipationInfos } from "../data/constipationInfo";
import { getRandomIndex } from "../utils/randomUtils";
import { useAnimatedTicker } from "./useAnimatedTicker";
import { useAuthStore } from "../stores/authStore";

export const useInfoTicker = (width: number) => {
  const { isRunning, resetSignal } = useTimerStore();
  const { user } = useAuthStore();
  const [currentInfo, setCurrentInfo] = useState("");
  const appState = useRef(AppState.currentState);

  // 상태 관리용 ref
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(isRunning);
  const usedIndicesRef = useRef<number[]>([]);
  const currentIndexRef = useRef(-1);
  const isMountedRef = useRef(true);
  const isVisibleRef = useRef(true); // 컴포넌트 가시성을 추적하는 새 ref

  // 애니메이션 훅 사용
  const { translateX, opacity, startAnimation, resetAnimation } =
    useAnimatedTicker({
      width,
      isRunning, // ref 대신 실제 값을 전달
      isMounted: isMountedRef.current,
      onAnimationComplete: () => {
        if (isRunningRef.current && isMountedRef.current) {
          timeoutRef.current = setTimeout(() => {
            selectNextInfo();
            startAnimation();
          }, 500);
        }
      },
    });

  // 클린업 함수
  const cleanupTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 다음 표시할 정보 선택
  const selectNextInfo = () => {
    // 이미 언마운트되었거나 타이머가 중지되었다면 아무것도 하지 않음
    if (!isMountedRef.current || !isRunningRef.current) {
      return;
    }

    // 모든 문장이 사용되었다면 초기화하고 다시 사용
    if (usedIndicesRef.current.length >= constipationInfos.length) {
      usedIndicesRef.current = [];
    }

    // 새 인덱스 선택
    const nextIndex = getRandomIndex(
      constipationInfos.length,
      usedIndicesRef.current
    );
    currentIndexRef.current = nextIndex;
    usedIndicesRef.current.push(nextIndex);

    // 문구 설정
    const nextInfo = constipationInfos[nextIndex];
    setCurrentInfo(nextInfo);
  };

  // 정보 순환 시작
  const startInfoCycle = () => {
    if (!isRunningRef.current || !isMountedRef.current) return;

    // 애니메이션 준비
    cleanupTimeouts();
    resetAnimation();

    // 이전에 선택된 정보가 있는지 확인
    const hasExistingInfo = currentInfo && currentInfo.length > 0;

    // 정보 선택 (이전 정보가 없을 때만)
    if (!hasExistingInfo) {
      // 첫 번째 정보 선택
      const firstIndex = getRandomIndex(constipationInfos.length);
      currentIndexRef.current = firstIndex;
      usedIndicesRef.current = [firstIndex];
      const info = constipationInfos[firstIndex];

      // 상태 업데이트 후 애니메이션 시작
      setCurrentInfo(info);

      // 새로운 정보가 설정되었으므로 짧은 지연 후 애니메이션 시작
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && isRunningRef.current) {
          startAnimation();
        }
      }, 100);
    } else {
      // 이미 정보가 있다면 바로 애니메이션 시작
      startAnimation();
    }
  };

  // 가시성 변경 시 InfoTicker 재시작 함수
  const handleVisibilityChange = (isVisible: boolean) => {
    isVisibleRef.current = isVisible;

    if (isVisible && isRunningRef.current && isMountedRef.current) {
      resetAnimation();

      // 정보가 없는 경우 새로 선택
      if (!currentInfo) {
        selectNextInfo();
      }

      // 짧은 지연 후 애니메이션 재시작
      setTimeout(() => {
        if (isRunningRef.current && isMountedRef.current) {
          startAnimation();
        }
      }, 50);
    }
  };

  // 컴포넌트 마운트/언마운트 감지
  useEffect(() => {
    isMountedRef.current = true;
    isVisibleRef.current = true;

    // 이미 타이머가 실행 중이면 InfoTicker 시작
    if (isRunning) {
      startInfoCycle();
    }

    return () => {
      isMountedRef.current = false;
      cleanupTimeouts();
    };
  }, []);

  // 포커스 효과를 위한 useEffect 추가
  useEffect(() => {
    // 컴포넌트가 다시 렌더링될 때마다 가시성 변경 핸들러 호출
    // 이는 페이지 간 이동 후 돌아왔을 때 티커를 재시작하는 데 도움이 됩니다
    const timeoutId = setTimeout(() => {
      handleVisibilityChange(true);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // isRunning 값을 ref에 동기화하고 타이머 상태 변경 시 처리
  useEffect(() => {
    const wasRunning = isRunningRef.current;
    isRunningRef.current = isRunning;

    if (isRunning) {
      // 타이머 시작 시 정보 표시
      if (isMountedRef.current) {
        // 상태 업데이트 후 정보 순환 시작
        if (!currentInfo) {
          const firstIndex = getRandomIndex(constipationInfos.length);
          const info = constipationInfos[firstIndex];
          setCurrentInfo(info);
        }

        // 애니메이션 시작
        startInfoCycle();
      }
    } else {
      // 타이머 중지 시 애니메이션 리셋 및 기본 상태로 복귀
      resetAnimation();
      setCurrentInfo("");
    }

    // isRunning이 변경될 때마다 가시성 재설정 (페이지 이동 후 돌아왔을 때도 동작)
    if (isRunning && !wasRunning) {
      handleVisibilityChange(true);
    }
  }, [isRunning, currentInfo]);

  // 앱 상태 변경 감지 (백그라운드 <-> 포그라운드)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isRunningRef.current &&
        isMountedRef.current
      ) {
        // 백그라운드에서 포그라운드로 돌아왔을 때 애니메이션 재시작
        handleVisibilityChange(true);
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // 앱이 백그라운드로 갈 때 애니메이션 정리
        resetAnimation();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // resetSignal에 반응
  useEffect(() => {
    if (resetSignal) {
      resetAnimation();
      setCurrentInfo("");
      usedIndicesRef.current = [];
      currentIndexRef.current = -1;
    }
  }, [resetSignal]);

  return {
    currentInfo: currentInfo || "", // 빈 문자열로 수정 (InfoTicker에서 statusInfo로 대체)
    translateX,
    opacity,
    isRunning,
  };
};
