import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";

export const CalendarScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const [selectedDate, setSelectedDate] = useState<number>(15); // 현재 날짜 (예: 15일)

  // 달력 데이터 생성 (예시)
  const currentMonth = "2024년 3월";
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 3월의 날짜 데이터 (단순화)
  const generateDays = () => {
    const days = [];
    const totalDays = 31; // 3월은 31일
    const firstDayIndex = 5; // 3월 1일이 금요일이라 가정 (인덱스 5)

    // 이전 달의 날짜 (빈 칸)
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: "", status: "empty" });
    }

    // 현재 달의 날짜
    for (let i = 1; i <= totalDays; i++) {
      // 랜덤으로 데이터 할당 (실제로는 서버에서 가져온 데이터로 대체)
      let status = "none";
      if (i % 5 === 0) status = "normal";
      if (i % 7 === 0) status = "constipation";
      if (i % 11 === 0) status = "diarrhea";
      days.push({ day: i, status });
    }

    return days;
  };

  const days = generateDays();

  // 선택한 날짜의 기록 데이터 (예시)
  const selectedDayRecords = [
    {
      id: 1,
      time: "09:15",
      duration: "5분",
      status: "정상",
      color: "#6B8E23",
      note: "아침 식사 후 자연스러운 배변",
    },
    {
      id: 2,
      time: "16:30",
      duration: "3분",
      status: "정상",
      color: "#6B8E23",
      note: "운동 후 배변",
    },
  ];

  // 상태에 따른 배경색 반환
  const getStatusBackground = (status: string) => {
    switch (status) {
      case "normal":
        return isDark ? "bg-green-600/70" : "bg-green-500/70";
      case "constipation":
        return isDark ? "bg-amber-600/70" : "bg-amber-500/70";
      case "diarrhea":
        return isDark ? "bg-blue-600/70" : "bg-blue-500/70";
      default:
        return "bg-transparent";
    }
  };

  return (
    <StyledView
      className={`flex-1 ${isDark ? "bg-mossy-darkest" : "bg-white"}`}
    >
      {/* 달력 헤더 */}
      <StyledView
        className={`py-4 px-5 flex-row justify-between items-center ${
          isDark ? "bg-mossy-dark/80" : "bg-mossy-light/80"
        }`}
      >
        <TouchableOpacity>
          <StyledText
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-mossy-darkest"
            }`}
          >
            ◀
          </StyledText>
        </TouchableOpacity>
        <StyledText
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          {currentMonth}
        </StyledText>
        <TouchableOpacity>
          <StyledText
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-mossy-darkest"
            }`}
          >
            ▶
          </StyledText>
        </TouchableOpacity>
      </StyledView>

      {/* 요일 헤더 */}
      <StyledView className="flex-row">
        {daysOfWeek.map((day, index) => (
          <StyledView
            key={index}
            className={`flex-1 py-2 items-center border-b ${
              isDark
                ? index === 0
                  ? "bg-red-900/30"
                  : index === 6
                  ? "bg-blue-900/30"
                  : "bg-mossy-dark/30"
                : index === 0
                ? "bg-red-100"
                : index === 6
                ? "bg-blue-100"
                : "bg-mossy-light/30"
            } ${isDark ? "border-mossy-dark" : "border-mossy-light"}`}
          >
            <StyledText
              className={`${
                index === 0
                  ? isDark
                    ? "text-red-400"
                    : "text-red-500"
                  : index === 6
                  ? isDark
                    ? "text-blue-400"
                    : "text-blue-500"
                  : isDark
                  ? "text-mossy-medium"
                  : "text-mossy-darkest"
              } font-medium`}
            >
              {day}
            </StyledText>
          </StyledView>
        ))}
      </StyledView>

      {/* 달력 그리드 */}
      <StyledView className="flex-wrap flex-row">
        {days.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[14.28%] h-14 p-1 border-b border-r ${
              isDark ? "border-mossy-dark/30" : "border-mossy-light/30"
            } ${
              item.day === selectedDate
                ? isDark
                  ? "bg-mossy-dark/50"
                  : "bg-mossy-light/50"
                : ""
            }`}
            onPress={() =>
              item.day &&
              setSelectedDate(
                typeof item.day === "number" ? item.day : selectedDate
              )
            }
          >
            {item.day && (
              <>
                <StyledText
                  className={`text-xs ${
                    isDark ? "text-mossy-light" : "text-mossy-darkest"
                  }`}
                >
                  {item.day}
                </StyledText>
                {item.status !== "none" && (
                  <StyledView
                    className={`w-4 h-4 rounded-full mt-1 self-center ${getStatusBackground(
                      item.status
                    )}`}
                  />
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </StyledView>

      {/* 선택된 날짜 정보 */}
      <StyledScrollView className="flex-1 p-4">
        <StyledText
          className={`text-lg font-bold mb-4 ${
            isDark ? "text-mossy-light" : "text-mossy-dark"
          }`}
        >
          3월 {selectedDate}일 기록
        </StyledText>

        {selectedDayRecords.length > 0 ? (
          selectedDayRecords.map((record) => (
            <StyledView
              key={record.id}
              className={`p-4 mb-3 rounded-lg ${
                isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
              }`}
            >
              <StyledView className="flex-row justify-between mb-2">
                <StyledText
                  className={`font-bold ${
                    isDark ? "text-white" : "text-mossy-darkest"
                  }`}
                >
                  {record.time}
                </StyledText>
                <StyledView className="flex-row items-center">
                  <StyledView
                    style={{ backgroundColor: record.color }}
                    className="w-3 h-3 rounded-full mr-1"
                  />
                  <StyledText
                    className={isDark ? "text-mossy-light" : "text-mossy-dark"}
                  >
                    {record.status}
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText
                className={`mb-2 ${
                  isDark ? "text-mossy-medium" : "text-mossy-darkest"
                }`}
              >
                소요 시간: {record.duration}
              </StyledText>
              <StyledText
                className={`text-sm ${
                  isDark ? "text-mossy-medium" : "text-mossy-darkest"
                }`}
              >
                {record.note}
              </StyledText>
            </StyledView>
          ))
        ) : (
          <StyledView
            className={`p-4 rounded-lg ${
              isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
            }`}
          >
            <StyledText
              className={`text-center ${
                isDark ? "text-mossy-medium" : "text-mossy-darkest"
              }`}
            >
              이 날의 기록이 없습니다.
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledView>
  );
};
