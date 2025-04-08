import React, { useMemo, useCallback } from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";
import { DisplayRecord } from "../../types/calendar";
import { Ionicons } from "@expo/vector-icons";

interface DayRecordsListProps {
  selectedDate: number | null;
  currentYear: number;
  currentMonth: number;
  selectedDayRecords: DisplayRecord[];
  isLoading: boolean;
  onPressAdd: () => void;
  onPressDelete: (id: string) => void;
}

export const DayRecordsList: React.FC<DayRecordsListProps> = ({
  selectedDate,
  currentYear,
  currentMonth,
  selectedDayRecords,
  isLoading,
  onPressAdd,
  onPressDelete,
}) => {
  const { isDark } = useThemeStore();

  // 색상 변수 추출 - useMemo로 메모이제이션하여 렌더링 최적화
  const colors = useMemo(
    () => ({
      textColor: isDark ? "text-white" : "text-mossy-darkest",
      subtextColor: isDark ? "text-gray-300" : "text-mossy-dark",
      cardBg: isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40",
      addButtonBg: isDark ? "bg-mossy-dark" : "bg-mossy-medium",
      emptyColor: isDark ? "text-gray-400" : "text-gray-500",
      iconColor: isDark ? "#A3A3A3" : "#6B6B6B",
      loaderColor: isDark ? "#8AA626" : "#636B2F",
    }),
    [isDark]
  );

  // 타이틀 메모이제이션
  const titleText = useMemo(() => {
    if (!selectedDate) return "";
    return `${currentYear}년 ${currentMonth}월 ${selectedDate}일 기록`;
  }, [currentYear, currentMonth, selectedDate]);

  // 삭제 핸들러 메모이제이션
  const handleDelete = useCallback(
    (id: string) => {
      onPressDelete(id);
    },
    [onPressDelete]
  );

  // 목록 렌더링 로직 메모이제이션
  const recordsList = useMemo(() => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={colors.loaderColor}
          className="my-4"
        />
      );
    }

    if (selectedDayRecords.length === 0) {
      return (
        <StyledView className="items-center justify-center py-8">
          <StyledText className={`text-center ${colors.emptyColor}`}>
            등록된 기록이 없습니다.
          </StyledText>
        </StyledView>
      );
    }

    return selectedDayRecords.map((record) => (
      <StyledView
        key={record.id}
        className={`p-3 mb-2 rounded-md ${colors.cardBg}`}
      >
        <StyledView className="flex-row justify-between items-center mb-2">
          <StyledView className="flex-row items-center">
            <StyledText className={`font-bold mr-2 ${colors.textColor}`}>
              {record.time}
            </StyledText>
            <StyledText className={`text-xs ${colors.subtextColor}`}>
              ({record.duration})
            </StyledText>
          </StyledView>

          <StyledView className="flex-row items-center">
            <StyledView
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: record.color }}
            />
            <StyledText className={`text-xs mr-3 ${colors.subtextColor}`}>
              {record.status}
            </StyledText>
            <TouchableOpacity
              onPress={() => handleDelete(record.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={colors.iconColor}
              />
            </TouchableOpacity>
          </StyledView>
        </StyledView>

        {record.note && (
          <StyledText
            className={`text-xs ${colors.subtextColor}`}
            numberOfLines={2}
          >
            {record.note}
          </StyledText>
        )}
      </StyledView>
    ));
  }, [selectedDayRecords, isLoading, colors, handleDelete]);

  // selectedDate가 없으면 아무것도 렌더링하지 않음
  if (!selectedDate) {
    return null;
  }

  return (
    <StyledView style={styles.container}>
      <StyledView className="flex-row justify-between items-center mb-3 px-4 pt-2">
        <StyledText className={`text-lg font-bold ${colors.textColor}`}>
          {titleText}
        </StyledText>
        <TouchableOpacity
          onPress={onPressAdd}
          className={`p-2 rounded-full ${colors.addButtonBg}`}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </StyledView>

      <StyledScrollView
        style={styles.scrollView}
        className="px-4"
        showsVerticalScrollIndicator={true}
      >
        {recordsList}
      </StyledScrollView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
});
