import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Platform,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledSafeAreaView, StyledView } from "../../utils/styled";
import { Header } from "./Header";
import { Footer, TabName } from "./Footer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HamburgerScreenType } from "../../screens/AppNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  onNavigateTo?: (screen: HamburgerScreenType) => void;
  currentScreen?: HamburgerScreenType;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  activeTab,
  onTabChange,
  onNavigateTo,
  currentScreen,
}) => {
  const { isDark } = useThemeStore();
  const insets = useSafeAreaInsets();

  const handleNavigateTo = (screen: HamburgerScreenType) => {
    if (onNavigateTo) {
      onNavigateTo(screen);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#3D4127" : "#FFFFFF",
        paddingTop: Platform.OS === "ios" ? insets.top : 0,
      }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#636B2F" : "#D4DE95"}
      />

      <Header title={title} onNavigateTo={handleNavigateTo} />

      <StyledView className="flex-1">{children}</StyledView>

      <View
        style={{ paddingBottom: Platform.OS === "ios" ? insets.bottom : 0 }}
      >
        <Footer activeTab={activeTab} onTabPress={onTabChange} />
      </View>
    </View>
  );
};
