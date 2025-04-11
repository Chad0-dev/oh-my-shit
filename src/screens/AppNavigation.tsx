import React, { useState } from "react";
import { TabName } from "../components/layout/Footer";
import { MainLayout } from "../components/layout/MainLayout";
import { HomeScreen } from "./home/HomeScreen";
import { MapScreen } from "./map/MapScreen";
import { ArticleScreen } from "./article/ArticleScreen";
import { StatisticsScreen } from "./statistics/StatisticsScreen";
import { CalendarScreen } from "./calendar/CalendarScreen";
import { StoreScreen } from "./hamburger/StoreScreen";
import { ManualScreen } from "./hamburger/ManualScreen";
import { HelpScreen } from "./hamburger/HelpScreen";
import { ContactScreen } from "./hamburger/ContactScreen";
import { ProfileScreen } from "./avatar/ProfileScreen";
import { SettingsScreen } from "./avatar/SettingsScreen";
import { NotificationsScreen } from "./avatar/NotificationsScreen";
import { useAuthStore } from "../stores/authStore";

// 햄버거 메뉴 화면 타입
export type HamburgerScreenType =
  | "store"
  | "manual"
  | "help"
  | "contact"
  | "profile"
  | "settings"
  | "notifications"
  | null;

export const AppNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [currentScreen, setCurrentScreen] = useState<HamburgerScreenType>(null);
  const { signOut } = useAuthStore();

  // 현재 탭에 따라 페이지 렌더링
  const renderPage = () => {
    // 햄버거 메뉴 화면이 활성화된 경우 해당 화면 렌더링
    if (currentScreen) {
      switch (currentScreen) {
        case "store":
          return <StoreScreen />;
        case "manual":
          return <ManualScreen />;
        case "help":
          return <HelpScreen />;
        case "contact":
          return <ContactScreen />;
        case "profile":
          return <ProfileScreen />;
        case "settings":
          return <SettingsScreen />;
        case "notifications":
          return <NotificationsScreen />;
      }
    }

    // 기본 탭 화면 렌더링
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "map":
        return <MapScreen />;
      case "article":
        return <ArticleScreen />;
      case "statistics":
        return <StatisticsScreen />;
      case "calendar":
        return <CalendarScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // 탭에 따른 타이틀 설정
  const getTitle = () => {
    return "Oh My Sh!t";
  };

  // 햄버거 메뉴 화면으로 이동
  const navigateTo = (screen: HamburgerScreenType) => {
    setCurrentScreen(screen);
  };

  // 탭 변경 시 햄버거 메뉴 화면 초기화
  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    setCurrentScreen(null);
  };

  return (
    <MainLayout
      title={getTitle()}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onNavigateTo={navigateTo}
      currentScreen={currentScreen}
    >
      {renderPage()}
    </MainLayout>
  );
};
