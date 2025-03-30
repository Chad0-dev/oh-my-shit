import React from "react";
import { TextInputProps, View } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledTextInput, StyledView } from "../../utils/styled";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...rest
}) => {
  const { isDark } = useThemeStore();

  return (
    <StyledView className="mb-4">
      {label && (
        <StyledText
          className={`mb-1 font-medium ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          {label}
        </StyledText>
      )}

      <StyledView
        className={`
          flex-row items-center
          border rounded-md px-3 py-2
          ${
            error
              ? "border-red-500"
              : isDark
              ? "border-mossy-medium"
              : "border-mossy-dark"
          }
          ${isDark ? "bg-mossy-darkest" : "bg-white"}
        `}
      >
        {leftIcon && <StyledView className="mr-2">{leftIcon}</StyledView>}

        <StyledTextInput
          className={`flex-1 ${isDark ? "text-white" : "text-mossy-darkest"}`}
          placeholderTextColor={isDark ? "#BAC095" : "#636B2F"}
          style={style}
          {...rest}
        />

        {rightIcon && <StyledView className="ml-2">{rightIcon}</StyledView>}
      </StyledView>

      {error && (
        <StyledText className="mt-1 text-red-500 text-xs">{error}</StyledText>
      )}
    </StyledView>
  );
};
