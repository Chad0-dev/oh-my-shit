import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "../../stores/themeStore";

export interface Article {
  id: number;
  keyword: string;
  date: string;
  title: string;
  content: string;
  views: number;
  source?: string;
}

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onPress,
}) => {
  const { isDark } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF" },
      ]}
      onPress={() => onPress(article)}
    >
      <View style={styles.header}>
        <Text
          style={[styles.idText, { color: isDark ? "#BAC095" : "#636B2F" }]}
        >
          No.{article.id}
        </Text>
        <Text
          style={[
            styles.keywordText,
            { color: isDark ? "#BAC095" : "#636B2F" },
          ]}
        >
          {article.keyword}
        </Text>
        <Text
          style={[styles.dateText, { color: isDark ? "#A0A0A0" : "#666666" }]}
        >
          {article.date}
        </Text>
      </View>

      <Text
        style={[styles.titleText, { color: isDark ? "#FFFFFF" : "#000000" }]}
        numberOfLines={1}
      >
        {article.title}
      </Text>

      <Text
        style={[styles.contentText, { color: isDark ? "#CCCCCC" : "#666666" }]}
        numberOfLines={2}
      >
        {article.content}
      </Text>

      <View style={styles.footer}>
        <Text
          style={[styles.viewsText, { color: isDark ? "#A0A0A0" : "#999999" }]}
        >
          조회수 {article.views}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 6,
    marginHorizontal: 0,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  idText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(186, 192, 149, 0.2)",
  },
  dateText: {
    fontSize: 12,
    marginLeft: "auto",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  viewsText: {
    fontSize: 12,
  },
});
