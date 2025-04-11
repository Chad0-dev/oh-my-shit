import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { getAvailableKeywords } from "../../services/articleService";

interface KeywordFilterProps {
  onSelectKeyword: (keyword: string) => void;
}

export const KeywordFilter: React.FC<KeywordFilterProps> = ({
  onSelectKeyword,
}) => {
  const { isDark } = useThemeStore();
  const [selectedKeyword, setSelectedKeyword] = useState("전체");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      setLoading(true);
      const availableKeywords = await getAvailableKeywords();
      setKeywords(availableKeywords);
    } catch (error) {
      console.error("키워드 로드 오류:", error);
      setKeywords(["전체"]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordPress = (keyword: string) => {
    setSelectedKeyword(keyword);
    onSelectKeyword(keyword);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={isDark ? "#BAC095" : "#636B2F"}
        />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {keywords.map((keyword, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.keywordButton,
            selectedKeyword === keyword
              ? { backgroundColor: "#636B2F" }
              : { backgroundColor: isDark ? "#333333" : "#D4DE95" },
          ]}
          onPress={() => handleKeywordPress(keyword)}
        >
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.keywordText,
                selectedKeyword === keyword
                  ? { color: "#FFFFFF" }
                  : { color: isDark ? "#FFFFFF" : "#333333" },
              ]}
            >
              {keyword}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  scrollView: {
    height: 60,
    maxHeight: 60,
  },
  keywordButton: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  keywordText: {
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 60,
    justifyContent: "center",
  },
});
