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
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#3D4127" : "#FFFFFF" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
        설정
      </Text>

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
        <View style={styles.settingItem}>
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
              준비중입니다
            </Text>
          </View>
        </View>
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
              준비중입니다
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={pushNotifications ? "#f5dd4b" : "#f4f3f4"}
            disabled={true}
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
              준비중입니다
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={emailNotifications ? "#f5dd4b" : "#f4f3f4"}
            disabled={true}
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
        <View style={styles.settingItem}>
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
              준비중입니다
            </Text>
          </View>
        </View>
      </View>

      {/* 계정 관리 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          계정 관리
        </Text>

        {/* 계정 삭제 */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "계정 탈퇴",
              "정말로 탈퇴하시겠습니까?\n모든 기록 및 데이터가 영구적으로 삭제됩니다.",
              [
                { text: "취소", style: "cancel" },
                {
                  text: "탈퇴",
                  style: "destructive",
                  onPress: () => {
                    // 두 번째 확인
                    Alert.alert(
                      "최종 확인",
                      "정말 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
                      [
                        { text: "취소", style: "cancel" },
                        {
                          text: "탈퇴 확인",
                          style: "destructive",
                          onPress: async () => {
                            try {
                              await useAuthStore.getState().deleteAccount();
                            } catch (e) {
                              const msg =
                                e instanceof Error
                                  ? e.message
                                  : typeof e === "string"
                                  ? e
                                  : "계정 삭제에 실패했습니다.";
                              Alert.alert("오류", msg);
                            }
                          },
                        },
                      ]
                    );
                  },
                },
              ]
            );
          }}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="delete-forever" size={24} color="#ff4d4f" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: "#ff4d4f" }]}>
                계정 탈퇴
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                앱 사용 기록이 모두 삭제됩니다
              </Text>
            </View>
          </View>
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
