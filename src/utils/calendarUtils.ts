import { ShitRecord } from "../services/recordService";
import { CalendarDay, DisplayRecord } from "../types/calendar";

/**
 * 특정 년월에 대한 달력 데이터를 생성합니다.
 */
export const generateCalendarData = (
  records: ShitRecord[],
  currentYear: number,
  currentMonth: number
): CalendarDay[] => {
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
        status = "diarrhea"; // 이상 이벤트가 있으면 주황색
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

  return days;
};

/**
 * 상태에 따른 배경색 반환
 */
export const getStatusBackground = (
  status: string,
  isDark: boolean
): string => {
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

/**
 * 기록을 표시용 데이터로 변환합니다.
 */
export const convertToDisplayRecord = (record: ShitRecord): DisplayRecord => {
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
    id: record.id || "",
    time: formattedTime,
    duration,
    status,
    color,
    note: record.memo || "",
  };
};
