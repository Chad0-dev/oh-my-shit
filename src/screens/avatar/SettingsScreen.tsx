import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

export const SettingsScreen: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();

  // 알림 설정
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // 개인정보 설정
  const [locationTracking, setLocationTracking] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  // 언어 설정 (기본값: 한국어)
  const [language, setLanguage] = useState("ko");

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        onPress: () => signOut(),
        style: "destructive",
      },
    ]);
  };

  // 데이터 초기화 처리
  const handleResetData = () => {
    Alert.alert(
      "데이터 초기화",
      "모든 사용자 데이터가 삭제됩니다. 계속하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "초기화",
          onPress: () =>
            Alert.alert("초기화 완료", "모든 데이터가 초기화되었습니다."),
          style: "destructive",
        },
      ]
    );
  };

  // 언어 변경 처리
  const handleLanguageChange = () => {
    Alert.alert("언어 설정", "사용할 언어를 선택하세요", [
      {
        text: "한국어",
        onPress: () => setLanguage("ko"),
      },
      {
        text: "English",
        onPress: () => setLanguage("en"),
      },
      {
        text: "취소",
        style: "cancel",
      },
    ]);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
        설정
      </Text>

      {/* 계정 설정 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          계정
        </Text>

        {/* 프로필 정보 */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons
              name="person-circle"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {user ? user.email : "로그인이 필요합니다"}
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              프로필 정보 수정
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            color={isDark ? "#777777" : "#999999"}
          />
        </TouchableOpacity>

        {/* 로그아웃 */}
        {user && (
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingIcon}>
              <MaterialIcons
                name="logout"
                size={24}
                color={isDark ? "#CCCCCC" : "#636B2F"}
              />
            </View>
            <View style={styles.settingContent}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                로그아웃
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                계정에서 로그아웃합니다
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* 앱 설정 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          앱 설정
        </Text>

        {/* 테마 설정 */}
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              다크 모드
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              {isDark ? "어두운 테마 사용 중" : "밝은 테마 사용 중"}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* 언어 설정 */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleLanguageChange}
        >
          <View style={styles.settingIcon}>
            <FontAwesome
              name="language"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              언어
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              {language === "ko" ? "한국어" : "English"}
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            color={isDark ? "#777777" : "#999999"}
          />
        </TouchableOpacity>
      </View>

      {/* 알림 설정 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          알림
        </Text>

        {/* 푸시 알림 */}
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons
              name="notifications"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              푸시 알림
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              앱 알림 수신 설정
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={pushNotifications ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* 이메일 알림 */}
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              이메일 알림
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              이메일 알림 수신 설정
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={emailNotifications ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* 개인정보 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          개인정보
        </Text>

        {/* 위치 추적 */}
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <MaterialIcons
              name="location-on"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              위치 데이터
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              위치 정보 수집 허용
            </Text>
          </View>
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={locationTracking ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* 데이터 수집 */}
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <MaterialIcons
              name="data-usage"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              사용 데이터
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              익명 사용 데이터 수집 허용
            </Text>
          </View>
          <Switch
            value={dataCollection}
            onValueChange={setDataCollection}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={dataCollection ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* 데이터 관리 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          데이터 관리
        </Text>

        {/* 데이터 다운로드 */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <MaterialIcons
              name="cloud-download"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              데이터 다운로드
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              내 데이터 내보내기
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            color={isDark ? "#777777" : "#999999"}
          />
        </TouchableOpacity>

        {/* 데이터 초기화 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="delete-forever" size={24} color="#E53935" />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              데이터 초기화
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              모든 데이터 삭제
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            color={isDark ? "#777777" : "#999999"}
          />
        </TouchableOpacity>
      </View>

      {/* 앱 정보 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          앱 정보
        </Text>

        {/* 버전 정보 */}
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons
              name="information-circle"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              버전
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              1.0.0 (빌드 100)
            </Text>
          </View>
        </View>

        {/* 도움말 및 피드백 */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <MaterialIcons
              name="help-outline"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              도움말 및 피드백
            </Text>
            <Text
              style={[
                styles.settingDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              문제 신고 및 개선 제안
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            color={isDark ? "#777777" : "#999999"}
          />
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
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  settingIcon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
    marginLeft: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 3,
  },
});
