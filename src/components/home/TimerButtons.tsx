import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTimerStore } from "../../stores/timerStore";
import { useAuthStore } from "../../stores/authStore";
import { ReadingModal } from "../../modals/ReadingModal";
import { ResultModal } from "../../modals/ResultModal";
import { SuccessDetailModal } from "../../modals/SuccessDetailModal";
import { useModalManager } from "../../hooks/useModalManager";
import { AmountType } from "../../services/recordService";

export const TimerButtons = () => {
  const {
    startTimer,
    stopTimer,
    resetTimer,
    isRunning,
    toggleResetSignal,
    resetSignal,
    buttonState,
    setButtonState,
    addTime,
    resetTotalTime,
    timerComplete,
    setTimerComplete,
    saveRecord,
    recordSaving,
    recordError,
    clearRecordError,
    setResultState,
  } = useTimerStore();

  const { user } = useAuthStore();

  const {
    isReadingModalVisible,
    isResultModalVisible,
    isSuccessDetailModalVisible,
    showReadingModal,
    showResultModal,
    showSuccessDetailModal,
    hideAllModals,
    isSubmittingResult,
    handleResultSubmit,
    handleSuccessDetailSubmit,
  } = useModalManager();

  // 타이머 완료 상태 감지
  useEffect(() => {
    if (timerComplete) {
      // 타이머가 완료되었을 때 자동으로 결과 입력 모달 표시
      showResultModal();
      // 타이머 중지
      stopTimer();
      // 완료 상태 초기화
      setTimerComplete(false);
    }
  }, [timerComplete]);

  // 기록 에러 감지
  useEffect(() => {
    if (recordError) {
      Alert.alert("저장 실패", recordError, [
        { text: "확인", onPress: clearRecordError },
      ]);
    }
  }, [recordError]);

  // 버튼 핸들러
  const handlePlayPress = () => {
    if (buttonState === "play") {
      // 타이머 시작 및 상태 업데이트는 순차적으로
      startTimer();
      // 버튼 상태 업데이트
      setButtonState("plus");
    } else if (buttonState === "plus") {
      // 3분(180초) 추가
      addTime(180);
      setButtonState("slash");
    }
    // slash 상태에서는 아무 동작 안함
  };

  // 성공 처리
  const handleSuccessPress = () => {
    if (!user) {
      Alert.alert("로그인 필요", "결과를 저장하려면 로그인이 필요합니다.");
      return;
    }

    // 결과 상태 설정
    setResultState("success");

    // 결과 모달 닫고 세부사항 모달 표시
    handleResultSubmit(() => {
      showSuccessDetailModal();
    });
  };

  // 실패 처리
  const handleFailurePress = () => {
    if (!user) {
      Alert.alert("로그인 필요", "결과를 저장하려면 로그인이 필요합니다.");
      return;
    }

    // 결과 상태 설정
    setResultState("fail");

    // 모달을 확실히 닫고 결과 처리
    hideAllModals();

    // 약간의 지연 후에 결과 제출 처리 (모달이 완전히 닫힌 후)
    setTimeout(() => {
      processResultSubmit(false);
    }, 100);
  };

  // 세부 정보 저장 처리
  const handleDetailSubmit = (amount: AmountType, memo: string) => {
    // handleSuccessDetailSubmit 함수를 사용하지 않고 직접 처리
    hideAllModals(); // 먼저 모든 모달을 확실히 닫습니다

    // 약간의 지연 후에 결과 제출 처리 (모달이 완전히 닫힌 후)
    setTimeout(() => {
      processResultSubmit(true, amount, memo);
    }, 100);
  };

  // 결과 제출 처리
  const processResultSubmit = async (
    success: boolean,
    amount?: AmountType,
    memo?: string
  ) => {
    if (!user) {
      Alert.alert("로그인 필요", "결과를 저장하려면 로그인이 필요합니다.");
      return;
    }

    // 결과 저장
    const savedSuccessfully = await saveRecord(user.id, success, amount, memo);

    if (savedSuccessfully) {
      // 타이머는 리셋하되 resultState는 유지
      setButtonState("play");
      resetTotalTime();

      // 다른 필요한 상태들 초기화 (resultState 제외)
      useTimerStore.setState({
        isRunning: false,
        elapsed: 0,
        startTime: null,
        timerComplete: false,
      });

      // 전체 UI 리렌더링을 위한 신호 발생
      toggleResetSignal();
    }
  };

  // 버튼 아이콘 선택
  const getPlayButtonIcon = () => {
    switch (buttonState) {
      case "play":
        return <Ionicons name="play" size={28} color="#636B2F" />;
      case "plus":
        return <Ionicons name="add" size={28} color="#636B2F" />;
      case "slash":
        return <Ionicons name="remove" size={28} color="#EF4444" />;
      default:
        return <Ionicons name="play" size={28} color="#636B2F" />;
    }
  };

  return (
    <View
      key={resetSignal ? "reset-true" : "reset-false"}
      style={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.button,
          buttonState === "slash" ? styles.disabledButton : null,
        ]}
        onPress={handlePlayPress}
        disabled={buttonState === "slash"}
      >
        {getPlayButtonIcon()}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={showReadingModal}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={showResultModal}>
        <MaterialCommunityIcons
          name="pencil-box-multiple"
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>

      {/* 모달 */}
      <ReadingModal visible={isReadingModalVisible} onClose={hideAllModals} />
      <ResultModal
        visible={isResultModalVisible}
        onClose={hideAllModals}
        onSuccess={handleSuccessPress}
        onFailure={handleFailurePress}
      />
      <SuccessDetailModal
        visible={isSuccessDetailModalVisible}
        onClose={hideAllModals}
        onSubmit={handleDetailSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginVertical: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
