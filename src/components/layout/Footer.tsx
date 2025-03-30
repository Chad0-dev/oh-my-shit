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

export type TabName = "home" | "map" | "article" | "statistics" | "calendar";

interface FooterProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, onTabPress }) => {
  const { isDark } = useThemeStore();
  const [hoveredTab, setHoveredTab] = useState<TabName | null>(null);

  // 간단한 아이콘 렌더링 함수 (실제로는 아이콘 라이브러리 사용 권장)
  const renderIcon = (tabName: TabName, isActive: boolean) => {
    const iconColor =
      isActive || hoveredTab === tabName ? "#FFFFFF" : "#BAC095";
    const baseStyle = {
      width: 24,
      height: 24,
      marginBottom: 4,
      backgroundColor: iconColor,
    };

    switch (tabName) {
      case "home":
        return <View style={[baseStyle, { borderRadius: 12 }]} />;
      case "map":
        return <View style={[baseStyle, { borderRadius: 4 }]} />;
      case "article":
        return <View style={[baseStyle, { borderRadius: 2 }]} />;
      case "statistics":
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 24,
              marginBottom: 4,
            }}
          >
            <View
              style={{ width: 4, height: 12, backgroundColor: iconColor }}
            />
            <View
              style={{ width: 4, height: 16, backgroundColor: iconColor }}
            />
            <View
              style={{ width: 4, height: 24, backgroundColor: iconColor }}
            />
          </View>
        );
      case "calendar":
        return (
          <View
            style={[
              baseStyle,
              {
                borderRadius: 4,
                borderWidth: 2,
                borderColor: iconColor,
                backgroundColor: "transparent",
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  const tabItems: TabName[] = [
    "map",
    "article",
    "home",
    "statistics",
    "calendar",
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#3D4127",
        borderTopWidth: 1,
        borderTopColor: "#BAC095",
        width: "100%",
      }}
    >
      {tabItems.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabPress(tab)}
          style={styles.tabButton}
          onPressIn={() => setHoveredTab(tab)}
          onPressOut={() => setHoveredTab(null)}
          activeOpacity={0.7}
        >
          {renderIcon(tab, activeTab === tab)}
          {(activeTab === tab || hoveredTab === tab) && (
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: activeTab === tab ? "bold" : "normal",
                textAlign: "center",
                opacity: activeTab === tab ? 1 : 0.8,
              }}
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
  tabButton: {
    paddingVertical: 8,
    minWidth: 60,
    alignItems: "center",
  },
});
