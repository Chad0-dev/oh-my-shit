import React from "react";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/theme";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView } from "../../utils/styled";

interface LoadingProps {
  fullScreen?: boolean;
  size?: "small" | "large";
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  size = "large",
}) => {
  const { isDark } = useThemeStore();

  if (fullScreen) {
    return (
      <StyledView className="flex-1 items-center justify-center">
        <ActivityIndicator
          size={size}
          color={isDark ? COLORS.mossy.light : COLORS.mossy.dark}
        />
      </StyledView>
    );
  }

  return (
    <ActivityIndicator
      size={size}
      color={isDark ? COLORS.mossy.light : COLORS.mossy.dark}
    />
  );
};
