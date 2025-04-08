import React from "react";
import {
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useThemeStore } from "../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../utils/styled";
import { Ionicons } from "@expo/vector-icons";
import { AmountType } from "../services/recordService";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddRecordModalProps {
  visible: boolean;
  selectedDate: number | null;
  currentYear: number;
  currentMonth: number;
  isSuccess: boolean;
  selectedAmount: AmountType;
  selectedTime: Date;
  durationMinutes: string;
  durationSeconds: string;
  memo: string;
  isLoading: boolean;
  showTimePicker: boolean;
  onTimeChange: (event: any, selectedDate?: Date) => void;
  onChangeSuccess: (success: boolean) => void;
  onChangeAmount: (amount: AmountType) => void;
  onChangeMemo: (memo: string) => void;
  onChangeDurationMinutes: (text: string) => void;
  onChangeDurationSeconds: (text: string) => void;
  onPressTimePicker: () => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  visible,
  selectedDate,
  currentYear,
  currentMonth,
  isSuccess,
  selectedAmount,
  selectedTime,
  durationMinutes,
  durationSeconds,
  memo,
  isLoading,
  showTimePicker,
  onTimeChange,
  onChangeSuccess,
  onChangeAmount,
  onChangeMemo,
  onChangeDurationMinutes,
  onChangeDurationSeconds,
  onPressTimePicker,
  onClose,
  onSubmit,
}) => {
  const { isDark } = useThemeStore();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 bg-black/50 justify-center items-center p-4">
        <StyledScrollView
          className={`w-full max-h-[90%] rounded-lg ${
            isDark ? "bg-mossy-darkest" : "bg-white"
          }`}
        >
          <StyledView className="p-5">
            <StyledView className="flex-row justify-between items-center mb-4 border-b pb-3 border-gray-500/30">
              <StyledText
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-mossy-darkest"
                }`}
              >
                배변 기록 추가
              </StyledText>

              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "#FFFFFF" : "#636B2F"}
                />
              </TouchableOpacity>
            </StyledView>

            <StyledText
              className={`mb-4 font-medium ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              {currentYear}년 {currentMonth}월 {selectedDate}일
            </StyledText>

            {/* 시간 입력 필드 */}
            <StyledView className="mb-4">
              <StyledText
                className={`mb-2 font-medium ${
                  isDark ? "text-mossy-light" : "text-mossy-dark"
                }`}
              >
                시간
              </StyledText>

              <TouchableOpacity
                onPress={onPressTimePicker}
                className={`p-3 rounded-md ${
                  isDark
                    ? "bg-mossy-dark/50 border-mossy-dark"
                    : "bg-mossy-light/50 border-mossy-light"
                } border flex-row justify-between items-center`}
              >
                <StyledText
                  className={isDark ? "text-white" : "text-mossy-darkest"}
                >
                  {selectedTime.getHours().toString().padStart(2, "0")}:
                  {selectedTime.getMinutes().toString().padStart(2, "0")}
                </StyledText>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={isDark ? "#FFFFFF" : "#636B2F"}
                />
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </StyledView>

            {/* 소요 시간 입력 */}
            <StyledView className="mb-4">
              <StyledText
                className={`mb-2 font-medium ${
                  isDark ? "text-mossy-light" : "text-mossy-dark"
                }`}
              >
                소요 시간
              </StyledText>

              <StyledView className="flex-row items-center">
                <StyledView className="flex-1 mr-2">
                  <StyledText
                    className={`mb-1 text-xs ${
                      isDark ? "text-mossy-light" : "text-mossy-dark"
                    }`}
                  >
                    분
                  </StyledText>
                  <TextInput
                    value={durationMinutes}
                    onChangeText={onChangeDurationMinutes}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    className={`p-3 rounded-md ${
                      isDark
                        ? "bg-mossy-dark/50 text-white border-mossy-dark"
                        : "bg-mossy-light/50 text-mossy-darkest border-mossy-light"
                    } border text-center`}
                  />
                </StyledView>

                <StyledText
                  className={`font-bold text-xl mb-5 ${
                    isDark ? "text-white" : "text-mossy-dark"
                  }`}
                >
                  :
                </StyledText>

                <StyledView className="flex-1 ml-2">
                  <StyledText
                    className={`mb-1 text-xs ${
                      isDark ? "text-mossy-light" : "text-mossy-dark"
                    }`}
                  >
                    초
                  </StyledText>
                  <TextInput
                    value={durationSeconds}
                    onChangeText={onChangeDurationSeconds}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    className={`p-3 rounded-md ${
                      isDark
                        ? "bg-mossy-dark/50 text-white border-mossy-dark"
                        : "bg-mossy-light/50 text-mossy-darkest border-mossy-light"
                    } border text-center`}
                  />
                </StyledView>
              </StyledView>
            </StyledView>

            {/* 성공 여부 */}
            <StyledView className="mb-4">
              <StyledText
                className={`mb-2 font-medium ${
                  isDark ? "text-mossy-light" : "text-mossy-dark"
                }`}
              >
                성공 여부
              </StyledText>

              <StyledView className="flex-row">
                <TouchableOpacity
                  onPress={() => onChangeSuccess(true)}
                  className={`mr-3 px-6 py-2 rounded-md ${
                    isSuccess
                      ? isDark
                        ? "bg-mossy-dark"
                        : "bg-mossy-medium"
                      : isDark
                      ? "bg-mossy-dark/30"
                      : "bg-mossy-light"
                  }`}
                >
                  <StyledText
                    className={
                      isSuccess
                        ? "text-white font-bold"
                        : isDark
                        ? "text-mossy-medium"
                        : "text-mossy-dark"
                    }
                  >
                    성공
                  </StyledText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onChangeSuccess(false)}
                  className={`px-6 py-2 rounded-md ${
                    !isSuccess
                      ? isDark
                        ? "bg-red-700"
                        : "bg-red-500"
                      : isDark
                      ? "bg-mossy-dark/30"
                      : "bg-mossy-light"
                  }`}
                >
                  <StyledText
                    className={
                      !isSuccess
                        ? "text-white font-bold"
                        : isDark
                        ? "text-mossy-medium"
                        : "text-mossy-dark"
                    }
                  >
                    실패
                  </StyledText>
                </TouchableOpacity>
              </StyledView>
            </StyledView>

            {/* 배변량 (성공 시에만 표시) */}
            {isSuccess && (
              <StyledView className="mb-4">
                <StyledText
                  className={`mb-2 font-medium ${
                    isDark ? "text-mossy-light" : "text-mossy-dark"
                  }`}
                >
                  배변량
                </StyledText>

                <StyledView className="flex-row flex-wrap">
                  {["많음", "보통", "적음", "이상"].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      onPress={() => onChangeAmount(amount as AmountType)}
                      className={`mr-2 mb-2 px-4 py-3 rounded-md ${
                        selectedAmount === amount
                          ? isDark
                            ? "bg-mossy-dark"
                            : "bg-mossy-medium"
                          : isDark
                          ? "bg-mossy-dark/30"
                          : "bg-mossy-light"
                      }`}
                    >
                      <StyledText
                        className={
                          selectedAmount === amount
                            ? "text-white font-medium"
                            : isDark
                            ? "text-mossy-medium"
                            : "text-mossy-dark"
                        }
                      >
                        {amount}
                      </StyledText>
                    </TouchableOpacity>
                  ))}
                </StyledView>
              </StyledView>
            )}

            {/* 메모 */}
            <StyledView className="mb-5">
              <StyledText
                className={`mb-2 font-medium ${
                  isDark ? "text-mossy-light" : "text-mossy-dark"
                }`}
              >
                메모
              </StyledText>

              <TextInput
                value={memo}
                onChangeText={onChangeMemo}
                multiline
                numberOfLines={6}
                placeholder="메모를 입력하세요"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                className={`p-3 rounded-md ${
                  isDark
                    ? "bg-mossy-dark/50 text-white border-mossy-dark"
                    : "bg-mossy-light/50 text-mossy-darkest border-mossy-light"
                } border min-h-[120px]`}
                style={{ textAlignVertical: "top" }}
              />
            </StyledView>

            {/* 저장 버튼 */}
            <TouchableOpacity
              onPress={onSubmit}
              disabled={isLoading}
              className={`py-3 rounded-md mt-2 ${
                isDark ? "bg-mossy-dark" : "bg-mossy-medium"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <StyledText className="text-white text-center font-bold">
                  저장
                </StyledText>
              )}
            </TouchableOpacity>
          </StyledView>
        </StyledScrollView>
      </StyledView>
    </Modal>
  );
};
