import React from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  RefreshControl,
  Dimensions,
} from "react-native";
import { ArticleCard, Article } from "./ArticleCard";
import { useThemeStore } from "../../stores/themeStore";

interface ArticlesListProps {
  articles: Article[];
  loading: boolean;
  onArticlePress: (article: Article) => void;
  onEndReached: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  loading,
  onArticlePress,
  onEndReached,
  onRefresh,
  refreshing = false,
}) => {
  const { isDark } = useThemeStore();
  const { height } = Dimensions.get("window");

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={isDark ? "#BAC095" : "#636B2F"}
        />
      </View>
    );
  };

  const renderEmptyList = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[styles.emptyText, { color: isDark ? "#A0A0A0" : "#666666" }]}
        >
          게시물이 없습니다
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={articles}
      keyExtractor={(item, index) => `article-${item.id}-${index}`}
      renderItem={({ item }) => (
        <ArticleCard article={item} onPress={onArticlePress} />
      )}
      contentContainerStyle={[
        styles.listContainer,
        articles.length === 0 && styles.emptyListContainer,
      ]}
      style={styles.flatList}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyList}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDark ? "#BAC095" : "#636B2F"]}
            tintColor={isDark ? "#BAC095" : "#636B2F"}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 16,
    alignItems: "center",
  },
  flatList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  listContainer: {
    paddingTop: 0,
    paddingBottom: 20,
  },
});
