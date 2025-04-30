import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
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
            <FlatList
              data={characters}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.characterItem,
                    {
                      backgroundColor: isDark ? "#444444" : "#F5F5F5",
                      borderColor:
                        currentCharacter === item.id
                          ? isDark
                            ? "#BAC095"
                            : "#636B2F"
                          : "transparent",
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
              )}
              numColumns={2}
              contentContainerStyle={styles.listContainer}
            />
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
    maxHeight: "80%",
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
  listContainer: {
    paddingBottom: 20,
  },
  characterItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  characterImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: "500",
  },
});
