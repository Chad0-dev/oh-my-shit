import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated,
  Platform,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView } from "../../utils/styled";
import { Ionicons } from "@expo/vector-icons";

export type TabName = "home" | "map" | "article" | "statistics" | "calendar";
// Ionicons 타입 정의
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface FooterProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, onTabPress }) => {
  const { isDark } = useThemeStore();
  const [hoveredTab, setHoveredTab] = useState<TabName | null>(null);

  // Ionicons를 사용한 아이콘 렌더링 함수
  const renderIcon = (tabName: TabName, isActive: boolean) => {
    const iconColor =
      isActive || hoveredTab === tabName ? "#FFFFFF" : "#BAC095";
    const iconSize = 24;

    // 각 탭에 맞는 아이콘 이름 매핑
    const getIconName = (tab: TabName, active: boolean): IconName => {
      switch (tab) {
        case "home":
          return active ? "home" : "home-outline";
        case "map":
          return active ? "navigate" : "navigate-outline";
        case "article":
          return active ? "newspaper" : "newspaper-outline";
        case "statistics":
          return active ? "stats-chart" : "stats-chart-outline";
        case "calendar":
          return active ? "calendar" : "calendar-outline";
        default:
          return "help-circle-outline";
      }
    };

    return (
      <Ionicons
        name={getIconName(tabName, isActive)}
        size={iconSize}
        color={iconColor}
        style={styles.tabIcon}
      />
    );
  };

  const tabItems: TabName[] = [
    "map",
    "article",
    "home",
    "statistics",
    "calendar",
  ];

  return (
    <View style={[styles.footerContainer, { backgroundColor: "#3D4127" }]}>
      {tabItems.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabPress(tab)}
          style={[
            styles.tabButton,
            activeTab === tab && styles.activeTabButton,
          ]}
          onPressIn={() => setHoveredTab(tab)}
          onPressOut={() => setHoveredTab(null)}
          activeOpacity={0.7}
        >
          {renderIcon(tab, activeTab === tab)}
          {(activeTab === tab || hoveredTab === tab) && (
            <Text
              style={[
                styles.tabLabel,
                {
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  opacity: activeTab === tab ? 1 : 0.8,
                },
              ]}
            >
              {/* 탭 이름의 첫 글자만 대문자로 변환 */}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#BAC095",
    width: "100%",
  },
  tabButton: {
    paddingVertical: 8,
    minWidth: 60,
    alignItems: "center",
  },
  activeTabButton: {
    // 활성화된 탭에 대한 추가 스타일을 여기에 정의할 수 있습니다
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
  },
});
