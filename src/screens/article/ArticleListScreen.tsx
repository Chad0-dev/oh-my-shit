import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { ArticlesList } from "../../components/article/ArticlesList";
import { ArticleDetailModal } from "../../components/article/ArticleDetailModal";
import { Article } from "../../components/article/ArticleCard";
import { getArticles, clearArticlesCache } from "../../services/articleService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export const ArticleListScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isDetailModalVisible, setIsDetailModalVisible] =
    useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // 페이징 관련 상태
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 10;

  // 네트워크 상태 체크
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 컴포넌트가 화면에 포커싱될 때마다 데이터 로드
  useFocusEffect(
    useCallback(() => {
      fetchArticles(1, true);
    }, [])
  );

  // 게시글 가져오기 (페이징 구현)
  const fetchArticles = async (
    pageToLoad: number,
    isRefresh: boolean = false
  ) => {
    try {
      if (isRefresh) {
        setPage(1);
        setRefreshing(true);
      } else if (pageToLoad === 1) {
        setLoading(true);
      }

      setError(null);

      // 오프라인 상태에서는 캐시된 데이터만 사용
      const {
        articles: newArticles,
        totalCount: total,
        hasMore: more,
      } = await getArticles(
        pageToLoad,
        pageSize,
        isRefresh // 새로고침 시 강제 새로고침
      );

      if (isRefresh || pageToLoad === 1) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }

      setTotalCount(total);
      setHasMore(more);
      setPage(pageToLoad);
    } catch (error) {
      console.error("게시글 로드 오류:", error);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 더 많은 게시글 로드
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchArticles(page + 1);
    }
  };

  // 새로고침
  const handleRefresh = async () => {
    // 캐시 초기화 후 새로고침
    await clearArticlesCache();
    fetchArticles(1, true);
  };

  // 게시글 선택
  const handleArticlePress = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailModalVisible(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#3D4127" : "#FFFFFF" },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          건강 정보
        </Text>
      </View>

      {isOffline && (
        <View
          style={[
            styles.offlineBar,
            { backgroundColor: isDark ? "#664d00" : "#fff3cd" },
          ]}
        >
          <Text
            style={[
              styles.offlineText,
              { color: isDark ? "#ffffff" : "#856404" },
            ]}
          >
            오프라인 모드입니다. 일부 기능이 제한될 수 있습니다.
          </Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            {error}
          </Text>
        </View>
      ) : (
        <ArticlesList
          articles={articles}
          loading={loading}
          onArticlePress={handleArticlePress}
          onEndReached={handleLoadMore}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      {selectedArticle && (
        <ArticleDetailModal
          visible={isDetailModalVisible}
          article={selectedArticle}
          onClose={handleCloseModal}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  offlineBar: {
    padding: 10,
    alignItems: "center",
  },
  offlineText: {
    fontSize: 14,
  },
});
