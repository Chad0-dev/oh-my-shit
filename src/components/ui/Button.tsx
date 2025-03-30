import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledTouchableOpacity } from "../../utils/styled";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  isLoading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}) => {
  const { isDark } = useThemeStore();

  // 사이즈별 스타일
  const sizeStyles = {
    small: "py-2 px-3 text-sm",
    medium: "py-3 px-4 text-base",
    large: "py-4 px-6 text-lg",
  };

  // 버튼 타입별 스타일
  const variantStyles = {
    primary: `bg-mossy-dark ${isDark ? "text-white" : "text-white"}`,
    secondary: `bg-mossy-medium ${
      isDark ? "text-mossy-darkest" : "text-mossy-darkest"
    }`,
    outline: `border border-mossy-dark ${
      isDark ? "text-mossy-light" : "text-mossy-dark"
    }`,
  };

  const buttonClasses = `
    rounded-md ${sizeStyles[size]} ${variantStyles[variant]} 
    ${disabled || isLoading ? "opacity-50" : "opacity-100"}
    ${fullWidth ? "w-full" : ""}
  `;

  return (
    <StyledTouchableOpacity
      className={buttonClasses}
      disabled={disabled || isLoading}
      style={style}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline"
              ? isDark
                ? COLORS.mossy.light
                : COLORS.mossy.dark
              : "white"
          }
        />
      ) : (
        <StyledText
          className={`text-center font-semibold
            ${variant === "primary" ? "text-white" : ""}
            ${variant === "secondary" ? "text-mossy-darkest" : ""}
            ${
              variant === "outline"
                ? isDark
                  ? "text-mossy-light"
                  : "text-mossy-dark"
                : ""
            }
          `}
        >
          {title}
        </StyledText>
      )}
    </StyledTouchableOpacity>
  );
};
