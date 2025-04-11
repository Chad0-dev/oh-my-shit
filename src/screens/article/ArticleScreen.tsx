import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { KeywordFilter } from "../../components/article/KeywordFilter";
import { ArticlesList } from "../../components/article/ArticlesList";
import { ArticleDetailModal } from "../../components/article/ArticleDetailModal";
import { Article } from "../../components/article/ArticleCard";
import {
  getHealthArticlesPaginated,
  incrementArticleViews,
} from "../../services/articleService";
import { checkSession } from "../../supabase/client";

export const ArticleScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("전체");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  // 이미 로드된 게시물 ID를 추적하기 위한 집합
  const loadedArticleIds = useRef(new Set<number>());

  // 초기 로드 시 로드된 게시물 ID 초기화
  const resetLoadedArticleIds = () => {
    loadedArticleIds.current = new Set<number>();
  };

  // 세션 상태 확인
  useEffect(() => {
    const verifySession = async () => {
      const hasSession = await checkSession();
      if (!hasSession) {
        console.log(
          "인증 세션이 없습니다. 로그인이 필요하지 않은 기능만 사용 가능합니다."
        );
      }
    };
    verifySession();
  }, []);

  // 게시물 데이터 초기 로드
  useEffect(() => {
    resetLoadedArticleIds();
    loadArticles(true);
  }, [selectedKeyword]);

  // 게시물 로드 (실제 데이터베이스)
  const loadArticles = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        // 키워드 변경 시 기존 게시물 초기화
        setArticles([]);
        resetLoadedArticleIds();
      } else {
        setLoadingMore(true);
      }

      const page = reset ? 1 : currentPage;
      const {
        articles: newArticles,
        hasMore: moreAvailable,
        total,
      } = await getHealthArticlesPaginated(page, 10, selectedKeyword);

      if (newArticles) {
        // 중복된 게시물 필터링
        const uniqueArticles = newArticles.filter((article) => {
          // 이미 로드된 게시물인지 확인
          if (loadedArticleIds.current.has(article.id)) {
            return false;
          }

          // 새 게시물 ID 추가
          loadedArticleIds.current.add(article.id);
          return true;
        });

        if (reset) {
          setArticles(uniqueArticles);
          setTotalArticles(total || 0);
        } else {
          setArticles((prevArticles) => [...prevArticles, ...uniqueArticles]);
        }

        // 고유한 게시물이 추가되지 않았으면 더 이상 불러올 항목이 없다고 판단
        const noMoreUniqueArticles = uniqueArticles.length === 0;
        setHasMore(moreAvailable && !noMoreUniqueArticles);

        if (!reset && !noMoreUniqueArticles) {
          setCurrentPage(page + 1);
        }
      }
    } catch (error: any) {
      console.error("게시물 로드 오류:", error);
      // 인증 오류일 경우 메시지 수정
      if (error.message?.includes("Invalid Refresh Token")) {
        Alert.alert("인증 오류", "세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        Alert.alert("오류", "게시물을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // 게시물 추가 로드 (무한 스크롤)
  const loadMoreArticles = () => {
    if (loadingMore || !hasMore || articles.length >= totalArticles) return;
    loadArticles(false);
  };

  // 새로고침 처리
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetLoadedArticleIds();
    loadArticles(true);
  }, [selectedKeyword]);

  // 키워드 선택 처리
  const handleKeywordSelect = (keyword: string) => {
    if (keyword === selectedKeyword) return;
    setSelectedKeyword(keyword);
  };

  // 게시물 선택 처리
  const handleArticlePress = async (article: Article) => {
    setSelectedArticle(article);
    setModalVisible(true);

    // 조회수 증가
    try {
      await incrementArticleViews(article.id);
    } catch (error) {
      console.error("조회수 증가 오류:", error);
    }
  };

  // 모달 닫기 처리
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5" },
      ]}
    >
      {/* 키워드 필터 */}
      <KeywordFilter onSelectKeyword={handleKeywordSelect} />

      {/* 게시물 목록 */}
      <View style={styles.articlesContainer}>
        <ArticlesList
          articles={articles}
          loading={loading || loadingMore}
          onArticlePress={handleArticlePress}
          onEndReached={loadMoreArticles}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>

      {/* 게시물 상세 모달 */}
      <ArticleDetailModal
        article={selectedArticle}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  articlesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
