import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";
import {
  getMonthlyShitRecords,
  getDailyShitRecords,
  ShitRecord,
  AmountType,
  saveShitRecord,
} from "../../services/recordService";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/client";
import DateTimePicker from "@react-native-community/datetimepicker";

interface CalendarDay {
  day: number | string;
  status: "empty" | "none" | "normal" | "constipation" | "diarrhea";
  records?: ShitRecord[];
}

interface DisplayRecord {
  id?: string;
  time: string;
  duration: string;
  status: string;
  color: string;
  note: string;
}

export const CalendarScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  );
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDayRecords, setSelectedDayRecords] = useState<DisplayRecord[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);

  // 기록 입력 모달 상태
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [memo, setMemo] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<AmountType>("보통");
  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  // 시간 선택 및 표시 상태
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState<string>("0");
  const [durationSeconds, setDurationSeconds] = useState<string>("0");

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 월별 기록 불러오기
  const fetchMonthlyRecords = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await getMonthlyShitRecords(
        user.id,
        currentYear,
        currentMonth
      );

      if (error) throw error;

      // 달력 데이터 생성
      generateCalendarData(data || []);
    } catch (error) {
      console.error("월별 기록 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentYear, currentMonth]);

  // 날짜별 기록 불러오기
  const fetchDailyRecords = useCallback(async () => {
    if (!user) return;

    setIsLoadingRecords(true);
    try {
      const date = new Date(currentYear, currentMonth - 1, selectedDate);
      const { data, error } = await getDailyShitRecords(user.id, date);

      if (error) throw error;

      // 기록 변환
      const displayRecords = (data || []).map((record) =>
        convertToDisplayRecord(record)
      );
      setSelectedDayRecords(displayRecords);
    } catch (error) {
      console.error("일별 기록 불러오기 실패:", error);
      setSelectedDayRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  }, [user, currentYear, currentMonth, selectedDate]);

  // 기록을 표시용 데이터로 변환
  const convertToDisplayRecord = (record: ShitRecord): DisplayRecord => {
    // 시작 시간 포맷팅
    const startTime = new Date(record.start_time);
    const formattedTime = `${String(startTime.getHours()).padStart(
      2,
      "0"
    )}:${String(startTime.getMinutes()).padStart(2, "0")}`;

    // 상태 및 색상 결정
    let status = "정상";
    let color = "#4CAF50"; // 성공(정상) - 초록색

    if (!record.success) {
      status = "실패";
      color = "#EF5350"; // 실패 - 빨간색
    } else if (record.amount) {
      if (record.amount === "많음") {
        status = "많음";
        color = "#2E7D32"; // 많음 - 진한 초록색
      } else if (record.amount === "적음") {
        status = "적음";
        color = "#8BC34A"; // 적음 - 연한 초록색
      } else if (record.amount === "이상") {
        status = "이상";
        color = "#FF9800"; // 이상 - 주황색
      }
    }

    // 소요 시간 계산
    let duration = "0분";
    if (record.duration) {
      duration = `${record.duration}초`;
      if (record.duration >= 60) {
        duration = `${Math.floor(record.duration / 60)}분`;
        if (record.duration % 60 > 0) {
          duration += ` ${record.duration % 60}초`;
        }
      }
    }

    return {
      id: record.id,
      time: formattedTime,
      duration,
      status,
      color,
      note: record.memo || "",
    };
  };

  // 달력 데이터 생성
  const generateCalendarData = (records: ShitRecord[]) => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)

    // 이전 달의 날짜 (빈 칸)
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: "", status: "empty" });
    }

    // 현재 달의 날짜에 기록 상태 부여
    for (let day = 1; day <= totalDays; day++) {
      // 해당 날짜의 기록 필터링
      const dayRecords = records.filter((record) => {
        const recordDate = new Date(record.start_time);
        return recordDate.getDate() === day;
      });

      let status: CalendarDay["status"] = "none";

      if (dayRecords.length > 0) {
        // 새로운 규칙에 따른 상태 결정
        const hasAbnormal = dayRecords.some(
          (record) => record.success && record.amount === "이상"
        );

        const hasSuccess = dayRecords.some((record) => record.success);
        const hasFail = dayRecords.some((record) => !record.success);

        if (hasAbnormal) {
          status = "diarrhea"; // 이상 이벤트가 있으면 주황색(실제로는 UI에서 바꿀 예정)
        } else if (!hasSuccess && hasFail) {
          status = "constipation"; // 실패 이벤트만 있으면 빨간색
        } else if (hasSuccess) {
          status = "normal"; // 성공 이벤트가 있으면 초록색
        }
      }

      days.push({
        day,
        status,
        records: dayRecords,
      });
    }

    setDays(days);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 이전 달로 이동
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 상태에 따른 배경색 반환
  const getStatusBackground = (status: string) => {
    switch (status) {
      case "normal":
        return isDark ? "bg-green-600/70" : "bg-green-500/70"; // 성공 - 초록색
      case "constipation":
        return isDark ? "bg-red-600/70" : "bg-red-500/70"; // 실패 - 빨간색
      case "diarrhea":
        return isDark ? "bg-orange-600/70" : "bg-orange-500/70"; // 이상 - 주황색
      default:
        return "bg-transparent";
    }
  };

  // 기록 삭제 함수
  const handleDeleteRecord = async (recordId: string | undefined) => {
    if (!recordId || !user) return;

    Alert.alert("기록 삭제", "이 기록을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setIsDeleteLoading(true);
          try {
            const { error } = await supabase
              .from("shit_records")
              .delete()
              .eq("id", recordId)
              .eq("user_id", user.id);

            if (error) throw error;

            // 삭제 후 데이터 다시 불러오기
            await fetchDailyRecords();
            await fetchMonthlyRecords();
          } catch (error) {
            console.error("기록 삭제 실패:", error);
            Alert.alert("오류", "기록 삭제에 실패했습니다.");
          } finally {
            setIsDeleteLoading(false);
          }
        },
      },
    ]);
  };

  // 시간 선택 핸들러
  const onTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedTime;
    setShowTimePicker(Platform.OS === "ios");
    setSelectedTime(currentDate);
  };

  // 소요시간 입력 핸들러 (분)
  const handleDurationMinutesChange = (text: string) => {
    // 숫자만 입력되도록 필터링
    const numericValue = text.replace(/[^0-9]/g, "");
    setDurationMinutes(numericValue);
  };

  // 소요시간 입력 핸들러 (초)
  const handleDurationSecondsChange = (text: string) => {
    // 숫자만 입력되도록 필터링
    const numericValue = text.replace(/[^0-9]/g, "");
    // 60초 미만으로 제한
    if (parseInt(numericValue) < 60) {
      setDurationSeconds(numericValue);
    } else {
      setDurationSeconds("59");
    }
  };

  // 기록 추가 함수
  const handleAddRecord = async () => {
    if (!user) {
      Alert.alert("로그인 필요", "기록을 추가하려면 로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);
    try {
      // 선택한 날짜와 입력한 시간으로 기록 생성
      const recordDate = new Date(
        currentYear,
        currentMonth - 1,
        selectedDate,
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds()
      );

      // 분과 초를 합쳐서 총 소요시간(초) 계산
      const totalDurationSeconds =
        (parseInt(durationMinutes) || 0) * 60 +
        (parseInt(durationSeconds) || 0);

      const record: ShitRecord = {
        user_id: user.id,
        start_time: recordDate.toISOString(),
        end_time: recordDate.toISOString(),
        success: isSuccess,
        amount: isSuccess ? selectedAmount : undefined,
        memo: memo,
        duration: totalDurationSeconds, // 분과 초를 합친 총 소요시간(초)
      };

      const { error } = await saveShitRecord(record);

      if (error) throw error;

      // 기록 추가 후 모달 닫기 및 상태 초기화
      setIsAddModalVisible(false);
      setMemo("");
      setSelectedAmount("보통");
      setIsSuccess(true);
      setSelectedTime(new Date());
      setDurationMinutes("0");
      setDurationSeconds("0");

      // 데이터 다시 불러오기
      await fetchDailyRecords();
      await fetchMonthlyRecords();

      Alert.alert("완료", "기록이 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("기록 추가 실패:", error);
      Alert.alert("오류", "기록 추가에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 모달 열기
  const openAddModal = () => {
    setMemo("");
    setSelectedAmount("보통");
    setIsSuccess(true);
    setSelectedTime(new Date());
    setDurationMinutes("0");
    setDurationSeconds("0");
    setIsAddModalVisible(true);
  };

  // 월이 변경될 때마다 데이터 가져오기
  useEffect(() => {
    fetchMonthlyRecords();
  }, [fetchMonthlyRecords]);

  // 선택한 날짜가 변경될 때마다 일별 기록 가져오기
  useEffect(() => {
    if (selectedDate) {
      fetchDailyRecords();
    }
  }, [fetchDailyRecords, selectedDate]);

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
        <TouchableOpacity onPress={goToPrevMonth}>
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
          {currentYear}년 {currentMonth}월
        </StyledText>
        <TouchableOpacity onPress={goToNextMonth}>
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
      {isLoading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDark ? "#6B8E23" : "#4CAF50"}
          />
        </StyledView>
      ) : (
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
                typeof item.day === "number" &&
                setSelectedDate(item.day)
              }
              disabled={!item.day}
            >
              {item.day ? (
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
              ) : null}
            </TouchableOpacity>
          ))}
        </StyledView>
      )}

      {/* 선택된 날짜 정보 */}
      <StyledScrollView className="flex-1 p-4">
        <StyledView className="flex-row justify-between items-center mb-4">
          <StyledText
            className={`text-lg font-bold ${
              isDark ? "text-mossy-light" : "text-mossy-dark"
            }`}
          >
            {currentMonth}월 {selectedDate}일 기록
          </StyledText>

          <TouchableOpacity
            onPress={openAddModal}
            className={`p-2 rounded-full ${
              isDark ? "bg-mossy-dark" : "bg-mossy-light"
            }`}
          >
            <Ionicons
              name="add"
              size={20}
              color={isDark ? "#FFFFFF" : "#636B2F"}
            />
          </TouchableOpacity>
        </StyledView>

        {isLoadingRecords ? (
          <StyledView className="py-10 justify-center items-center">
            <ActivityIndicator
              size="small"
              color={isDark ? "#6B8E23" : "#4CAF50"}
            />
          </StyledView>
        ) : selectedDayRecords.length > 0 ? (
          selectedDayRecords.map((record, index) => (
            <StyledView
              key={index}
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

              <StyledView className="flex-row justify-between items-center mb-2">
                <StyledText
                  className={`${
                    isDark ? "text-mossy-medium" : "text-mossy-darkest"
                  }`}
                >
                  소요 시간: {record.duration}
                </StyledText>

                <TouchableOpacity
                  onPress={() => handleDeleteRecord(record.id)}
                  disabled={isDeleteLoading}
                  className="p-1"
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={isDark ? "#A3A3A3" : "#6B6B6B"}
                  />
                </TouchableOpacity>
              </StyledView>

              {record.note ? (
                <StyledText
                  className={`text-sm ${
                    isDark ? "text-mossy-medium" : "text-mossy-darkest"
                  }`}
                >
                  {record.note}
                </StyledText>
              ) : null}
            </StyledView>
          ))
        ) : (
          <StyledView
            className={`p-4 rounded-lg ${
              isDark ? "bg-mossy-dark/30" : "bg-mossy-light/30"
            } items-center justify-center`}
          >
            <StyledText
              className={`text-center ${
                isDark ? "text-mossy-medium" : "text-mossy-dark"
              }`}
            >
              기록이 없습니다.
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>

      {/* 기록 추가 모달 */}
      <Modal
        visible={isAddModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAddModalVisible(false)}
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

                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
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
                  onPress={() => setShowTimePicker(true)}
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
                      onChangeText={handleDurationMinutesChange}
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
                      onChangeText={handleDurationSecondsChange}
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
                    onPress={() => setIsSuccess(true)}
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
                    onPress={() => setIsSuccess(false)}
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
                        onPress={() => setSelectedAmount(amount as AmountType)}
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
                  onChangeText={setMemo}
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
                onPress={handleAddRecord}
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
    </StyledView>
  );
};
