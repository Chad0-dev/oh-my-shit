// src/data/constipationInfo.ts
import { supabase } from "../supabase/client";
import { format, subDays } from "date-fns";

// 배변 상태 타입 정의
export type BowelStatusType = "좋음" | "보통" | "나쁨" | "알 수 없음";

// 영어 배변 상태 타입 추가
export type EnglishBowelStatusType = "good" | "normal" | "bad" | "unknown";

// 배변 상태 관련 인터페이스 정의
export interface BowelStatusResult {
  status: BowelStatusType;
  message: string;
  details: {
    averageDuration?: number; // 평균 소요 시간 (초)
    dailyAverage?: number; // 일평균 배변 횟수
    totalCount?: number; // 총 배변 횟수 (7일)
    successCount?: number; // 성공 배변 횟수 (7일)
  };
}

// 배변 상태를 평가하는 함수 - 이제 결과 객체를 반환
export const evaluateBowelStatus = async (
  userId: string
): Promise<BowelStatusResult> => {
  try {
    if (!userId) {
      return {
        status: "알 수 없음",
        message: "사용자 정보가 없습니다.",
        details: {},
      };
    }

    // 오늘 날짜와 7일 전 날짜 계산
    const endDate = new Date();
    const startDate = subDays(endDate, 7);

    // 날짜 형식 변환
    const startDateStr = format(startDate, "yyyy-MM-dd");
    const endDateStr = format(endDate, "yyyy-MM-dd");

    // 최근 7일간의 배변 기록 조회
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", `${startDateStr}T00:00:00`)
      .lte("created_at", `${endDateStr}T23:59:59`);

    if (error || !data) {
      return {
        status: "알 수 없음",
        message: "데이터를 가져오는 중 오류가 발생했습니다.",
        details: {},
      };
    }

    // 데이터가 없는 경우
    if (data.length === 0) {
      return {
        status: "알 수 없음",
        message: "최근 7일간 배변 기록이 없습니다.",
        details: {
          totalCount: 0,
        },
      };
    }

    // 데이터 분석
    const successRecords = data.filter((record) => record.success);
    const totalCount = data.length;
    const successCount = successRecords.length;

    // 평균 배변 시간 계산 (초 단위)
    let totalDuration = 0;
    let durationCount = 0;

    successRecords.forEach((record) => {
      if (record.duration) {
        totalDuration += record.duration;
        durationCount++;
      }
    });

    const averageDuration =
      durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

    // 하루 평균 배변 횟수 계산
    const dailyAverage = parseFloat((totalCount / 7).toFixed(1));

    // 상태 평가
    if (dailyAverage >= 1 && averageDuration <= 300) {
      // 하루 1회 이상, 5분(300초) 이내
      return {
        status: "좋음",
        message: "규칙적인 배변 활동과 효율적인 배변 시간을 유지하고 있습니다.",
        details: {
          averageDuration,
          dailyAverage,
          totalCount,
          successCount,
        },
      };
    } else if (dailyAverage >= 0.7 && averageDuration <= 420) {
      // 이틀에 한 번 이상, 7분(420초) 이내
      return {
        status: "보통",
        message:
          "배변 활동이 보통 수준입니다. 규칙적인 식습관으로 개선 가능합니다.",
        details: {
          averageDuration,
          dailyAverage,
          totalCount,
          successCount,
        },
      };
    } else {
      // 문제 특정
      let reason = "";
      if (dailyAverage < 0.7) {
        reason =
          "배변 횟수가 부족합니다. 식이섬유 섭취를 늘리고 수분을 충분히 섭취하세요.";
      } else if (averageDuration > 420) {
        reason =
          "배변 시간이 너무 깁니다. 충분한 운동과 식이조절을 시도해보세요.";
      } else {
        reason = "배변 습관에 개선이 필요합니다.";
      }

      return {
        status: "나쁨",
        message: reason,
        details: {
          averageDuration,
          dailyAverage,
          totalCount,
          successCount,
        },
      };
    }
  } catch (error) {
    console.error("배변 상태 평가 중 오류 발생:", error);
    return {
      status: "알 수 없음",
      message: "상태 평가 중 오류가 발생했습니다.",
      details: {},
    };
  }
};

