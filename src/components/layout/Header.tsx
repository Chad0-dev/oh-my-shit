import React, { useState, useCallback, useRef } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView } from "../../utils/styled";
import { useAuthStore } from "../../stores/authStore";
import { HamburgerMenu } from "../headers/HamburgerMenu";
import { AvatarMenu } from "../headers/AvatarMenu";

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Oh My Sh!t",
  onMenuPress,
  onAvatarPress,
}) => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [hamburgerMenuVisible, setHamburgerMenuVisible] = useState(false);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const menuTimeout = useRef<NodeJS.Timeout | null>(null);

  // 타임아웃 클리어 함수
  const clearMenuTimeout = useCallback(() => {
    if (menuTimeout.current) {
      clearTimeout(menuTimeout.current);
      menuTimeout.current = null;
    }
  }, []);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  // 메모이제이션된 핸들러 함수들
  const handleMenuPress = useCallback(() => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      clearMenuTimeout();

      // 아바타 메뉴가 열려있으면 먼저 닫기
      if (avatarMenuVisible) {
        setAvatarMenuVisible(false);
      }

      // 햄버거 메뉴 즉시 열기
      setHamburgerMenuVisible(true);
    }
  }, [onMenuPress, avatarMenuVisible, clearMenuTimeout]);

  const handleAvatarPress = useCallback(() => {
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      clearMenuTimeout();

      // 햄버거 메뉴가 열려있으면 먼저 닫기
      if (hamburgerMenuVisible) {
        setHamburgerMenuVisible(false);
      }

      // 아바타 메뉴 즉시 열기
      setAvatarMenuVisible(true);
    }
  }, [onAvatarPress, hamburgerMenuVisible, clearMenuTimeout]);

  const handleHamburgerMenuClose = useCallback(() => {
    clearMenuTimeout();
    setHamburgerMenuVisible(false);
  }, [clearMenuTimeout]);

  const handleAvatarMenuClose = useCallback(() => {
    clearMenuTimeout();
    setAvatarMenuVisible(false);
  }, [clearMenuTimeout]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: "#636B2F",
          width: "100%",
          zIndex: 10,
        }}
      >
        {/* 햄버거 메뉴 버튼 */}
        <TouchableOpacity onPress={handleMenuPress} className="p-2">
          <StyledView className="w-6 h-1 bg-white mb-1 rounded"></StyledView>
          <StyledView className="w-6 h-1 bg-white mb-1 rounded"></StyledView>
          <StyledView className="w-6 h-1 bg-white rounded"></StyledView>
        </TouchableOpacity>

        {/* 타이틀 */}
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontFamily: "Pattaya",
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        {/* 아바타 메뉴 */}
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#BAC095",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
          onPress={handleAvatarPress}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {userInitial}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 햄버거 메뉴 팝업 */}
      <HamburgerMenu
        visible={hamburgerMenuVisible}
        onClose={handleHamburgerMenuClose}
      />

      {/* 아바타 메뉴 팝업 */}
      <AvatarMenu visible={avatarMenuVisible} onClose={handleAvatarMenuClose} />
    </>
  );
};
