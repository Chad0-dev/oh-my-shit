import React, { useState, useCallback, useRef, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView } from "../../utils/styled";
import { useAuthStore } from "../../stores/authStore";
import { useProfileStore } from "../../stores/profileStore";
import { HamburgerMenu } from "../headers/HamburgerMenu";
import { AvatarMenu } from "../headers/AvatarMenu";
import { HamburgerScreenType } from "../../screens/AppNavigation";

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
  onNavigateTo?: (screen: HamburgerScreenType) => void;
  onTitlePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Oh My Poop",
  onMenuPress,
  onAvatarPress,
  onNavigateTo,
  onTitlePress,
}) => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const { avatarUrl, loadProfile } = useProfileStore();
  const [hamburgerMenuVisible, setHamburgerMenuVisible] = useState(false);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const menuTimeout = useRef<NodeJS.Timeout | null>(null);

  // 앱이 시작될 때 프로필 정보 로드
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

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

  // 햄버거 메뉴 화면으로 이동
  const handleNavigate = useCallback(
    (screen: HamburgerScreenType) => {
      if (onNavigateTo) {
        handleHamburgerMenuClose();
        onNavigateTo(screen);
      }
    },
    [onNavigateTo, handleHamburgerMenuClose]
  );

  // 타이틀 클릭 핸들러
  const handleTitlePress = useCallback(() => {
    if (onTitlePress) {
      onTitlePress();
    } else if (onNavigateTo) {
      // 햄버거 메뉴가 열려있으면 닫기
      if (hamburgerMenuVisible) {
        handleHamburgerMenuClose();
      }
      // 아바타 메뉴가 열려있으면 닫기
      if (avatarMenuVisible) {
        handleAvatarMenuClose();
      }
      // 홈 화면으로 이동
      onNavigateTo("home");
    }
  }, [
    onTitlePress,
    onNavigateTo,
    hamburgerMenuVisible,
    avatarMenuVisible,
    handleHamburgerMenuClose,
    handleAvatarMenuClose,
  ]);

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

        {/* 타이틀 - 클릭 가능하도록 TouchableOpacity로 감싸기 */}
        <TouchableOpacity onPress={handleTitlePress}>
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
        </TouchableOpacity>

        {/* 아바타 메뉴 */}
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: avatarUrl ? "transparent" : "#BAC095",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 5,
          }}
          onPress={handleAvatarPress}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 0,
              }}
              resizeMode="cover"
            />
          ) : (
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {userInitial}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 햄버거 메뉴 팝업 */}
      <HamburgerMenu
        visible={hamburgerMenuVisible}
        onClose={handleHamburgerMenuClose}
        onNavigate={handleNavigate}
      />

      {/* 아바타 메뉴 팝업 */}
      <AvatarMenu
        visible={avatarMenuVisible}
        onClose={handleAvatarMenuClose}
        onNavigate={handleNavigate}
      />
    </>
  );
};
