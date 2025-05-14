import { Image } from "expo-image";
import { getCharacterImageUrl, CharacterState } from "./characterService";
import { getAvailableCharacters } from "./characterService";
import { Platform, Dimensions } from "react-native";

// 로깅을 위한 설정 - 항상 false로 설정하여 로그 출력 방지
const DEBUG = false;

// 디바이스 화면 크기 기반 이미지 크기 최적화
const { width, height } = Dimensions.get("window");
const isTablet = width > 768;

// 이미지 크기 계산 - 디바이스 크기에 따라 다른 크기 사용
const getOptimalImageSize = () => {
  if (isTablet) {
    return "large"; // 타블렛
  } else if (width >= 400) {
    return "medium"; // 큰 폰
  } else {
    return "small"; // 작은 폰
  }
};

// 최적의 이미지 포맷 반환 (WebP 지원 확인)
const getOptimalImageFormat = () => {
  // iOS 14+, Android 모두 WebP 지원
  return "webp";
};

/**
 * 디버깅 로그를 출력하는 함수 (콘솔 출력 없음)
 */
const logDebug = (message: string, data?: any) => {
  // DEBUG가 false라서 로그가 출력되지 않음
};

/**
 * 이미지 URL에 최적화 매개변수 추가
 * @param url 원본 이미지 URL
 * @returns 최적화된 이미지 URL
 */
export const optimizeImageUrl = (url: string): string => {
  if (!url || !url.includes("supabase")) return url;

  const size = getOptimalImageSize();
  const format = getOptimalImageFormat();

  // URL 매개변수 없는 경우 ? 추가, 있는 경우 & 추가
  const separator = url.includes("?") ? "&" : "?";

  // width, quality, format 매개변수 추가
  let optimizedUrl = `${url}${separator}size=${size}&format=${format}`;

  // WebP 품질 설정 (85%는 대부분의 경우 좋은 압축률과 품질의 균형)
  if (format === "webp") {
    optimizedUrl += "&quality=85";
  }

  return optimizedUrl;
};

/**
 * 캐릭터 상태 이미지를 사전 로드하는 함수
 * @param characterId 캐릭터 ID
 * @param states 로드할 상태 목록 (기본값: 모든 상태)
 * @returns 로드된 이미지 URL 목록
 */
export const preloadCharacterStateImages = async (
  characterId: string,
  states: CharacterState[] = ["normal", "pooping", "success", "fail"]
): Promise<Record<CharacterState, string>> => {
  const imageUrls: Record<CharacterState, string> = {} as Record<
    CharacterState,
    string
  >;

  try {
    // 모든 상태에 대한 이미지 URL을 병렬로 가져오기
    const promises = states.map(async (state) => {
      try {
        const url = await getCharacterImageUrl(characterId, state);
        // 최적화된 URL 반환
        const optimizedUrl = optimizeImageUrl(url);
        return { state, url: optimizedUrl };
      } catch (error) {
        // 조용히 실패 처리
        return { state, url: "" };
      }
    });

    // 모든 Promise 완료 대기
    const results = await Promise.all(promises);

    // 결과 처리
    results.forEach(({ state, url }) => {
      imageUrls[state] = url;

      // expo-image의 prefetch 메소드를 사용하여 이미지 사전 로드 (캐시)
      if (url) {
        Image.prefetch(url).catch(() => {
          // 실패 시 조용히 넘어감
        });
      }
    });

    return imageUrls;
  } catch (error) {
    // 조용히 오류 처리
    return imageUrls;
  }
};

/**
 * 모든 캐릭터의 기본(normal) 이미지를 사전 로드하는 함수
 * @returns 로드 성공 여부
 */
export const preloadAllCharactersBasicImages = async (): Promise<boolean> => {
  try {
    // 사용 가능한 모든 캐릭터 가져오기
    const characters = await getAvailableCharacters();

    if (characters.length === 0) {
      return false;
    }

    // 각 캐릭터의 기본 이미지 prefetch 요청
    const prefetchPromises = characters.map(async (character) => {
      if (character.imageUrl) {
        try {
          // 최적화된 URL로 프리페치
          const optimizedUrl = optimizeImageUrl(character.imageUrl);
          await Image.prefetch(optimizedUrl);
          return true;
        } catch (error) {
          // 조용히 실패 처리
          return false;
        }
      }
      return false;
    });

    // 모든 prefetch 요청 대기
    const results = await Promise.all(prefetchPromises);

    // 모든 이미지가 성공적으로 로드되었는지 확인
    const allSuccess = results.every((result) => result);

    return allSuccess;
  } catch (error) {
    // 조용히 오류 처리
    return false;
  }
};

/**
 * 앱 시작 시 필요한 모든 이미지를 사전 로드하는 함수
 * @param currentCharacterId 현재 선택된 캐릭터 ID
 * @returns 로드 성공 여부
 */
export const preloadAppImages = async (
  currentCharacterId: string = "basic"
): Promise<boolean> => {
  try {
    // 1. 현재 선택된 캐릭터의 모든 상태 이미지 로드
    await preloadCharacterStateImages(currentCharacterId);

    // 2. 다른 캐릭터들의 기본 이미지 로드 (백그라운드에서)
    setTimeout(() => {
      preloadAllCharactersBasicImages().catch(() => {
        // 실패 시 조용히 넘어감
      });
    }, 3000); // 3초 후 백그라운드에서 로드 시작

    return true;
  } catch (error) {
    // 조용히 오류 처리
    return false;
  }
};

/**
 * 블러 처리된 이미지 URL을 생성하는 함수
 * @param url 원본 이미지 URL
 * @returns 블러 처리된 이미지 URL
 */
export const getBlurredImageUrl = (url: string): string => {
  if (!url || !url.includes("supabase")) return url;

  const separator = url.includes("?") ? "&" : "?";
  // 작은 크기(32px)와 블러 효과를 가진 썸네일 URL 생성
  return `${url}${separator}width=32&blur=10&quality=30`;
};
