import { supabase } from "../supabase/client";
import { Article } from "../components/article/ArticleCard";

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

// Supabase 인증 오류 로깅 및 처리
const handleSupabaseError = (error: any, operation: string) => {
  if (error?.message?.includes("Invalid Refresh Token")) {
    console.warn(`인증 토큰 오류 (${operation}):`, error.message);
    // 필요 시 여기에 세션 초기화나 리로그인 로직 추가
    return true;
  }
  console.error(`Supabase 오류 (${operation}):`, error);
  return false;
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
      // 인증 오류여도 기본 응답 반환
      return { articles: null, hasMore: false, total: 0 };
    }

    console.log("Supabase에서 받은 원본 데이터:", data); // 원본 데이터 로그

    const articles = data.map((article: HealthArticleRecord) => ({
      id: article.id,
      keyword: article.keyword,
      date: new Date(article.created_at).toISOString().split("T")[0],
      title: article.title,
      content: article.content,
      views: article.views,
      source: article.source,
    }));

    console.log("변환된 게시물 첫번째 항목:", articles[0]); // 변환된 게시물 첫 번째 항목 확인

    // 더 많은 데이터가 있는지 확인
    const hasMore = count !== null ? from + pageSize < count : false;

    return { articles, hasMore, total: count || 0 };
  } catch (error) {
    console.error("페이지네이션 게시글 조회 중 예외 발생:", error);
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
