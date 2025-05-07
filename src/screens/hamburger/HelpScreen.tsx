import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { Ionicons } from "@expo/vector-icons";

// 아이콘 타입 지정
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface FaqItem {
  question: string;
  answer: string;
  expanded?: boolean;
}

export const HelpScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      question: "배변 기록을 삭제하는 방법은 무엇인가요?",
      answer:
        "캘린더에서 지우고 싶은 날짜를 선택하고, 삭제를 원하는 기록 옆의 휴지통 아이콘을 선택하면 기록이 삭제됩니다.",
      expanded: false,
    },
    {
      question: "통계가 정확하지 않게 보여요. 왜 그런가요?",
      answer:
        "통계는 사용자가 입력한 데이터를 기반으로 계산됩니다. 정확한 통계를 위해 꾸준히 기록을 유지하는 것이 중요합니다. 데이터가 부족하면 통계가 정확하지 않을 수 있습니다. 최소 2주 이상의 데이터가 있으면 더 정확한 통계를 확인할 수 있습니다.",
      expanded: false,
    },
    {
      question: "알림 설정은 어디서 변경할 수 있나요?",
      answer: "알림 기능은 준비중 입니다. 지금은 알림을 받지 않습니다.",
      expanded: false,
    },
    {
      question: "앱에 입력한 개인 데이터는 어떻게 보호되나요?",
      answer:
        "Oh My Sh!t 앱은 사용자의 개인정보 보호를 최우선으로 생각합니다. 사용자의 명시적인 동의 없이는 외부로 전송되지 않습니다. 또한 암호화 기술을 사용하여 데이터를 안전하게 보호합니다.",
      expanded: false,
    },
  ]);

  const toggleExpand = (index: number) => {
    const updatedFaqItems = [...faqItems];
    updatedFaqItems[index].expanded = !updatedFaqItems[index].expanded;
    setFaqItems(updatedFaqItems);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#3D4127" : "#FFFFFF" },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          도움말
        </Text>
        <Text
          style={[styles.subtitle, { color: isDark ? "#BBBBBB" : "#666666" }]}
        >
          자주 묻는 질문과 문제 해결 방법
        </Text>
      </View>

      {/* 도움말 소개 섹션 */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color="#636B2F" />
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            도움말 안내
          </Text>
        </View>

        <Text
          style={[styles.cardText, { color: isDark ? "#BBBBBB" : "#666666" }]}
        >
          Oh My Sh!t 앱 사용 중 궁금한 점이나 문제가 있으신가요? 아래 자주 묻는
          질문에서 해결책을 찾아보세요.
        </Text>
      </View>

      {/* FAQ 섹션 */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="help-circle" size={24} color="#636B2F" />
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            자주 묻는 질문 (FAQ)
          </Text>
        </View>

        <View style={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleExpand(index)}
                style={styles.questionContainer}
              >
                <Text
                  style={[
                    styles.questionText,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {item.question}
                </Text>
                <Ionicons
                  name={item.expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#636B2F"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>

              {item.expanded && (
                <View style={styles.answerContainer}>
                  <Text
                    style={[
                      styles.answerText,
                      { color: isDark ? "#BBBBBB" : "#666666" },
                    ]}
                  >
                    {item.answer}
                  </Text>
                </View>
              )}

              {index < faqItems.length - 1 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: isDark ? "#444444" : "#DDDDDD" },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 문제 해결 팁 섹션 */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="construct" size={24} color="#636B2F" />
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            문제 해결 팁
          </Text>
        </View>

        <View style={styles.tipsContainer}>
          {[
            {
              title: "앱이 느리게 작동할 경우:",
              content:
                "캐시를 정리하거나 앱을 재시작해보세요. 설정 메뉴에서 데이터 관리로 이동한 후 캐시 정리를 통해 캐시를 지울 수 있습니다.",
            },
            {
              title: "알림이 오지 않는 경우:",
              content:
                "기기의 알림 설정을 확인하고, 앱에 알림 권한이 부여되어 있는지 확인하세요. 배터리 최적화 설정에서 앱이 제외되어 있는지도 확인해보세요.",
            },
            {
              title: "데이터가 표시되지 않는 경우:",
              content:
                "앱을 최신 버전으로 업데이트하고, 기기를 재부팅한 후 다시 시도해보세요.",
            },
            {
              title: "앱이 충돌하는 경우:",
              content:
                "앱을 완전히 종료한 후 다시 실행해보세요. 문제가 지속되면 앱을 재설치하는 것이 도움이 될 수 있습니다. 재설치 전에 데이터를 백업하는 것을 잊지 마세요.",
            },
          ].map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipHeader}>
                <Ionicons name="checkmark-circle" size={18} color="#636B2F" />
                <Text
                  style={[
                    styles.tipTitle,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {tip.title}
                </Text>
              </View>
              <Text
                style={[
                  styles.tipText,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                {tip.content}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Pattaya",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  faqContainer: {
    marginTop: 8,
  },
  faqItem: {
    marginBottom: 8,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  answerContainer: {
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipItem: {
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 26,
  },
});
