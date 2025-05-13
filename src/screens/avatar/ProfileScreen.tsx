import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import { useProfileStore } from "../../stores/profileStore";
import { supabase } from "../../supabase/client";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CharacterSelectModal } from "../../components/character/CharacterSelectModal";
import { getCharacterImageUrl } from "../../services/characterService";
import { Character } from "../../types/character";
import { useCharacterStore } from "../../stores/characterStore";

export const ProfileScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const {
    setAvatarUrl: updateStoreAvatar,
    setNickname: updateStoreNickname,
    setBirthdate: updateStoreBirthdate,
  } = useProfileStore();
  const { selectedCharacter, setSelectedCharacter } = useCharacterStore();

  // 사용자 프로필 상태
  const [nickname, setNickname] = useState<string>("사용자");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingCharacters, setIsLoadingCharacters] =
    useState<boolean>(false);

  // 캐릭터 선택 모달 상태
  const [isCharacterSelectModalVisible, setCharacterSelectModalVisible] =
    useState(false);

  // 프로필 데이터 로드
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // 사용자 프로필 데이터 로드
  const loadUserProfile = async () => {
    try {
      if (!user) return;

      setIsLoadingCharacters(true); // 캐릭터 로딩 상태 시작

      // Supabase에서 사용자 프로필 데이터 조회
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("프로필 로드 오류:", error.message);
        return;
      }

      if (data) {
        // 프로필 데이터가 있는 경우
        setNickname(data.nickname || "사용자");
        setEmail(user.email || "");

        // 생년월일 설정
        if (data.birthdate) {
          setBirthdate(new Date(data.birthdate));
          updateStoreBirthdate(data.birthdate);
        }

        // 아바타 URL 설정
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
          updateStoreAvatar(data.avatar_url);
        }

        // 캐릭터 설정
        if (data.character_type) {
          try {
            const character: Character = {
              id: data.character_type,
              name:
                data.character_type.charAt(0).toUpperCase() +
                data.character_type.slice(1),
              imageUrl: await getCharacterImageUrl(
                data.character_type,
                "normal"
              ),
            };
            setSelectedCharacter(character);
          } catch (error) {
            // 기본 캐릭터로 대체
            const character: Character = {
              id: "basic",
              name: "Basic",
              imageUrl: await getCharacterImageUrl("basic", "normal"),
            };
            setSelectedCharacter(character);
          }
        } else {
          // 기본 캐릭터 설정
          const character: Character = {
            id: "basic",
            name: "Basic",
            imageUrl: await getCharacterImageUrl("basic", "normal"),
          };
          setSelectedCharacter(character);
        }

        updateStoreNickname(data.nickname || "사용자");
      } else {
        // 프로필 데이터가 없는 경우 새 프로필 생성

        // 기본 값 설정
        const defaultNickname = user.email
          ? user.email.split("@")[0]
          : "사용자";
        setNickname(defaultNickname);
        setEmail(user.email || "");
        updateStoreNickname(defaultNickname);

        // 기본 캐릭터 설정
        const character: Character = {
          id: "basic",
          name: "Basic",
          imageUrl: await getCharacterImageUrl("basic", "normal"),
        };
        setSelectedCharacter(character);

        // Supabase에 새 프로필 생성
        const { error: insertError } = await supabase.from("profiles").insert({
          user_id: user.id,
          nickname: defaultNickname,
          birthdate: null,
          character_type: "basic",
          created_at: new Date(),
          updated_at: new Date(),
        });

        if (insertError) {
          console.error("프로필 생성 오류:", insertError.message);
        }
      }
    } catch (error) {
      console.error("프로필 로드 중 예외 발생:", error);
    } finally {
      setIsLoadingCharacters(false); // 로딩 상태 종료
    }
  };

  const handleCharacterSelect = async (character: Character) => {
    try {
      if (!user) return;

      // 스토어에 선택된 캐릭터 저장
      setSelectedCharacter(character);

      // 프로필 업데이트
      const { error } = await supabase
        .from("profiles")
        .update({ character_type: character.id })
        .eq("user_id", user.id);

      if (error) {
        console.error("캐릭터 업데이트 오류:", error.message);
        throw error;
      }

      setCharacterSelectModalVisible(false);
    } catch (error) {
      console.error("캐릭터 선택 중 오류:", error);
      Alert.alert("오류", "캐릭터 선택 중 문제가 발생했습니다.");
    }
  };

  // 아바타 이미지 업로드 처리
  const processImageUpload = async (imageUri: string) => {
    try {
      // 로딩 상태 시작
      setIsUploading(true);
      setAvatarUrl(null);

      // 타임아웃 설정 (30초)
      const uploadPromise = uploadAvatarImageWithFileSystem(imageUri);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("업로드 시간 초과")), 30000);
      });

      // 이미지 업로드 (타임아웃 적용)
      const newAvatarUrl = await Promise.race([uploadPromise, timeoutPromise]);

      // 로딩 상태 종료
      setIsUploading(false);

      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
        updateStoreAvatar(newAvatarUrl);
        Alert.alert("성공", "프로필 이미지가 업데이트되었습니다.");
        return true;
      } else {
        Alert.alert("업로드 실패", "이미지 업로드 중 오류가 발생했습니다.");
        return false;
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      setIsUploading(false);
      Alert.alert("업로드 실패", "이미지 처리 중 오류가 발생했습니다.");
      return false;
    }
  };

  // 아바타 이미지 선택 및 업로드
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // 이미지 품질을 더 낮게 설정 (0.7 → 0.5)
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await processImageUpload(imageUri);
      }
    } catch (error) {
      console.error("이미지 선택 중 오류:", error);
      setIsUploading(false);
      Alert.alert("오류", "이미지 선택 중 문제가 발생했습니다.");
    }
  };

  // 이미지 업로드 함수 최적화
  const uploadAvatarImageWithFileSystem = async (
    uri: string
  ): Promise<string | null> => {
    try {
      if (!user) return null;

      // 파일 이름 생성 (유저 ID + 타임스탬프)
      const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // FileSystem을 사용하여 파일 정보 확인
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        return null;
      }

      // Supabase에서 제공하는 업로드 URL 가져오기
      const { data, error } = await supabase.storage
        .from("avatar")
        .createSignedUploadUrl(filePath);

      if (error) {
        throw new Error(`서명된 URL 생성 실패: ${error.message}`);
      }

      const { signedUrl, path } = data;

      // 파일 직접 업로드 (FileSystem.uploadAsync 사용)
      const uploadResult = await FileSystem.uploadAsync(signedUrl, uri, {
        httpMethod: "PUT",
        headers: {
          "Content-Type": `image/${fileExt}`,
        },
      });

      if (uploadResult.status !== 200) {
        throw new Error(`업로드 실패: HTTP 상태 ${uploadResult.status}`);
      }

      // 업로드된 이미지의 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from("avatar")
        .getPublicUrl(path);

      return urlData?.publicUrl || null;
    } catch (error) {
      console.error("파일 시스템 업로드 오류:", error);
      throw error;
    }
  };

  // 생년월일 선택 처리
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthdate;

    // Android는 자동으로 닫히므로 iOS에서만 처리
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (currentDate) {
      setBirthdate(currentDate);
    }
  };

  // 포맷된 생년월일 문자열 반환
  const getFormattedBirthdate = (): string => {
    if (!birthdate) return "선택되지 않음";

    const year = birthdate.getFullYear();
    const month = String(birthdate.getMonth() + 1).padStart(2, "0");
    const day = String(birthdate.getDate()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일`;
  };

  // 날짜 선택기 표시 처리
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // 프로필 저장
  const saveProfile = async () => {
    try {
      if (!user) return;

      const profileData = {
        nickname,
        birthdate: birthdate ? birthdate.toISOString().split("T")[0] : null,
        avatar_url: avatarUrl,
        character_type: selectedCharacter?.id || "basic",
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("user_id", user.id);

      if (error) {
        console.error("프로필 업데이트 오류:", error.message);
        throw error;
      }

      // 프로필 스토어 업데이트
      updateStoreNickname(nickname);
      updateStoreBirthdate(
        birthdate ? birthdate.toISOString().split("T")[0] : null
      );
      if (avatarUrl) {
        updateStoreAvatar(avatarUrl);
      }

      setIsEditing(false);
      Alert.alert("성공", "프로필이 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 저장 중 오류:", error);
      Alert.alert("오류", "프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          프로필
        </Text>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>편집</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 아바타 이미지 */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          {isUploading ? (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <ActivityIndicator size="large" color="#636B2F" />
              <Text
                style={{ color: isDark ? "#FFFFFF" : "#000000", marginTop: 10 }}
              >
                업로드 중...
              </Text>
            </View>
          ) : avatarUrl ? (
            <Image
              source={avatarUrl}
              style={styles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <FontAwesome5
                name="user-alt"
                size={50}
                color={isDark ? "#CCCCCC" : "#7D7D7D"}
              />
            </View>
          )}
          {isEditing && !isUploading && (
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={pickImage}
              disabled={isUploading}
            >
              <Ionicons name="camera" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={[styles.username, { color: isDark ? "#FFFFFF" : "#000000" }]}
        >
          {nickname}
        </Text>
        <Text style={[styles.email, { color: isDark ? "#BBBBBB" : "#666666" }]}>
          {email}
        </Text>
      </View>

      {/* 개인 정보 섹션 */}
      <View
        style={[
          styles.section,
          { borderBottomColor: isDark ? "#333333" : "#EEEEEE" },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          개인 정보
        </Text>

        {/* 닉네임 */}
        <View style={styles.infoRow}>
          <Text
            style={[
              styles.infoLabel,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            닉네임
          </Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.infoInput,
                {
                  color: isDark ? "#FFFFFF" : "#000000",
                  borderBottomColor: isDark ? "#555555" : "#CCCCCC",
                },
              ]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임 입력"
              placeholderTextColor={isDark ? "#777777" : "#AAAAAA"}
            />
          ) : (
            <Text
              style={[
                styles.infoValue,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {nickname}
            </Text>
          )}
        </View>

        {/* 이메일 */}
        <View style={styles.infoRow}>
          <Text
            style={[
              styles.infoLabel,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            이메일
          </Text>
          <Text
            style={[
              styles.infoValue,
              { color: isDark ? "#FFFFFF" : "#000000" },
            ]}
          >
            {email}
          </Text>
        </View>

        {/* 생년월일 */}
        <View style={styles.infoRow}>
          <Text
            style={[
              styles.infoLabel,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            생년월일
          </Text>
          {isEditing ? (
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.datePickerButton}
            >
              <Text
                style={[
                  styles.datePickerText,
                  {
                    color: isDark ? "#FFFFFF" : "#000000",
                    borderBottomColor: isDark ? "#555555" : "#CCCCCC",
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                  },
                ]}
              >
                {birthdate ? getFormattedBirthdate() : "생년월일 선택"}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.infoValue,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {birthdate ? getFormattedBirthdate() : "선택되지 않음"}
            </Text>
          )}
        </View>

        {/* DateTimePicker (iOS/Android 모두 지원) */}
        {showDatePicker && (
          <View>
            <DateTimePicker
              value={birthdate || new Date(1990, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
              style={{ width: Platform.OS === "ios" ? "100%" : undefined }}
            />

            {/* iOS에서만 표시되는 확인 버튼 */}
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#636B2F",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  alignSelf: "flex-end",
                }}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>확인</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* 캐릭터 설정 섹션 */}
      <View
        style={[
          styles.section,
          { borderBottomColor: isDark ? "#333333" : "#EEEEEE" },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#FFFFFF" : "#000000" },
          ]}
        >
          캐릭터 설정
        </Text>

        <View style={styles.characterPreviewContainer}>
          {isLoadingCharacters ? (
            <View style={styles.characterLoadingContainer}>
              <ActivityIndicator size="large" color="#636B2F" />
              <Text
                style={{ color: isDark ? "#BBBBBB" : "#666666", marginTop: 10 }}
              >
                캐릭터 로딩 중...
              </Text>
            </View>
          ) : selectedCharacter?.imageUrl ? (
            <>
              <View style={styles.characterImageContainer}>
                <Image
                  source={{ uri: selectedCharacter.imageUrl }}
                  style={styles.characterPreview}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={300}
                />
                <Text
                  style={[
                    styles.characterName,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {selectedCharacter.name}
                </Text>
                {isEditing && (
                  <TouchableOpacity
                    style={[
                      styles.changeCharacterButton,
                      { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
                    ]}
                    onPress={() => setCharacterSelectModalVisible(true)}
                  >
                    <Text
                      style={[
                        styles.changeCharacterText,
                        { color: isDark ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      캐릭터 변경
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <View style={styles.characterLoadingContainer}>
              <Text style={{ color: isDark ? "#BBBBBB" : "#666666" }}>
                캐릭터를 불러올 수 없습니다
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  backgroundColor: "#636B2F",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                }}
                onPress={loadUserProfile}
              >
                <Text style={{ color: "#FFFFFF" }}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* 캐릭터 선택 모달 */}
      <CharacterSelectModal
        visible={isCharacterSelectModalVisible}
        onClose={() => setCharacterSelectModalVisible(false)}
        onSelect={handleCharacterSelect}
        currentCharacter={selectedCharacter?.id || "basic"}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#636B2F",
    borderRadius: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  saveButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#636B2F",
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  changeAvatarButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#636B2F",
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    width: "30%",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    width: "65%",
    textAlign: "right",
  },
  infoInput: {
    fontSize: 16,
    width: "65%",
    textAlign: "right",
    padding: 5,
    borderBottomWidth: 1,
  },
  passwordChangeButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  passwordChangeText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
  characterPreviewContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  characterImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  characterPreview: {
    width: 160,
    height: 160,
    marginBottom: 15,
  },
  characterInfo: {
    alignItems: "center",
    width: "100%",
  },
  characterName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 15,
    textAlign: "center",
  },
  changeCharacterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  changeCharacterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  characterModalContainer: {
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#888888",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  characterGrid: {
    paddingVertical: 10,
  },
  selectedCharacterOption: {
    borderWidth: 2,
  },
  characterOptionImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  characterOptionName: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  modalCloseText: {
    fontWeight: "500",
  },
  datePickerButton: {
    width: "65%",
    alignItems: "flex-end",
  },
  datePickerText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
  },
  characterLoadingContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
