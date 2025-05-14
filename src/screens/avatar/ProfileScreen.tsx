import React, { useState, useEffect, useRef } from "react";
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
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CharacterSelectModal } from "../../components/character/CharacterSelectModal";
import { getCharacterImageUrl } from "../../services/characterService";
import { Character } from "../../types/character";
import { useCharacterStore } from "../../stores/characterStore";
import { optimizeImageUrl } from "../../services/imagePreloadService";

export const ProfileScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const {
    setNickname: updateStoreNickname,
    setBirthdate: updateStoreBirthdate,
  } = useProfileStore();
  const { selectedCharacter, setSelectedCharacter } = useCharacterStore();

  // 사용자 프로필 상태
  const [nickname, setNickname] = useState<string>("사용자");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingCharacters, setIsLoadingCharacters] =
    useState<boolean>(false);

  // 캐릭터 선택 모달 상태
  const [isCharacterSelectModalVisible, setCharacterSelectModalVisible] =
    useState(false);

  // 비밀번호 변경 관련 상태 추가
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

        // 캐릭터 설정
        if (data.character_type) {
          try {
            // 캐릭터 타입을 소문자로 변환하여 일관성 유지
            const characterType = data.character_type.toLowerCase();

            // CharacterBox에서 사용하는 것과 동일한 방식으로 이미지 URL 가져오기
            const imageUrl = await getCharacterImageUrl(
              characterType,
              "normal"
            );

            // 이미지 URL 최적화 (CharacterBox와 동일한 방식)
            const optimizedImageUrl = optimizeImageUrl(imageUrl);

            const character: Character = {
              id: characterType,
              name:
                characterType.charAt(0).toUpperCase() + characterType.slice(1),
              imageUrl: optimizedImageUrl,
            };

            // 홈 화면과 동일한 상태 관리를 위해 스토어를 먼저 업데이트
            useCharacterStore.getState().setSelectedCharacter(character);

            // 로컬 상태도 업데이트
            setSelectedCharacter(character);
          } catch (error) {
            console.error("캐릭터 이미지 로드 오류:", error);
            // 기본 캐릭터로 대체
            try {
              const imageUrl = await getCharacterImageUrl("basic", "normal");

              // 기본 캐릭터 이미지도 최적화
              const optimizedImageUrl = optimizeImageUrl(imageUrl);

              const character: Character = {
                id: "basic",
                name: "Basic",
                imageUrl: optimizedImageUrl,
              };

              // 홈 화면과 동일한 상태 관리를 위해 스토어를 먼저 업데이트
              useCharacterStore.getState().setSelectedCharacter(character);

              // 로컬 상태도 업데이트
              setSelectedCharacter(character);
            } catch (error) {
              console.error("기본 캐릭터 로드 실패:", error);
            }
          }
        } else {
          // 기본 캐릭터 설정
          try {
            const imageUrl = await getCharacterImageUrl("basic", "normal");

            // 기본 캐릭터 이미지 최적화
            const optimizedImageUrl = optimizeImageUrl(imageUrl);

            const character: Character = {
              id: "basic",
              name: "Basic",
              imageUrl: optimizedImageUrl,
            };

            // 홈 화면과 동일한 상태 관리를 위해 스토어를 먼저 업데이트
            useCharacterStore.getState().setSelectedCharacter(character);

            // 로컬 상태도 업데이트
            setSelectedCharacter(character);
          } catch (error) {
            console.error("기본 캐릭터 로드 실패:", error);
          }
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

      setIsEditing(false);
      Alert.alert("성공", "프로필이 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 저장 중 오류:", error);
      Alert.alert("오류", "프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 변경 함수
  const handlePasswordChange = async () => {
    try {
      // 유효성 검사
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("입력 오류", "새 비밀번호가 일치하지 않습니다.");
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert("입력 오류", "비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }

      setIsChangingPassword(true);

      // 현재 비밀번호로 다시 로그인 시도하여 확인
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        Alert.alert("인증 오류", "현재 비밀번호가 일치하지 않습니다.");
        setIsChangingPassword(false);
        return;
      }

      // 비밀번호 변경
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      // 비밀번호 변경 성공
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("성공", "비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      Alert.alert("오류", "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsChangingPassword(false);
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

      {/* 프로필 영역 (캐릭터 이미지를 여기로 이동) */}
      <View style={styles.profileContainer}>
        <View style={styles.characterImageWrapper}>
          {isLoadingCharacters ? (
            <View
              style={[
                styles.characterPlaceholder,
                { backgroundColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <ActivityIndicator size="large" color="#636B2F" />
              <Text
                style={{ color: isDark ? "#FFFFFF" : "#000000", marginTop: 10 }}
              >
                로딩 중...
              </Text>
            </View>
          ) : selectedCharacter?.imageUrl ? (
            <Image
              source={{ uri: selectedCharacter.imageUrl }}
              style={styles.characterImage}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={300}
            />
          ) : (
            <View
              style={[
                styles.characterPlaceholder,
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
          {isEditing && (
            <TouchableOpacity
              style={styles.changeCharacterButtonSmall}
              onPress={() => setCharacterSelectModalVisible(true)}
            >
              <Ionicons name="color-palette" size={22} color="#FFFFFF" />
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

      {/* 캐릭터 정보 섹션 */}
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
          계정 관리
        </Text>

        {/* 비밀번호 변경 */}
        <TouchableOpacity
          onPress={() => setShowPasswordModal(true)}
          style={[
            styles.passwordChangeButton,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
        >
          <View style={styles.passwordChangeContent}>
            <Ionicons
              name="key-outline"
              size={24}
              color={isDark ? "#CCCCCC" : "#636B2F"}
            />
            <Text
              style={[
                styles.passwordChangeText,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              비밀번호 변경
            </Text>
          </View>
          <Text
            style={[
              styles.passwordChangeDescription,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            비밀번호를 직접 변경합니다
          </Text>
        </TouchableOpacity>

        {/* 계정 탈퇴 */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "계정 탈퇴",
              "정말로 탈퇴하시겠습니까?\n모든 기록 및 데이터가 영구적으로 삭제됩니다.",
              [
                { text: "취소", style: "cancel" },
                {
                  text: "탈퇴",
                  style: "destructive",
                  onPress: () => {
                    // 두 번째 확인
                    Alert.alert(
                      "최종 확인",
                      "정말 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
                      [
                        { text: "취소", style: "cancel" },
                        {
                          text: "탈퇴 확인",
                          style: "destructive",
                          onPress: async () => {
                            try {
                              await useAuthStore.getState().deleteAccount();
                            } catch (e) {
                              const msg =
                                e instanceof Error
                                  ? e.message
                                  : typeof e === "string"
                                  ? e
                                  : "계정 삭제에 실패했습니다.";
                              Alert.alert("오류", msg);
                            }
                          },
                        },
                      ]
                    );
                  },
                },
              ]
            );
          }}
          style={[
            styles.deleteAccountButton,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
        >
          <View style={styles.deleteAccountContent}>
            <MaterialIcons name="delete-forever" size={24} color="#ff4d4f" />
            <Text style={[styles.deleteAccountText, { color: "#ff4d4f" }]}>
              계정 탈퇴
            </Text>
          </View>
          <Text
            style={[
              styles.deleteAccountDescription,
              { color: isDark ? "#BBBBBB" : "#666666" },
            ]}
          >
            앱 사용 기록이 모두 삭제됩니다
          </Text>
        </TouchableOpacity>
      </View>

      {/* 캐릭터 선택 모달 */}
      <CharacterSelectModal
        visible={isCharacterSelectModalVisible}
        onClose={() => setCharacterSelectModalVisible(false)}
        onSelect={handleCharacterSelect}
        currentCharacter={selectedCharacter?.id || "basic"}
      />

      {/* 비밀번호 변경 모달 */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: isDark ? "#333333" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              비밀번호 변경
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark ? "#444444" : "#F5F5F5",
                  color: isDark ? "#FFFFFF" : "#000000",
                  borderColor: isDark ? "#555555" : "#DDDDDD",
                },
              ]}
              placeholder="현재 비밀번호"
              placeholderTextColor={isDark ? "#AAAAAA" : "#999999"}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark ? "#444444" : "#F5F5F5",
                  color: isDark ? "#FFFFFF" : "#000000",
                  borderColor: isDark ? "#555555" : "#DDDDDD",
                },
              ]}
              placeholder="새 비밀번호"
              placeholderTextColor={isDark ? "#AAAAAA" : "#999999"}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark ? "#444444" : "#F5F5F5",
                  color: isDark ? "#FFFFFF" : "#000000",
                  borderColor: isDark ? "#555555" : "#DDDDDD",
                },
              ]}
              placeholder="새 비밀번호 확인"
              placeholderTextColor={isDark ? "#AAAAAA" : "#999999"}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={isChangingPassword}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: "#636B2F",
                    opacity: isChangingPassword ? 0.7 : 1,
                  },
                ]}
                onPress={handlePasswordChange}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>
                    변경
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  characterImageWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F0F0F0",
  },
  characterPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  changeCharacterButtonSmall: {
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
  datePickerButton: {
    width: "65%",
    alignItems: "flex-end",
  },
  datePickerText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
  },
  characterInfoContainer: {
    alignItems: "center",
    padding: 10,
  },
  characterDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 22,
  },
  changeCharacterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeCharacterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteAccountButton: {
    padding: 15,
    borderRadius: 8,
  },
  deleteAccountContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  deleteAccountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  deleteAccountDescription: {
    fontSize: 14,
    marginLeft: 34,
  },
  passwordChangeButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordChangeContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  passwordChangeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  passwordChangeDescription: {
    fontSize: 14,
    marginLeft: 34,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 15,
  },
  // 모달 스타일
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
    borderWidth: 1,
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
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#888888",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
