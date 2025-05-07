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
 * @param characterId 캐릭터 ID (폴더 이름)
 * @param state 캐릭터 상태
 * @returns 해당 상태의 이미지 URL
 */
export const getCharacterImageUrl = async (
  characterId: string,
  state: CharacterState
): Promise<string> => {
  try {
    // 이미지 파일명 결정 (매핑 테이블에서 가져옴)
    const imageName = imageNameMap[state];
    if (!imageName) {
      throw new Error(`알 수 없는 캐릭터 상태: ${state}`);
    }

    // Supabase에서 이미지 URL 가져오기
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`${characterId}/${imageName}.png`);

    if (!data || !data.publicUrl) {
      throw new Error(`이미지 URL이 없습니다: ${characterId}/${imageName}.png`);
    }

    return `${data.publicUrl}?t=${new Date().getTime()}`;
  } catch (error) {
    // 에러 발생 시 더미 이미지 URL 반환
    return `https://placehold.co/400x400/FF6B6B/FFF?text=${characterId}-${state}`;
  }
};

/**
 * 사용 가능한 캐릭터 목록을 가져오는 함수
 * @returns 캐릭터 목록
 */
export const getAvailableCharacters = async () => {
  try {
    // images 버킷의 폴더 목록 가져오기
    const { data: folders, error } = await supabase.storage
      .from("images")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw error;
    }

    if (!folders || folders.length === 0) {
      return [];
    }

    // 각 폴더의 normal.png URL 생성
    const characters = await Promise.all(
      folders
        .filter((folder) => {
          // .emptyFolderPlaceholder만 제외
          return folder.name !== ".emptyFolderPlaceholder";
        })
        .map(async (folder) => {
          try {
            // normal.png 파일이 존재하는지 확인
            const { data: fileExists, error: fileError } =
              await supabase.storage.from("images").list(folder.name, {
                limit: 1,
                search: "normal.png",
              });

            if (fileError) {
              return null;
            }

            if (!fileExists || fileExists.length === 0) {
              return null;
            }

            const { data } = supabase.storage
              .from("images")
              .getPublicUrl(`${folder.name}/normal.png`);

            if (!data || !data.publicUrl) {
              return null;
            }

            return {
              id: folder.name,
              name: folder.name.charAt(0).toUpperCase() + folder.name.slice(1),
              imageUrl: `${data.publicUrl}?t=${new Date().getTime()}`,
            };
          } catch (error) {
            return null;
          }
        })
    );

    // null 값 필터링
    const validCharacters = characters.filter(
      (char): char is NonNullable<typeof char> => char !== null
    );

    return validCharacters;
  } catch (error) {
    return [];
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
    // 모든 상태에 대한 이미지 URL 동시 요청
    const states: CharacterState[] = ["normal", "pooping", "success", "fail"];
    const imagePromises = states.map(async (state) => {
      try {
        return { state, url: await getCharacterImageUrl("default", state) };
      } catch (e) {
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

    return imageUrls;
  } catch (error) {
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
