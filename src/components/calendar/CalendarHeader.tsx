import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView } from "../../utils/styled";

interface CalendarHeaderProps {
  currentYear: number;
  currentMonth: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentYear,
  currentMonth,
  goToPrevMonth,
  goToNextMonth,
}) => {
  const { isDark } = useThemeStore();

  return (
    <StyledView
      style={styles.container}
      className={`py-3 flex-row justify-between items-center ${
        isDark ? "bg-mossy-dark/80" : "bg-mossy-light/80"
      }`}
    >
      <TouchableOpacity onPress={goToPrevMonth} style={styles.button}>
        <StyledText
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          ◀
        </StyledText>
      </TouchableOpacity>
      <StyledText
        className={`text-xl font-bold ${
          isDark ? "text-white" : "text-mossy-darkest"
        }`}
      >
        {currentYear}년 {currentMonth}월
      </StyledText>
      <TouchableOpacity onPress={goToNextMonth} style={styles.button}>
        <StyledText
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          ▶
        </StyledText>
      </TouchableOpacity>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  button: {
    paddingHorizontal: 8,
  },
});
