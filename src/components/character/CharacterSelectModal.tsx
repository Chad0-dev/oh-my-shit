import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAvailableCharacters } from "../../services/characterService";
import { Character } from "../../types/character";

interface CharacterSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (character: Character) => void;
  currentCharacter: string;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentCharacter,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = useColorScheme() === "dark";
  const { width } = Dimensions.get("window");
  const characterItemWidth = width * 0.35; // 캐릭터 아이템 너비 줄임

  useEffect(() => {
    if (visible) {
      loadCharacters();
    }
  }, [visible]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const availableCharacters = await getAvailableCharacters();
      setCharacters(availableCharacters);
    } catch (error) {
      console.error("캐릭터 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopPress = () => {
    Alert.alert("알림", "아직 준비 중인 기능입니다.", [
      { text: "확인", style: "default" },
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? "#333333" : "#FFFFFF" },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}
            >
              캐릭터 선택
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={[
                  styles.closeButton,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                닫기
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={isDark ? "#BAC095" : "#636B2F"}
              />
              <Text
                style={[
                  styles.loadingText,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                캐릭터 목록을 불러오는 중...
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              snapToInterval={characterItemWidth}
              decelerationRate="fast"
            >
              {/* 상점 아이콘 */}
              <TouchableOpacity
                style={[
                  styles.shopItemContainer,
                  { backgroundColor: "transparent" },
                ]}
                onPress={handleShopPress}
              >
                <View style={styles.shopIconContainer}>
                  <Ionicons
                    name="add-circle"
                    size={50}
                    color={isDark ? "#BAC095" : "#636B2F"}
                  />
                </View>
                <Text
                  style={[
                    styles.characterName,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  상점
                </Text>
              </TouchableOpacity>

              {/* 캐릭터 목록 */}
              {characters.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.characterItemHorizontal,
                    {
                      backgroundColor: "transparent",
                      borderColor:
                        currentCharacter === item.id
                          ? isDark
                            ? "#BAC095"
                            : "#636B2F"
                          : "transparent",
                      width: characterItemWidth,
                    },
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.characterImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.characterName,
                      { color: isDark ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: 300,
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingRight: 5,
  },
  characterItemHorizontal: {
    marginLeft: 3,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    height: 170,
  },
  shopItemContainer: {
    marginLeft: 0,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    height: 170,
    width: 120,
  },
  shopIconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 6,
  },
  characterName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
