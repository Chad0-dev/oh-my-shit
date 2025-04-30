import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";
import { Button } from "../../components/ui/Button";

export const MapScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <StyledView
      className={`flex-1 ${isDark ? "bg-mossy-darkest" : "bg-white"}`}
    >
      {/* 지도 영역 (실제로는 지도 컴포넌트가 들어갈 자리) */}
      <StyledView
        className={`flex-1 items-center justify-center ${
          isDark ? "bg-mossy-dark/30" : "bg-mossy-light/20"
        }`}
      >
        <StyledView
          className={`w-16 h-16 mb-4 rounded-full items-center justify-center ${
            isDark ? "bg-mossy-dark" : "bg-mossy-medium"
          }`}
        >
          <StyledText
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-mossy-darkest"
            }`}
          >
            🚻
          </StyledText>
        </StyledView>
        <StyledText
          className={`text-lg font-bold mb-2 ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          지도 영역
        </StyledText>
        <StyledText
          className={`text-center mb-6 px-6 ${
            isDark ? "text-mossy-medium" : "text-mossy-dark"
          }`}
        >
          이 영역에는 지도 API가 통합되어 주변 화장실을 표시할 예정입니다.
        </StyledText>

        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: isDark ? "#BAC095" : "#636B2F" },
          ]}
          onPress={() => alert("준비 중인 기능입니다.")}
        >
          <Text style={styles.searchButtonText}>주변 화장실 검색</Text>
        </TouchableOpacity>
      </StyledView>

      {/* 하단 정보 패널 */}
      <StyledView
        className={`p-4 border-t ${
          isDark
            ? "bg-mossy-darkest border-mossy-dark"
            : "bg-white border-mossy-light"
        }`}
      >
        <StyledText
          className={`text-lg font-bold mb-2 ${
            isDark ? "text-mossy-light" : "text-mossy-dark"
          }`}
        >
          가장 가까운 화장실
        </StyledText>
        <StyledView
          className={`flex-row justify-between mb-2 p-3 rounded ${
            isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
          }`}
        >
          <StyledView>
            <StyledText
              className={`font-medium ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              시민공원 공중화장실
            </StyledText>
            <StyledText
              className={isDark ? "text-mossy-medium" : "text-mossy-dark"}
            >
              거리: 약 250m
            </StyledText>
          </StyledView>
          <TouchableOpacity
            style={[
              styles.directionButton,
              { backgroundColor: isDark ? "#3D4127" : "#BAC095" },
            ]}
            onPress={() => alert("준비 중인 기능입니다.")}
          >
            <Text style={styles.directionButtonText}>길 안내</Text>
          </TouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  searchButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  directionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