// 배변 상태별 메시지 객체
export const statusMessages = {
  좋음: "My Poop Condition: Good 😊",
  보통: "My Poop Condition: Normal 🙂",
  나쁨: "My Poop Condition: Bad 😟",
  "알 수 없음": "My Poop Condition: Unknown 😕",
};

// 기본 문구 상수 (이제 함수로 변경)
export const getDefaultInfo = async (userId?: string): Promise<string> => {
  if (!userId) return statusMessages["알 수 없음"];

  const result = await evaluateBowelStatus(userId);
  return statusMessages[result.status];
};

// 상세 평가 결과 포함 메시지 가져오기 (더 상세한 정보가 필요한 경우 사용)
export const getDetailedStatusInfo = async (
  userId?: string
): Promise<BowelStatusResult> => {
  if (!userId) {
    return {
      status: "알 수 없음",
      message: "로그인이 필요합니다.",
      details: {},
    };
  }

  return await evaluateBowelStatus(userId);
};

// 이전 버전과의 호환성을 위해 기본값 유지
export const DEFAULT_INFO = "오늘의 목표: 배변 성공하기";

// 배변 관련 정보 배열
export const constipationInfos = [
  "규칙적인 식사는 장 운동을 도와 변비 예방에 효과적입니다.",
  "하루 2리터의 수분 섭취는 대변 이동을 원활하게 해줍니다.",
  "식이섬유가 풍부한 채소와 과일을 충분히 섭취하세요.",
  "매일 걷기나 가벼운 운동만 해도 배변에 큰 도움이 됩니다.",
  "아침 식사 후 화장실에 가는 습관을 들여보세요.",
  "의자에 오래 앉지 말고 30분마다 일어나 움직이세요.",
  "과도한 스트레스는 장의 리듬을 무너뜨릴 수 있어요.",
  "커피나 녹차는 장운동을 도와주지만 과음은 피하세요.",
  "변의가 느껴지면 바로 화장실을 이용하는 것이 좋아요.",
  "발을 살짝 올려 무릎이 높게 앉는 자세가 배변에 좋아요.",
  "유산균이 풍부한 요구르트는 장내 유익균을 늘려줍니다.",
  "프리바이오틱스는 장 환경을 개선하고 변비를 예방해요.",
  "수면 부족은 장의 기능을 떨어뜨릴 수 있으니 충분히 자세요.",
  "아침 햇볕을 쬐면 생체리듬이 안정되어 장 운동에도 좋아요.",
  "가벼운 스트레칭은 장에 자극을 줘 배변을 유도할 수 있어요.",
  "밀가루나 가공식품은 장 건강에 좋지 않으니 줄여보세요.",
  "음식은 천천히 꼭꼭 씹어 먹는 습관이 중요합니다.",
  "따뜻한 물을 자주 마시면 장이 부드럽게 작동해요.",
  "자극적인 음식은 장을 예민하게 만들어 변비를 유발할 수 있어요.",
  "과음은 장내 유익균을 줄이니 음주는 적당히 하세요.",
  "균형 잡힌 식단이 변비 예방에 가장 기본입니다.",
  "식사는 매일 같은 시간에 하는 게 장 리듬 유지에 좋아요.",
  "복식호흡은 장을 자극해 배변을 돕는 데 유용해요.",
  "장 운동은 아침에 가장 활발하니 기상 후 활동을 권장해요.",
  "장내 가스가 자주 찬다면 탄산음료는 줄이는 게 좋아요.",
];

// 한국어 상태를 영어 상태로 변환하는 함수
export const getEnglishStatus = (
  koreanStatus: BowelStatusType
): EnglishBowelStatusType => {
  switch (koreanStatus) {
    case "좋음":
      return "good";
    case "보통":
      return "normal";
    case "나쁨":
      return "bad";
    case "알 수 없음":
    default:
      return "unknown";
  }
};

// 영어 상태를 직접 반환하는 함수
export const evaluateBowelStatusEnglish = async (
  userId: string
): Promise<EnglishBowelStatusType> => {
  const result = await evaluateBowelStatus(userId);
  return getEnglishStatus(result.status);
};
