import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { Article } from "./ArticleCard";
import { Ionicons } from "@expo/vector-icons";

interface ArticleDetailModalProps {
  article: Article | null;
  visible: boolean;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  visible,
  onClose,
}) => {
  const { isDark } = useThemeStore();

  if (!article) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.modalContainer,
          {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF" },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text
                style={[
                  styles.keyword,
                  { color: isDark ? "#BAC095" : "#636B2F" },
                ]}
              >
                {article.keyword}
              </Text>
              <Text
                style={[styles.date, { color: isDark ? "#A0A0A0" : "#666666" }]}
              >
                {article.date}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <Text
              style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}
            >
              {article.title}
            </Text>
            <Text
              style={[
                styles.content,
                { color: isDark ? "#CCCCCC" : "#333333" },
              ]}
            >
              {article.content}
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            {article.source && (
              <Text
                style={[
                  styles.source,
                  {
                    color: isDark ? "#A0A0A0" : "#999999",
                    textDecorationLine: "underline",
                  },
                ]}
                onPress={() =>
                  console.log("Source link pressed:", article.source)
                }
              >
                출처: {article.source}
              </Text>
            )}
            <Text
              style={[styles.views, { color: isDark ? "#A0A0A0" : "#999999" }]}
            >
              조회수 {article.views}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  keyword: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(186, 192, 149, 0.2)",
    marginRight: 10,
  },
  date: {
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  views: {
    fontSize: 12,
  },
  source: {
    fontSize: 12,
  },
});
