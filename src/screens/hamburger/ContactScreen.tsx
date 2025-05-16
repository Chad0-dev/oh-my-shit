import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/client";

// 아이콘 타입 지정
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ContactMethod {
  icon: IconName;
  label: string;
  value: string;
  action: () => void;
}

// Supabase를 통해 문의사항 저장
const saveInquiryToDatabase = async (
  name: string | null,
  email: string | null,
  subject: string,
  message: string,
  user_id?: string
) => {
  try {
    const { data, error } = await supabase.from("inquiries").insert([
      {
        name: name || null,
        email: email || null,
        subject: subject || "제목 없음",
        message,
        status: "pending",
        user_id: user_id || null,
      },
    ]);

    if (error) {
      console.error("문의사항 저장 중 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("문의사항 저장 중 예외 발생:", error);
    return false;
  }
};

export const ContactScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBg = isDark ? "#2A2A2A" : "#FFFFFF";
  const inputText = isDark ? "#FFFFFF" : "#333333";
  const placeholderColor = isDark ? "#777777" : "#999999";
  const dividerColor = "#3D4127";

  // 대체 이메일 전송 방법 (mailto: 링크)
  const sendEmailViaMailto = () => {
    const emailAddress = "ohmypoop.dev@gmail.com";
    const emailSubject = encodeURIComponent(subject || "Oh My Poop 앱 문의");
    const emailBody = encodeURIComponent(
      `이름: ${name || "익명"}\n이메일: ${
        email || "답변받을 이메일 없음"
      }\n\n${message}`
    );
    const mailtoUrl = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            "오류",
            "이메일 앱을 열 수 없습니다. 직접 이메일을 보내주세요: ohmypoop.dev@gmail.com"
          );
        }
      })
      .catch((error) => {
        Alert.alert(
          "오류",
          "이메일을 보낼 수 없습니다. 나중에 다시 시도해주세요."
        );
      });
  };

  // 문의 양식 제출
  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("알림", "메시지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await saveInquiryToDatabase(
        name,
        email || (user ? user.email : null),
        subject,
        message,
        user ? user.id : undefined
      );

      if (success) {
        Alert.alert(
          "문의가 접수되었습니다",
          "빠른 시일 내에 답변 드리겠습니다. 감사합니다."
        );
        // 양식 초기화
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        // 데이터베이스 저장 실패 시 이메일 대안 제공
        Alert.alert(
          "서버 전송 실패",
          "문의사항을 저장할 수 없습니다. 이메일 앱을 통해 직접 전송하시겠습니까?",
          [
            {
              text: "취소",
              style: "cancel",
            },
            {
              text: "이메일 앱으로 전송",
              onPress: () => {
                sendEmailViaMailto();
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "오류",
        "문의 처리 중 오류가 발생했습니다. 나중에 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 연락 방법 목록
  const contactMethods: ContactMethod[] = [
    {
      icon: "mail-outline",
      label: "이메일",
      value: "ohmypoop.dev@gmail.com",
      action: () => {
        Linking.openURL("mailto:ohmypoop.dev@gmail.com");
      },
    },
    {
      icon: "logo-instagram",
      label: "인스타그램",
      value: "@ohmypoop",
      action: () => {
        Linking.openURL("https://instagram.com/ohmypoop");
      },
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#3D4127" : "#FFFFFF" },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}
          >
            문의하기
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#BBBBBB" : "#666666" }]}
          >
            문의사항이나 제안을 남겨주세요
          </Text>
        </View>

        {/* 연락처 정보 섹션 */}
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="call-outline" size={24} color="#636B2F" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              연락처 정보
            </Text>
          </View>

          <View style={styles.contactMethodsContainer}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={method.action}
                style={styles.contactMethodItem}
              >
                <Ionicons name={method.icon} size={20} color="#636B2F" />
                <Text
                  style={[
                    styles.contactMethodLabel,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {method.label}:
                </Text>
                <Text
                  style={[
                    styles.contactMethodValue,
                    { color: isDark ? "#BBBBBB" : "#666666" },
                  ]}
                >
                  {method.value}
                </Text>
              </TouchableOpacity>
            ))}
            <Text
              style={[
                styles.supportHours,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              평일 오전 9시부터 오후 6시까지 응답 가능합니다.
            </Text>
          </View>
        </View>

        {/* 문의 양식 섹션 */}
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="create-outline" size={24} color="#636B2F" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              문의 양식
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formField}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                이름 (선택사항)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: isDark ? "#444444" : "#DDDDDD",
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
                placeholderTextColor={placeholderColor}
              />
            </View>

            <View style={styles.formField}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                이메일 (선택사항)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: isDark ? "#444444" : "#DDDDDD",
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="답변을 받을 이메일 주소"
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formField}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                제목 (선택사항)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: isDark ? "#444444" : "#DDDDDD",
                  },
                ]}
                value={subject}
                onChangeText={setSubject}
                placeholder="문의 제목"
                placeholderTextColor={placeholderColor}
              />
            </View>

            <View style={styles.formField}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? "#BBBBBB" : "#666666" },
                ]}
              >
                메시지 *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: isDark ? "#444444" : "#DDDDDD",
                  },
                ]}
                value={message}
                onChangeText={setMessage}
                placeholder="문의 내용을 입력하세요"
                placeholderTextColor={placeholderColor}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: "#636B2F",
                  opacity: isSubmitting ? 0.7 : 1,
                },
              ]}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "처리 중..." : "메시지 보내기"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 이용 약관 및 개인정보 처리방침 */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            문의하시기 전에
            <Text
              style={styles.linkText}
              onPress={() =>
                Linking.openURL("https://www.ohmyshit.app/privacy")
              }
            >
              {" "}
              개인정보 처리방침
            </Text>
            을 확인해 주세요.
          </Text>
          <Text
            style={[
              styles.footerText,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            © 2024 Oh My Poop. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Pattaya",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
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
  contactMethodsContainer: {
    marginTop: 8,
  },
  contactMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactMethodLabel: {
    fontWeight: "bold",
    marginLeft: 8,
    marginRight: 4,
  },
  contactMethodValue: {
    textDecorationLine: "underline",
  },
  supportHours: {
    marginTop: 8,
    fontStyle: "italic",
    fontSize: 14,
  },
  formContainer: {
    marginTop: 8,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  submitButton: {
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
