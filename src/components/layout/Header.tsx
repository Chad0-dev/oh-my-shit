import React, { useState } from "react";
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

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      setHamburgerMenuVisible(true);
    }
  };

  const handleAvatarPress = () => {
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      setAvatarMenuVisible(true);
    }
  };

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
        onClose={() => setHamburgerMenuVisible(false)}
      />

      {/* 아바타 메뉴 팝업 */}
      <AvatarMenu
        visible={avatarMenuVisible}
        onClose={() => setAvatarMenuVisible(false)}
      />
    </>
  );
};
