import { useState, useEffect, useRef } from "react";
import { BackHandler } from "react-native";
import { AmountType } from "../services/recordService";

interface UseModalManagerResult {
  isReadingModalVisible: boolean;
  isResultModalVisible: boolean;
  isSuccessDetailModalVisible: boolean;
  showReadingModal: () => void;
  showResultModal: () => void;
  showSuccessDetailModal: () => void;
  hideAllModals: () => void;
  isSubmittingResult: React.RefObject<boolean>;
  detailAmount: AmountType;
  detailMemo: string;
  setDetailAmount: (amount: AmountType) => void;
  setDetailMemo: (memo: string) => void;
  handleResultSubmit: (callback: () => void) => void;
  handleSuccessDetailSubmit: (
    amount: AmountType,
    memo: string,
    callback: (amount: AmountType, memo: string) => void
  ) => void;
}

export const useModalManager = (): UseModalManagerResult => {
  const [isReadingModalVisible, setReadingModalVisible] = useState(false);
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  const [isSuccessDetailModalVisible, setSuccessDetailModalVisible] =
    useState(false);
  const [detailAmount, setDetailAmount] = useState<AmountType>("보통");
  const [detailMemo, setDetailMemo] = useState("");
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
        if (isSuccessDetailModalVisible) {
          setSuccessDetailModalVisible(false);
          return true;
        }
        return false;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [
    isReadingModalVisible,
    isResultModalVisible,
    isSuccessDetailModalVisible,
  ]);

  // 모달 표시 함수
  const showReadingModal = () => setReadingModalVisible(true);
  const showResultModal = () => setResultModalVisible(true);
  const showSuccessDetailModal = () => setSuccessDetailModalVisible(true);

  // 모든 모달 숨기기
  const hideAllModals = () => {
    setReadingModalVisible(false);
    setResultModalVisible(false);
    setSuccessDetailModalVisible(false);
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

  // 세부사항 제출 처리 함수
  const handleSuccessDetailSubmit = (
    amount: AmountType,
    memo: string,
    callback: (amount: AmountType, memo: string) => void
  ) => {
    if (isSubmittingResult.current) return;

    isSubmittingResult.current = true;

    // 모달 닫기
    setSuccessDetailModalVisible(false);

    // 세부사항 상태 업데이트
    setDetailAmount(amount);
    setDetailMemo(memo);

    // 짧은 지연 후에 콜백 실행 (모달이 완전히 닫힌 후)
    setTimeout(() => {
      // 콜백 실행
      callback(amount, memo);

      // 상태 초기화
      isSubmittingResult.current = false;
    }, 300);
  };

  return {
    isReadingModalVisible,
    isResultModalVisible,
    isSuccessDetailModalVisible,
    showReadingModal,
    showResultModal,
    showSuccessDetailModal,
    hideAllModals,
    isSubmittingResult,
    detailAmount,
    detailMemo,
    setDetailAmount,
    setDetailMemo,
    handleResultSubmit,
    handleSuccessDetailSubmit,
  };
};
