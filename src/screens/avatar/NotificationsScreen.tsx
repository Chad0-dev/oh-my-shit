import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

export const NotificationsScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const currentYear = new Date().getFullYear();

  // 외부 링크 열기
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("URL을 열 수 없습니다:", err)
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#3D4127" : "#FFFFFF" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
        앱 정보
      </Text>

      {/* 앱 소개 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          Oh My Poop
        </Text>
        <Text
          style={[styles.version, { color: isDark ? "#CCCCCC" : "#666666" }]}
        >
          버전 1.0.0
        </Text>
        <Text
          style={[
            styles.description,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          올바른 배변 습관을 위한 앱입니다.
        </Text>

        <View style={styles.featureItem}>
          <Ionicons
            name="timer-outline"
            size={16}
            color={isDark ? "#CCCCCC" : "#636B2F"}
            style={styles.featureIcon}
          />
          <Text
            style={[
              styles.featureText,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            타이머를 이용해 너무 오래 앉아 있지 않도록 도와줍니다.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={isDark ? "#CCCCCC" : "#636B2F"}
            style={styles.featureIcon}
          />
          <Text
            style={[
              styles.featureText,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            캘린더를 통해 나의 배변 컨디션을 확인할 수 있습니다.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons
            name="book-outline"
            size={16}
            color={isDark ? "#CCCCCC" : "#636B2F"}
            style={styles.featureIcon}
          />
          <Text
            style={[
              styles.featureText,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            배변 활동에 관한 유용한 정보와 지식을 제공합니다.
          </Text>
        </View>
      </View>

      {/* 건강 관련 면책 조항 */}
      <View
        style={[
          styles.section,
          {
            marginTop: 10,
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(99, 107, 47, 0.4)"
              : "rgba(99, 107, 47, 0.3)",
            borderRadius: 8,
            padding: 10,
            backgroundColor: isDark
              ? "rgba(99, 107, 47, 0.1)"
              : "rgba(99, 107, 47, 0.05)",
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? "#FFFFFF" : "#636B2F",
              fontSize: 20,
            },
          ]}
        >
          건강 정보 면책 조항
        </Text>

        <View
          style={[
            styles.disclaimerBox,
            {
              backgroundColor: isDark
                ? "rgba(99, 107, 47, 0.2)"
                : "rgba(99, 107, 47, 0.1)",
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(99, 107, 47, 0.4)"
                : "rgba(99, 107, 47, 0.3)",
            },
          ]}
        >
          <FontAwesome
            name="exclamation-triangle"
            size={20}
            color={isDark ? "#CCCCCC" : "#636B2F"}
            style={styles.disclaimerIcon}
          />
          <Text
            style={[
              styles.disclaimerText,
              {
                color: isDark ? "#FFFFFF" : "#636B2F",
                fontWeight: "bold",
              },
            ]}
          >
            이 앱은 의학적 조언을 제공하지 않습니다. 앱에서 제공하는 정보는 건강
            상태에 대한 전문적인 진단이나 치료를 대체할 수 없습니다.
          </Text>
        </View>

        <View style={[styles.featureItem, { marginTop: 10 }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={isDark ? "#CCCCCC" : "#636B2F"}
            style={styles.featureIcon}
          />
          <Text
            style={[
              styles.featureText,
              {
                color: isDark ? "#DDDDDD" : "#333333",
                fontWeight: "500",
              },
            ]}
          >
            심각한 건강 문제나 지속적인 증상이 있는 경우 의사와 상담하시기
            바랍니다.
          </Text>
        </View>

        <View style={[styles.featureItem, { marginTop: 5 }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={isDark ? "#CCCCCC" : "#636B2F"}
            style={styles.featureIcon}
          />
          <Text
            style={[
              styles.featureText,
              {
                color: isDark ? "#DDDDDD" : "#333333",
                fontWeight: "500",
              },
            ]}
          >
            본 앱은 배변 습관을 추적하고 통계를 제공하기 위한 목적으로만
            사용됩니다.
          </Text>
        </View>
      </View>

      {/* 팀 정보 */}
      <View style={[styles.section, { marginTop: 15 }]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          개발팀
        </Text>
        <Text
          style={[
            styles.description,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          OhMyPoop.dev
        </Text>
        <View style={styles.teamMember}>
          <MaterialCommunityIcons
            name="account"
            size={18}
            color={isDark ? "#CCCCCC" : "#636B2F"}
          />
          <Text
            style={[
              styles.memberInfo,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            기획 및 디자인: Chad
          </Text>
        </View>
        <View style={styles.teamMember}>
          <MaterialCommunityIcons
            name="code-tags"
            size={18}
            color={isDark ? "#CCCCCC" : "#636B2F"}
          />
          <Text
            style={[
              styles.memberInfo,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            개발: Chad
          </Text>
        </View>
      </View>

      {/* 연락처 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          문의하기
        </Text>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink("mailto:ohmypoop.dev@gmail.com")}
        >
          <Ionicons
            name="mail"
            size={18}
            color={isDark ? "#CCCCCC" : "#636B2F"}
          />
          <Text
            style={[
              styles.contactText,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            ohmypoop.dev@gmail.com
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink("https://instagram.com/ohmypoop")}
        >
          <Ionicons
            name="logo-instagram"
            size={18}
            color={isDark ? "#CCCCCC" : "#636B2F"}
          />
          <Text
            style={[
              styles.contactText,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            @ohmypoop
          </Text>
        </TouchableOpacity>
      </View>

      {/* 저작권 정보 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          저작권 정보
        </Text>
        <Text
          style={[styles.copyright, { color: isDark ? "#DDDDDD" : "#333333" }]}
        >
          © {currentYear} Oh My Poop. All Rights Reserved.
        </Text>
        <Text
          style={[
            styles.description,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          이 앱에 포함된 모든 콘텐츠와 자료는 저작권법에 의해 보호받습니다.
          콘텐츠의 무단 복제, 배포, 수정 및 재사용은 금지되어 있습니다.
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  version: {
    fontSize: 14,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  teamMember: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  memberInfo: {
    fontSize: 14,
    marginLeft: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 10,
    textDecorationLine: "underline",
  },
  copyright: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  disclaimerBox: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    marginTop: 5,
  },
  disclaimerIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: "500",
  },
});
