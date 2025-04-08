import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTimerStore } from "../../stores/timerStore";
import { useAuthStore } from "../../stores/authStore";
import { ReadingModal } from "../../modals/ReadingModal";
import { ResultModal } from "../../modals/ResultModal";
import { useModalManager } from "../../hooks/useModalManager";

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
  } = useTimerStore();

  const { user } = useAuthStore();

  const {
    isReadingModalVisible,
    isResultModalVisible,
    showReadingModal,
    showResultModal,
    hideAllModals,
    isSubmittingResult,
    handleResultSubmit,
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

  // 결과 제출 처리
  const processResultSubmit = async (success: boolean) => {
    if (!user) {
      Alert.alert("로그인 필요", "결과를 저장하려면 로그인이 필요합니다.");
      return;
    }

    // 결과 저장
    const savedSuccessfully = await saveRecord(user.id, success);

    if (savedSuccessfully) {
      // 타이머 리셋 후 상태 초기화
      resetTimer(); // resetTimer에서 이미 buttonState를 'play'로 설정함
      resetTotalTime(); // totalTime 초기화 추가

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
        onSuccess={() => {
          if (!isSubmittingResult.current) {
            handleResultSubmit(() => processResultSubmit(true));
          }
        }}
        onFailure={() => {
          if (!isSubmittingResult.current) {
            handleResultSubmit(() => processResultSubmit(false));
          }
        }}
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
