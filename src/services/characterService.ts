import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { supabase } from "../supabase/client";

// 캐릭터 상태 타입 정의
export type CharacterState = "normal" | "pooping" | "success" | "fail";

// 상태별 이미지 파일명 매핑
const imageNameMap: Record<CharacterState, string> = {
  normal: "normal",
  pooping: "pooping",
  success: "success",
  fail: "fail",
};

/**
 * 캐릭터 이미지 URL을 가져오는 함수
 * @param state 캐릭터 상태
 * @returns 해당 상태의 이미지 URL
 */
export const getCharacterImageUrl = async (
  state: CharacterState
): Promise<string> => {
  try {
    console.log(`[characterService] 이미지 URL 요청: 상태=${state}`);

    // 이미지 파일명 결정 (매핑 테이블에서 가져옴)
    const imageName = imageNameMap[state];
    if (!imageName) {
      throw new Error(`알 수 없는 캐릭터 상태: ${state}`);
    }

    // Supabase에서 이미지 URL 가져오기 - image 버킷의 basic 폴더에서 이미지를 가져옴
    const { data } = await supabase.storage
      .from("images")
      .getPublicUrl(`basic/${imageName}.png`);

    console.log(`[characterService] Supabase 응답 확인:`, data);

    if (!data || !data.publicUrl) {
      throw new Error(`이미지 URL이 없습니다: basic/${imageName}.png`);
    }

    console.log(
      `[characterService] Supabase 이미지 URL 가져옴: ${data.publicUrl}`
    );
    return data.publicUrl;
  } catch (error) {
    console.error(
      `[characterService] 이미지 URL 생성 오류(상태: ${state}):`,
      error
    );
    // 에러 발생 시 더미 이미지 URL 반환
    const dummyImageUrl =
      "https://placehold.co/400x400/FF6B6B/FFF?text=" + state + "-error";
    console.log(
      `[characterService] 에러로 인한 더미 이미지 URL 사용: ${dummyImageUrl}`
    );
    return dummyImageUrl;
  }
};

/**
 * 모든 캐릭터 상태의 이미지 URL을 가져오는 함수
 * @returns 상태별 이미지 URL 객체
 */
export const getAllCharacterImages = async (): Promise<
  Record<CharacterState, string | null>
> => {
  try {
    console.log("[characterService] 모든 캐릭터 이미지 로드 시작");

    // 모든 상태에 대한 이미지 URL 동시 요청
    const states: CharacterState[] = ["normal", "pooping", "success", "fail"];
    const imagePromises = states.map(async (state) => {
      try {
        return { state, url: await getCharacterImageUrl(state) };
      } catch (e) {
        console.error(`[characterService] ${state} 상태 이미지 로드 실패:`, e);
        return { state, url: null };
      }
    });

    // 모든 Promise 완료 대기
    const results = await Promise.all(imagePromises);

    // 결과를 객체로 변환
    const imageUrls = results.reduce((acc, { state, url }) => {
      acc[state] = url;
      return acc;
    }, {} as Record<CharacterState, string | null>);

    console.log("[characterService] 모든 캐릭터 이미지 로드 완료:", imageUrls);
    return imageUrls;
  } catch (error) {
    console.error("[characterService] 모든 캐릭터 이미지 로드 중 오류:", error);
    throw new Error(`모든 캐릭터 이미지 URL을 가져오는 중 오류 발생: ${error}`);
  }
};

/**
 * 타이머 상태에 따라 캐릭터 상태를 결정하는 함수
 * @param timerComplete 타이머 완료 여부
 * @param isRunning 타이머 실행 중 여부
 * @param success 성공 여부 (타이머 완료 시)
 * @returns 캐릭터 상태
 */
export const getCharacterStateFromTimerState = (
  timerComplete: boolean,
  isRunning: boolean,
  success?: boolean
): CharacterState => {
  console.log(`[characterService] 타이머 상태에 따른 캐릭터 상태 결정:`, {
    타이머완료: timerComplete,
    실행중: isRunning,
    성공여부: success,
  });

  if (timerComplete) {
    // 타이머가 완료되면 success 파라미터에 따라 성공/실패 상태 반환
    return success === true ? "success" : success === false ? "fail" : "normal";
  } else if (isRunning) {
    // 타이머 실행 중이면 pooping 상태
    return "pooping";
  } else {
    // 그 외의 경우 기본 상태
    return "normal";
  }
};
