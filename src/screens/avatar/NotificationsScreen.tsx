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
        { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
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
          화장실에서 더 효율적이고 즐거운 시간을 보낼 수 있도록 도와주는
          앱입니다. 타이머 기능과 통계를 통해 당신의 화장실 습관을 개선하세요.
        </Text>
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
          화장실팀 일동
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
            기획 및 디자인: 화장실 기획팀
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
            개발: 화장실 개발팀
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
          onPress={() => openLink("mailto:support@ohmyshit.com")}
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
            support@ohmyshit.com
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink("https://ohmyshit.com")}
        >
          <Ionicons
            name="globe"
            size={18}
            color={isDark ? "#CCCCCC" : "#636B2F"}
          />
          <Text
            style={[
              styles.contactText,
              { color: isDark ? "#DDDDDD" : "#333333" },
            ]}
          >
            www.ohmyshit.com
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

      {/* 오픈소스 라이센스 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          오픈소스 라이센스
        </Text>
        <Text
          style={[
            styles.description,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          이 앱은 다음과 같은 오픈소스 라이브러리를 사용합니다:
        </Text>
        <Text
          style={[
            styles.licenseItem,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          • React Native
        </Text>
        <Text
          style={[
            styles.licenseItem,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          • Expo
        </Text>
        <Text
          style={[
            styles.licenseItem,
            { color: isDark ? "#DDDDDD" : "#333333" },
          ]}
        >
          • Zustand
        </Text>
        <TouchableOpacity
          style={styles.licenseButton}
          onPress={() => openLink("https://ohmyshit.com/licenses")}
        >
          <Text style={styles.licenseButtonText}>전체 라이센스 보기</Text>
        </TouchableOpacity>
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
  licenseItem: {
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 10,
  },
  licenseButton: {
    backgroundColor: "#636B2F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  licenseButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
