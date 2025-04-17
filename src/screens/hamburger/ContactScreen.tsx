import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// 아이콘 타입 지정
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ContactMethod {
  icon: IconName;
  label: string;
  value: string;
  action: () => void;
}

const sendEmailViaEmailJS = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  const serviceID = "service_omxhsfp";
  const templateID = "template_70jh9kh";
  const userID = "cAZN8AsMVu_cA97W6";

  const templateParams = {
    from_name: name || "익명",
    from_email: email || "no-reply@ohmyshit.app",
    subject: subject || "Oh My Sh!t 앱 문의",
    message,
    name, // 추가된 라인
  };

  try {
    const res = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: serviceID,
        template_id: templateID,
        user_id: userID,
        template_params: templateParams,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("이메일 전송 성공!", res.data);
    return true;
  } catch (error) {
    console.error("이메일 전송 실패!", error);
    return false;
  }
};

export const ContactScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const textColor = isDark ? "text-gray-200" : "text-mossy-darkest";
  const sectionBg = isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40";
  const titleColor = isDark ? "text-white" : "text-mossy-darkest";
  const iconColor = isDark ? "#BAC095" : "#636B2F";
  const dividerColor = "#3D4127";
  const inputBg = isDark ? "#2A2A2A" : "#FFFFFF";
  const inputText = isDark ? "#FFFFFF" : "#333333";
  const placeholderColor = isDark ? "#777777" : "#999999";

  // 대체 이메일 전송 방법 (mailto: 링크)
  const sendEmailViaMailto = () => {
    const emailAddress = "ohmyshit.dev@gmail.com";
    const emailSubject = encodeURIComponent(subject || "Oh My Sh!t 앱 문의");
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
            "이메일 앱을 열 수 없습니다. 직접 이메일을 보내주세요: ohmyshit.dev@gmail.com"
          );
        }
      })
      .catch((error) => {
        console.error("이메일 링크 오류:", error);
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

    const success = await sendEmailViaEmailJS(name, email, subject, message);
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
      // EmailJS 실패 시 사용자에게 선택지 제공
      Alert.alert(
        "서버 전송 실패",
        "이메일 전송 서버에 연결할 수 없습니다. 이메일 앱을 통해 직접 전송하시겠습니까?",
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
  };

  // 연락 방법 목록
  const contactMethods: ContactMethod[] = [
    {
      icon: "mail-outline",
      label: "이메일",
      value: "ohmyshit.dev@gmail.com",
      action: () => {
        Linking.openURL("mailto:ohmyshit.dev@gmail.com");
      },
    },
    {
      icon: "logo-github",
      label: "GitHub",
      value: "github.com/ohmyshit",
      action: () => {
        Linking.openURL("https://github.com/ohmyshit");
      },
    },
    {
      icon: "globe-outline",
      label: "웹사이트",
      value: "www.ohmyshit.app",
      action: () => {
        Linking.openURL("https://www.ohmyshit.app");
      },
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className={`flex-1 p-4 ${
          isDark ? "bg-mossy-darkest" : "bg-mossy-lightest"
        }`}
        keyboardShouldPersistTaps="handled"
      >
        <StyledText
          className={`text-3xl font-bold ${titleColor} text-center mb-2`}
          style={{ fontFamily: "Pattaya" }}
        >
          문의하기
        </StyledText>
        <StyledText className={`${textColor} text-center mb-6`}>
          문의사항이나 제안을 남겨주세요
        </StyledText>

        {/* 연락처 정보 섹션 */}
        <StyledView
          className={`rounded-lg p-4 mb-6 ${sectionBg}`}
          style={styles.cardShadow}
        >
          <StyledView className="flex-row items-center mb-3">
            <Ionicons name="call-outline" size={24} color={iconColor} />
            <StyledText className={`text-lg font-bold ml-2 ${titleColor}`}>
              연락처 정보
            </StyledText>
          </StyledView>
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <StyledView className="mt-4">
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={method.action}
                className="flex-row items-center mb-3"
              >
                <Ionicons name={method.icon} size={20} color={iconColor} />
                <StyledText className={`${textColor} font-bold ml-2 mr-1`}>
                  {method.label}:
                </StyledText>
                <StyledText className={`${textColor} underline`}>
                  {method.value}
                </StyledText>
              </TouchableOpacity>
            ))}
            <StyledText className={`${textColor} mt-2 italic`}>
              평일 오전 9시부터 오후 6시까지 응답 가능합니다.
            </StyledText>
          </StyledView>
        </StyledView>

        {/* 문의 양식 섹션 */}
        <StyledView
          className={`rounded-lg p-4 mb-6 ${sectionBg}`}
          style={styles.cardShadow}
        >
          <StyledView className="flex-row items-center mb-3">
            <Ionicons name="create-outline" size={24} color={iconColor} />
            <StyledText className={`text-lg font-bold ml-2 ${titleColor}`}>
              문의 양식
            </StyledText>
          </StyledView>
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <StyledView className="mt-4">
            <StyledView className="mb-3">
              <StyledText className={`${textColor} mb-1`}>
                이름 (선택사항)
              </StyledText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: dividerColor,
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
                placeholderTextColor={placeholderColor}
              />
            </StyledView>

            <StyledView className="mb-3">
              <StyledText className={`${textColor} mb-1`}>
                이메일 (선택사항)
              </StyledText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: dividerColor,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="답변을 받을 이메일 주소"
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </StyledView>

            <StyledView className="mb-3">
              <StyledText className={`${textColor} mb-1`}>
                제목 (선택사항)
              </StyledText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: dividerColor,
                  },
                ]}
                value={subject}
                onChangeText={setSubject}
                placeholder="문의 제목"
                placeholderTextColor={placeholderColor}
              />
            </StyledView>

            <StyledView className="mb-4">
              <StyledText className={`${textColor} mb-1`}>메시지 *</StyledText>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: inputBg,
                    color: inputText,
                    borderColor: dividerColor,
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
            </StyledView>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                { backgroundColor: isDark ? "#636B2F" : "#BAC095" },
              ]}
              activeOpacity={0.7}
            >
              <StyledText
                className="text-white font-bold text-center"
                style={{ fontSize: 16 }}
              >
                메시지 보내기
              </StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>

        {/* 이용 약관 및 개인정보 처리방침 */}
        <StyledView className="items-center my-4">
          <StyledText className={`${textColor} text-sm mb-1`}>
            문의하시기 전에
            <StyledText
              className="underline"
              onPress={() =>
                Linking.openURL("https://www.ohmyshit.app/privacy")
              }
            >
              {" "}
              개인정보 처리방침
            </StyledText>
            을 확인해 주세요.
          </StyledText>
          <StyledText className={`${textColor} text-sm`}>
            © 2024 Oh My Sh!t. All rights reserved.
          </StyledText>
        </StyledView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.7,
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
});
