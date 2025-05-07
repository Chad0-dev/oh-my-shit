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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
          Oh My Sh!t
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

      {/* 팀 정보 */}
      <View style={styles.section}>
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
          OhMySh!t.dev
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
          onPress={() => openLink("mailto:ohmyshit.dev@gmail.com")}
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
            ohmyshit.dev@gmail.com
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink("https://instagram.com/ohmyshit")}
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
            @ohmyshit
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
          © {currentYear} Oh My Sh!t. All Rights Reserved.
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
});
