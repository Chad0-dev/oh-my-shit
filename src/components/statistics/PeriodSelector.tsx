import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";
import { PeriodType } from "../../services/statisticsService";

interface PeriodSelectorProps {
  visible: boolean;
  selectedPeriod: PeriodType;
  onSelect: (periodType: PeriodType) => void;
  onClose: () => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  visible,
  selectedPeriod,
  onSelect,
  onClose,
}) => {
  const { isDark } = useThemeStore();

  const handleSelect = (periodType: PeriodType) => {
    onSelect(periodType);
    onClose();
  };

  // 각 기간 유형에 대한 텍스트 매핑
  const periodLabels: Record<PeriodType, string> = {
    day: "일간",
    week: "주간",
    month: "월간",
    year: "연간",
  };

  // 배경 클릭 시 닫기
  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <StyledView className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <StyledView
              className={`w-3/4 rounded-lg p-4 ${
                isDark ? "bg-mossy-darkest" : "bg-white"
              }`}
              style={styles.modalContent}
            >
              <StyledText
                className={`text-lg font-bold mb-4 text-center ${
                  isDark ? "text-white" : "text-mossy-darkest"
                }`}
              >
                기간 선택
              </StyledText>

              {Object.entries(periodLabels).map(([type, label]) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleSelect(type as PeriodType)}
                  className={`p-3 my-1 rounded-lg ${
                    selectedPeriod === type
                      ? isDark
                        ? "bg-mossy-dark"
                        : "bg-mossy-light"
                      : "bg-transparent"
                  }`}
                >
                  <StyledText
                    className={`text-center text-base ${
                      selectedPeriod === type
                        ? isDark
                          ? "font-bold text-white"
                          : "font-bold text-mossy-darkest"
                        : isDark
                        ? "text-gray-300"
                        : "text-mossy-dark"
                    }`}
                  >
                    {label}
                  </StyledText>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={onClose}
                className={`mt-4 p-3 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <StyledText
                  className={`text-center font-bold ${
                    isDark ? "text-white" : "text-mossy-dark"
                  }`}
                >
                  닫기
                </StyledText>
              </TouchableOpacity>
            </StyledView>
          </TouchableWithoutFeedback>
        </StyledView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
