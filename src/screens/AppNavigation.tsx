import React, { useState } from "react";
import { TabName } from "../components/layout/Footer";
import { MainLayout } from "../components/layout/MainLayout";
import { HomeScreen } from "./home/HomeScreen";
import { MapScreen } from "./map/MapScreen";
import { ArticleScreen } from "./article/ArticleScreen";
import { StatisticsScreen } from "./statistics/StatisticsScreen";
import { CalendarScreen } from "./calendar/CalendarScreen";
import { useAuthStore } from "../stores/authStore";

export const AppNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const { signOut } = useAuthStore();

  // 현재 탭에 따라 페이지 렌더링
  const renderPage = () => {
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
    switch (activeTab) {
      case "home":
        return "Oh My Sh!t";
      case "map":
        return "화장실 지도";
      case "article":
        return "건강 정보";
      case "statistics":
        return "통계";
      case "calendar":
        return "달력";
      default:
        return "Oh My Sh!t";
    }
  };

  // 햄버거 메뉴와 아바타 메뉴는 헤더 내부에서 처리됨

  return (
    <MainLayout
      title={getTitle()}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderPage()}
    </MainLayout>
  );
};
