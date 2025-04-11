import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import {
  StyledView,
  StyledText,
  StyledScrollView,
  StyledTextInput,
} from "../../utils/styled";

export const ContactScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }

    Alert.alert("성공", "문의가 성공적으로 전송되었습니다. 감사합니다!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <StyledScrollView
      className={`flex-1 p-4 ${
        isDark ? "bg-mossy-darkest" : "bg-mossy-lightest"
      }`}
    >
      <StyledText
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-white" : "text-mossy-darkest"
        }`}
        style={{ fontFamily: "Pattaya" }}
      >
        Contact Us
      </StyledText>

      <StyledView
        className={`rounded-lg p-4 mb-4 ${
          isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40"
        }`}
      >
        <StyledText
          className={`text-lg font-bold mb-3 ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          문의하기
        </StyledText>
        <StyledText
          className={`mb-4 ${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          문제 해결이나 피드백이 필요하신가요? 아래 양식을 작성해 주세요.
        </StyledText>

        <StyledText
          className={`mb-1 ${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          이름
        </StyledText>
        <StyledTextInput
          className={`p-2 rounded-md mb-3 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          placeholder="이름을 입력하세요"
          placeholderTextColor={isDark ? "#999" : "#777"}
          value={name}
          onChangeText={setName}
        />

        <StyledText
          className={`mb-1 ${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          이메일
        </StyledText>
        <StyledTextInput
          className={`p-2 rounded-md mb-3 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          placeholder="이메일을 입력하세요"
          placeholderTextColor={isDark ? "#999" : "#777"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <StyledText
          className={`mb-1 ${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          메시지
        </StyledText>
        <StyledTextInput
          className={`p-2 rounded-md mb-4 ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          placeholder="문의 내용을 입력하세요"
          placeholderTextColor={isDark ? "#999" : "#777"}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className={`rounded-md p-3 ${
            isDark ? "bg-mossy-medium" : "bg-mossy-dark"
          }`}
        >
          <StyledText className="text-white text-center font-bold">
            전송하기
          </StyledText>
        </TouchableOpacity>
      </StyledView>
    </StyledScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
