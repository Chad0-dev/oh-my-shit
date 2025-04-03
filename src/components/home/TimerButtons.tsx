import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Modal, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTimerStore } from "../../stores/timerStore";

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
  } = useTimerStore();
  const [readingModalVisible, setReadingModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  // 타이머 완료 상태 감지
  useEffect(() => {
    if (timerComplete) {
      // 타이머가 완료되었을 때 자동으로 결과 입력 모달 표시
      setResultModalVisible(true);
      // 타이머 중지
      stopTimer();
      // 완료 상태 초기화
      setTimerComplete(false);
    }
  }, [timerComplete]);

  const handlePlayPress = () => {
    if (buttonState === "play") {
      startTimer();
      setButtonState("plus");
    } else if (buttonState === "plus") {
      // 3분(180초) 추가
      addTime(180);
      setButtonState("slash");
    }
    // slash 상태에서는 아무 동작 안함
  };

  const handleReadingPress = () => {
    setReadingModalVisible(true);
  };

  const handleResultPress = () => {
    setResultModalVisible(true);
  };

  // 결과 입력 후 앱 상태 완전히 초기화
  const handleResultSubmit = (success: boolean) => {
    // 모달 닫기
    setResultModalVisible(false);

    // 타이머 리셋 후 상태 초기화
    resetTimer(); // resetTimer에서 이미 buttonState를 'play'로 설정함
    resetTotalTime(); // totalTime 초기화 추가

    // 전체 UI 리렌더링을 위한 신호 발생
    toggleResetSignal();

    // 결과 로깅
    console.log(`뽀모도로 결과: ${success ? "성공" : "실패"}`);
  };

  // 읽을거리 모달
  const ReadingModal = () => (
    <Modal
      visible={readingModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setReadingModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>읽을거리</Text>
          <Text style={styles.modalText}>
            뽀모도로 기법은 1980년대 후반 프란체스코 시릴로가 개발한 시간 관리
            방법론입니다. 25분 작업 후 5분 휴식을 반복하는 방식으로, 집중력과
            생산성을 높이는데 효과적입니다.
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setReadingModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 결과 확인 모달
  const ResultModal = () => (
    <Modal
      visible={resultModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setResultModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>결과 확인</Text>
          <Text style={styles.modalText}>뽀모도로를 완료했나요?</Text>
          <View style={styles.resultButtonContainer}>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: "#66BB6A" }]}
              onPress={() => handleResultSubmit(true)}
            >
              <Text style={styles.resultButtonText}>성공</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: "#EF5350" }]}
              onPress={() => handleResultSubmit(false)}
            >
              <Text style={styles.resultButtonText}>실패</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // 버튼 아이콘 선택
  const getPlayButtonIcon = () => {
    switch (buttonState) {
      case "play":
        return <Ionicons name="play" size={28} color="#636B2F" />;
      case "plus":
        return <Ionicons name="add" size={28} color="#636B2F" />;
      case "slash":
        return <Ionicons name="remove" size={28} color="#636B2F" />;
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
      <TouchableOpacity style={styles.button} onPress={handleReadingPress}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleResultPress}>
        <MaterialCommunityIcons
          name="pencil-box-multiple"
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>

      {/* 모달 */}
      <ReadingModal />
      <ResultModal />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#636B2F",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#636B2F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  resultButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  resultButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  resultButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
