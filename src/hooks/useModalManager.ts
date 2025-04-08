import { useState, useEffect, useRef } from "react";
import { BackHandler } from "react-native";

interface UseModalManagerResult {
  isReadingModalVisible: boolean;
  isResultModalVisible: boolean;
  showReadingModal: () => void;
  showResultModal: () => void;
  hideAllModals: () => void;
  isSubmittingResult: React.RefObject<boolean>;
  handleResultSubmit: (callback: () => void) => void;
}

export const useModalManager = (): UseModalManagerResult => {
  const [isReadingModalVisible, setReadingModalVisible] = useState(false);
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  const isSubmittingResult = useRef(false);

  // 모달 가시성 변경 시 뒤로가기 버튼 처리
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isReadingModalVisible) {
          setReadingModalVisible(false);
          return true;
        }
        if (isResultModalVisible) {
          setResultModalVisible(false);
          return true;
        }
        return false;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [isReadingModalVisible, isResultModalVisible]);

  // 모달 표시 함수
  const showReadingModal = () => setReadingModalVisible(true);
  const showResultModal = () => setResultModalVisible(true);

  // 모든 모달 숨기기
  const hideAllModals = () => {
    setReadingModalVisible(false);
    setResultModalVisible(false);
  };

  // 결과 제출 처리 함수
  const handleResultSubmit = (callback: () => void) => {
    if (isSubmittingResult.current) return;

    isSubmittingResult.current = true;
    setResultModalVisible(false);

    // 콜백 실행
    callback();

    // 상태 초기화는 약간의 지연 후에
    setTimeout(() => {
      isSubmittingResult.current = false;
    }, 300);
  };

  return {
    isReadingModalVisible,
    isResultModalVisible,
    showReadingModal,
    showResultModal,
    hideAllModals,
    isSubmittingResult,
    handleResultSubmit,
  };
};
