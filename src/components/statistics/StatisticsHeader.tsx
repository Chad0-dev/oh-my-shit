import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";
import { Ionicons } from "@expo/vector-icons";

interface StatisticsHeaderProps {
  title: string;
  currentPeriod: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onSelectPeriodType: () => void;
}

export const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  title,
  currentPeriod,
  onPrevPeriod,
  onNextPeriod,
  onSelectPeriodType,
}) => {
  const { isDark } = useThemeStore();

  return (
    <StyledView
      className={`w-full px-4 py-3 ${
        isDark ? "bg-mossy-dark/80" : "bg-mossy-light/80"
      }`}
    >
      <StyledText
        className={`text-xl font-bold mb-2 ${
          isDark ? "text-white" : "text-mossy-darkest"
        }`}
      >
        {title}
      </StyledText>

      <StyledView className="flex-row justify-between items-center">
        <TouchableOpacity onPress={onPrevPeriod} style={styles.button}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#FFFFFF" : "#2A3B1C"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSelectPeriodType}
          className={`flex-row items-center py-1 px-3 rounded-full ${
            isDark ? "bg-mossy-darkest" : "bg-mossy-medium/30"
          }`}
        >
          <StyledText
            className={`text-base font-medium ${
              isDark ? "text-white" : "text-mossy-darkest"
            }`}
          >
            {currentPeriod}
          </StyledText>
          <Ionicons
            name="chevron-down"
            size={16}
            color={isDark ? "#FFFFFF" : "#2A3B1C"}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onNextPeriod} style={styles.button}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isDark ? "#FFFFFF" : "#2A3B1C"}
          />
        </TouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
