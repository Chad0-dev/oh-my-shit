import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { Ionicons } from "@expo/vector-icons";

// 아이콘 타입을 명시적으로 지정
type IconName = React.ComponentProps<typeof Ionicons>["name"];

export const ManualScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  // 기능별 매뉴얼 항목
  const manualSections = [
    {
      title: "배변 기록",
      icon: "water-outline" as IconName,
      items: [
        "홈 화면에서 + 버튼을 눌러 배변 시간을 체크 할수 있습니다.",
        "배변양과 상태를 선택하여 메모와 함께 기록할 수 있습니다.",
        "기록된 데이터는 캘린더와 통계 화면에서 확인할 수 있습니다.",
      ],
    },
    {
      title: "건강 정보",
      icon: "newspaper-outline" as IconName,
      items: [
        "건강 정보 탭에서 다양한 건강 관련 게시글을 확인할 수 있습니다.",
        "키워드별로 게시글을 필터링하여 원하는 정보를 찾을 수 있습니다.",
        "게시글을 클릭하면 상세 내용을 모달 창으로 확인할 수 있습니다.",
      ],
    },
    {
      title: "통계 보기",
      icon: "stats-chart" as IconName,
      items: [
        "통계 탭에서 자신의 배변 패턴을 그래프로 확인할 수 있습니다.",
        "주간, 월간, 년 단위로 배변 상태를 분석할 수 있습니다.",
        "시간대별 배변 패턴을 확인하여 생활 습관 개선에 활용할 수 있습니다.",
      ],
    },
    {
      title: "캘린더",
      icon: "calendar-outline" as IconName,
      items: [
        "캘린더 탭에서 날짜별 배변 기록을 한눈에 확인할 수 있습니다.",
        "특정 날짜를 선택하면 해당 날짜의 상세 기록을 볼 수 있습니다.",
        "누락된 기록도 직접 입력 할수 있습니다.",
      ],
    },
    {
      title: "설정",
      icon: "settings-outline" as IconName,
      items: ["설정 메뉴에서 다크 모드를 활성화/비활성화할 수 있습니다."],
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          설명서
        </Text>
        <Text
          style={[styles.subtitle, { color: isDark ? "#BBBBBB" : "#666666" }]}
        >
          앱 기능 사용 방법 안내
        </Text>
      </View>

      {/* 앱 소개 */}
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
            앱 소개
          </Text>
        </View>
        <Text
          style={[styles.cardText, { color: isDark ? "#BBBBBB" : "#666666" }]}
        >
          Oh My Poop 앱은 당신의 배변 활동을 기록하고 건강 상태를 모니터링하여
          더 건강한 생활 습관을 형성하도록 도와주는 앱입니다. 일상적인 배변
          활동을 추적하고, 관련 건강 정보를 확인하세요.
        </Text>
      </View>

      {/* 기능별 매뉴얼 섹션 */}
      {manualSections.map((section, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name={section.icon} size={24} color="#636B2F" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {section.title}
            </Text>
          </View>

          <View style={styles.itemsContainer}>
            {section.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text
                  style={[
                    styles.bulletPoint,
                    { color: isDark ? "#BBBBBB" : "#666666" },
                  ]}
                >
                  •
                </Text>
                <Text
                  style={[
                    styles.itemText,
                    { color: isDark ? "#BBBBBB" : "#666666" },
                  ]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* 도움말 */}
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
            도움말
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          <View style={styles.itemRow}>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              앱 사용 중 문제가 발생하면 설정 &gt; 도움말 메뉴를 참고하세요.
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              건강 정보는 참고용이며, 전문적인 의료 조언을 대체할 수 없습니다.
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.itemText,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              개인정보는 안전하게 보호되며, 사용자 동의 없이 외부로 공유되지
              않습니다.
            </Text>
          </View>
        </View>
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <Text
          style={[styles.footerText, { color: isDark ? "#BBBBBB" : "#666666" }]}
        >
          © 2025 Oh My Poop. All rights reserved.
        </Text>
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
    marginBottom: 16,
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
  itemsContainer: {
    marginTop: 12,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  bulletPoint: {
    marginRight: 8,
    fontSize: 16,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    marginVertical: 16,
  },
  footerText: {
    fontSize: 14,
  },
});
