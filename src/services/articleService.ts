import { supabase } from "../supabase/client";
import { Article } from "../components/article/ArticleCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase에서 반환되는 건강 정보 게시글 타입
interface HealthArticleRecord {
  id: number;
  keyword: string;
  title: string;
  content: string;
  source?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

// 캐싱 관련 키
const ARTICLES_CACHE_KEY = "articles_cache";
const ARTICLES_CACHE_EXPIRY_KEY = "articles_cache_expiry";
const ARTICLES_CACHE_VERSION_KEY = "articles_cache_version";
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1시간
const CACHE_VERSION = "1.0"; // 캐시 버전 - API 응답 구조가 변경되면 이 값을 변경

// 페이징 기본 값
const DEFAULT_PAGE_SIZE = 10;

// Supabase 인증 오류 로깅 및 처리
const handleSupabaseError = (error: any, operation: string) => {
  if (error?.message?.includes("Invalid Refresh Token")) {
    // 인증 토큰 오류 처리
    return true;
  }
  return false;
};

// 캐싱된 데이터인지 확인하는 함수
const isCacheValid = async (): Promise<boolean> => {
  try {
    // 캐시 버전 확인
    const cacheVersion = await AsyncStorage.getItem(ARTICLES_CACHE_VERSION_KEY);
    if (cacheVersion !== CACHE_VERSION) {
      return false;
    }

    // 캐시 만료 시간 확인
    const expiryTimeStr = await AsyncStorage.getItem(ARTICLES_CACHE_EXPIRY_KEY);
    if (!expiryTimeStr) return false;

    const expiryTime = parseInt(expiryTimeStr, 10);
    return Date.now() < expiryTime;
  } catch (error) {
    console.error("캐시 유효성 확인 오류:", error);
    return false;
  }
};

// 캐시 저장 함수
const saveCache = async (data: any): Promise<void> => {
  try {
    const expiryTime = Date.now() + CACHE_EXPIRY_MS;
    await AsyncStorage.setItem(ARTICLES_CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(
      ARTICLES_CACHE_EXPIRY_KEY,
      expiryTime.toString()
    );
    await AsyncStorage.setItem(ARTICLES_CACHE_VERSION_KEY, CACHE_VERSION);
  } catch (error) {
    console.error("캐시 저장 오류:", error);
  }
};

// 캐시 가져오기 함수
const getCache = async (): Promise<any | null> => {
  try {
    const isValid = await isCacheValid();
    if (!isValid) return null;

    const cachedDataStr = await AsyncStorage.getItem(ARTICLES_CACHE_KEY);
    if (!cachedDataStr) return null;

    return JSON.parse(cachedDataStr);
  } catch (error) {
    console.error("캐시 가져오기 오류:", error);
    return null;
  }
};

// 캐시 초기화 함수
export const clearArticlesCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ARTICLES_CACHE_KEY);
    await AsyncStorage.removeItem(ARTICLES_CACHE_EXPIRY_KEY);
  } catch (error) {
    console.error("캐시 초기화 오류:", error);
  }
};

/**
 * 아티클 목록을 가져오는 함수 (페이징 및 캐싱 지원)
 * @param page 페이지 번호 (1부터 시작)
 * @param pageSize 페이지당 항목 수
 * @param forceRefresh 강제 새로고침 여부
 * @returns 아티클 목록과 페이징 정보
 */
export const getArticles = async (
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  forceRefresh = false
): Promise<{
  articles: any[];
  totalCount: number;
  hasMore: boolean;
}> => {
  try {
    // 캐시 확인 (강제 새로고침이 아닌 경우)
    if (!forceRefresh) {
      const cachedData = await getCache();
      if (
        cachedData &&
        cachedData.page === page &&
        cachedData.pageSize === pageSize
      ) {
        return cachedData;
      }
    }

    // 시작 인덱스 계산
    const startIndex = (page - 1) * pageSize;

    // 총 개수 가져오기
    const { count, error: countError } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    const totalCount = count || 0;

    // 페이지별 데이터 가져오기
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(startIndex, startIndex + pageSize - 1);

    if (error) throw error;

    const result = {
      articles: data || [],
      totalCount,
      hasMore: startIndex + pageSize < totalCount,
      page,
      pageSize,
    };

    // 캐시 저장
    await saveCache(result);

    return result;
  } catch (error) {
    console.error("아티클 목록 가져오기 오류:", error);
    throw error;
  }
};

