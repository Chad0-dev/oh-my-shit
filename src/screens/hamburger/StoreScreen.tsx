import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { Ionicons } from "@expo/vector-icons";

export const StoreScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  // 가상의 스토어 아이템들
  const storeItems = [
    {
      id: 2,
      name: "캐릭터 스킨",
      description: "귀여운 캐릭터를 추가로 구매하세요",
      price: "준비 중",
      icon: "person-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 1,
      name: "프리미엄 테마",
      description: "다양한 고급 테마를 적용할 수 있습니다",
      price: "준비 중",
      icon: "color-palette-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 3,
      name: "건강식품",
      description: "배변활동에 도움이 되는 식품 입니다",
      price: "준비 중",
      icon: "nutrition-outline" as keyof typeof Ionicons.glyphMap,
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#3D4127" : "#FFFFFF" },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          상점
        </Text>
        <Text
          style={[styles.subtitle, { color: isDark ? "#BBBBBB" : "#666666" }]}
        >
          다양한 아이템으로 앱을 꾸며보세요
        </Text>
      </View>

      {/* 준비 중 메시지 */}
      <View
        style={[
          styles.comingSoonCard,
          { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
        ]}
      >
        <Ionicons
          name="time-outline"
          size={28}
          color={isDark ? "#BBBBBB" : "#636B2F"}
          style={styles.comingSoonIcon}
        />
        <Text
          style={[
            styles.comingSoonTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          준비 중인 기능입니다
        </Text>
        <Text
          style={[
            styles.comingSoonText,
            { color: isDark ? "#BBBBBB" : "#666666" },
          ]}
        >
          곧 다양한 아이템과 테마가 제공될 예정입니다. 조금만 기다려주세요!
        </Text>
      </View>

      {/* 향후 제공될 아이템 미리보기 */}
      <Text
        style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}
      >
        출시 예정 아이템
      </Text>

      {storeItems.map((item) => (
        <View
          key={item.id}
          style={[
            styles.itemCard,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
        >
          <View style={styles.itemIconContainer}>
            <Ionicons
              name={item.icon}
              size={32}
              color="#636B2F"
              style={styles.itemIcon}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text
              style={[
                styles.itemName,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.itemDescription,
                { color: isDark ? "#BBBBBB" : "#666666" },
              ]}
            >
              {item.description}
            </Text>
          </View>
          <Text
            style={[
              styles.itemPrice,
              { color: isDark ? "#FFFFFF" : "#636B2F" },
            ]}
          >
            {item.price}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Pattaya",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  comingSoonCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  comingSoonIcon: {
    marginBottom: 12,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(99, 107, 47, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemIcon: {},
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