// 모든 건강 정보 게시글 가져오기
export const getAllHealthArticles = async (): Promise<Article[] | null> => {
  try {
    const { data, error } = await supabase
      .from("health_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("건강 정보 게시글 조회 오류:", error);
      return null;
    }

    // Supabase에서 가져온 데이터를 Article 인터페이스에 맞게 변환
    return data.map((article: HealthArticleRecord) => ({
      id: article.id,
      keyword: article.keyword,
      date: new Date(article.created_at).toISOString().split("T")[0], // YYYY-MM-DD 형식
      title: article.title,
      content: article.content,
      views: article.views,
      source: article.source,
    }));
  } catch (error) {
    console.error("건강 정보 게시글 조회 중 예외 발생:", error);
    return null;
  }
};

// 키워드별 건강 정보 게시글 가져오기
export const getHealthArticlesByKeyword = async (
  keyword: string
): Promise<Article[] | null> => {
  try {
    if (keyword === "전체") {
      return getAllHealthArticles();
    }

    const { data, error } = await supabase
      .from("health_articles")
      .select("*")
      .eq("keyword", keyword)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`${keyword} 키워드 게시글 조회 오류:`, error);
      return null;
    }

    return data.map((article: HealthArticleRecord) => ({
      id: article.id,
      keyword: article.keyword,
      date: new Date(article.created_at).toISOString().split("T")[0],
      title: article.title,
      content: article.content,
      views: article.views,
      source: article.source,
    }));
  } catch (error) {
    console.error(`${keyword} 키워드 게시글 조회 중 예외 발생:`, error);
    return null;
  }
};

// 페이지네이션이 적용된 건강 정보 게시글 가져오기
export const getHealthArticlesPaginated = async (
  page: number = 1,
  pageSize: number = 10,
  keyword?: string
): Promise<{ articles: Article[] | null; hasMore: boolean; total: number }> => {
  try {
    let query = supabase
      .from("health_articles")
      .select("*", { count: "exact" });

    // 키워드 필터 적용
    if (keyword && keyword !== "전체") {
      query = query.eq("keyword", keyword);
    }

    // 페이지네이션 및 정렬 적용
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      const isAuthError = handleSupabaseError(
        error,
        "페이지네이션 게시글 조회"
      );
      return { articles: null, hasMore: false, total: 0 };
    }

    const articles = data.map((article: HealthArticleRecord) => ({
      id: article.id,
      keyword: article.keyword,
      date: new Date(article.created_at).toISOString().split("T")[0],
      title: article.title,
      content: article.content,
      views: article.views,
      source: article.source,
    }));

    const hasMore = count !== null ? from + pageSize < count : false;

    return { articles, hasMore, total: count || 0 };
  } catch (error) {
    return { articles: null, hasMore: false, total: 0 };
  }
};

// 특정 게시글의 조회수 증가
export const incrementArticleViews = async (
  articleId: number
): Promise<boolean> => {
  try {
    // 현재 조회수 가져오기
    const { data: currentData, error: fetchError } = await supabase
      .from("health_articles")
      .select("views")
      .eq("id", articleId)
      .single();

    if (fetchError) {
      handleSupabaseError(fetchError, "게시글 조회수 조회");
      return false;
    }

    // 조회수 업데이트
    const { error: updateError } = await supabase
      .from("health_articles")
      .update({ views: (currentData.views || 0) + 1 })
      .eq("id", articleId);

    if (updateError) {
      handleSupabaseError(updateError, "게시글 조회수 업데이트");
      return false;
    }

    return true;
  } catch (error) {
    console.error("게시글 조회수 업데이트 중 예외 발생:", error);
    return false;
  }
};

// 데이터베이스에서 사용 가능한 키워드 목록 가져오기
export const getAvailableKeywords = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("health_articles")
      .select("keyword")
      .order("keyword");

    if (error) {
      console.error("키워드 조회 오류:", error);
      return ["전체"];
    }

    // 중복 제거하여 고유한 키워드 배열 반환
    const uniqueKeywords = [
      "전체",
      ...new Set(data.map((item) => item.keyword)),
    ];
    return uniqueKeywords;
  } catch (error) {
    console.error("키워드 조회 중 예외 발생:", error);
    return ["전체"];
  }
};
