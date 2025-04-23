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

// 캐릭터 타입 정의
type CharacterType = "basic" | "happy" | "cool" | "sleepy" | "angry";

// 캐릭터 데이터 (URL은 나중에 동적으로 설정)
const characterOptions: {
  id: CharacterType;
  name: string;
  imageUrl: string | null;
}[] = [
  { id: "basic", name: "기본", imageUrl: null },
  { id: "happy", name: "행복한", imageUrl: null },
  { id: "cool", name: "쿨한", imageUrl: null },
  { id: "sleepy", name: "졸린", imageUrl: null },
  { id: "angry", name: "화난", imageUrl: null },
];

export const ProfileScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const {
    setAvatarUrl: updateStoreAvatar,
    setNickname: updateStoreNickname,
    setBirthdate: updateStoreBirthdate,
    setCharacter: updateStoreCharacter,
  } = useProfileStore();

  // 사용자 프로필 상태
  const [nickname, setNickname] = useState<string>("사용자");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType>("basic");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState<boolean>(true);
  const [characterImageUrls, setCharacterImageUrls] = useState<
    Record<CharacterType, string | null>
  >({
    basic: null,
    happy: null,
    cool: null,
    sleepy: null,
    angry: null,
  });

  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  // 캐릭터 선택 모달 상태
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);

  // 프로필 데이터 로드
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadCharacterImages();
    }
  }, [user]);

  // 캐릭터 이미지 URL 로드
  const loadCharacterImages = async () => {
    setIsLoadingCharacters(true);
    try {
      const characterTypes: CharacterType[] = [
        "basic",
        "happy",
        "cool",
        "sleepy",
        "angry",
      ];
      const urls: Record<CharacterType, string | null> = {
        basic: null,
        happy: null,
        cool: null,
        sleepy: null,
        angry: null,
      };

      // 각 캐릭터 타입에 대한 이미지 URL 로드
      for (const type of characterTypes) {
        // Supabase의 images 버킷에서 캐릭터 이미지 URL 가져오기
        const { data } = await supabase.storage
          .from("images")
          .getPublicUrl(`characters/${type}.png`);

        if (data?.publicUrl) {
          urls[type] = data.publicUrl;

          // 캐릭터 옵션 리스트에도 URL 업데이트
          const index = characterOptions.findIndex((c) => c.id === type);
          if (index >= 0) {
            characterOptions[index].imageUrl = data.publicUrl;
          }
        }
      }

      setCharacterImageUrls(urls);
    } catch (error) {
      console.error("캐릭터 이미지 로드 에러:", error);
    } finally {
      setIsLoadingCharacters(false);
    }
  };

  // 사용자 프로필 데이터 로드
  const loadUserProfile = async () => {
    try {
      if (!user) return;

      // Supabase에서 사용자 프로필 데이터 조회
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("프로필 로드 에러:", error);
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

        // 아바타 URL 설정 (이미 공개 URL인 경우)
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
          updateStoreAvatar(data.avatar_url);
        }

        setSelectedCharacter(data.character_type || "basic");
        updateStoreCharacter(data.character_type || "basic");
        updateStoreNickname(data.nickname || "사용자");
      } else {
        // 프로필 데이터가 없는 경우 새 프로필 생성
        console.log("프로필 데이터 없음, 새 프로필 생성");

        // 기본 값 설정
        const defaultNickname = user.email
          ? user.email.split("@")[0]
          : "사용자";
        setNickname(defaultNickname);
        setEmail(user.email || "");
        updateStoreNickname(defaultNickname);

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
          console.error("새 프로필 생성 에러:", insertError);
        }
      }
    } catch (error) {
      console.error("프로필 로드 중 에러 발생:", error);
    }
  };

  // 아바타 이미지 업로드 처리
  const processImageUpload = async (imageUri: string) => {
    try {
      // 로딩 상태 시작
      setIsUploading(true);
      setAvatarUrl(null);

      console.log("이미지 업로드 시작:", imageUri);

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
        console.log("업로드 성공, URL:", newAvatarUrl);
        setAvatarUrl(newAvatarUrl);
        updateStoreAvatar(newAvatarUrl);
        Alert.alert("성공", "프로필 이미지가 업데이트되었습니다.");
        return true;
      } else {
        console.log("업로드 실패, URL이 없음");
        Alert.alert("업로드 실패", "이미지 업로드 중 오류가 발생했습니다.");
        return false;
      }
    } catch (error) {
      console.error("이미지 처리 에러:", error);
      setIsUploading(false);

      // 에러 메시지 구체화
      const errorMessage =
        error instanceof Error
          ? error.message === "업로드 시간 초과"
            ? "업로드 시간이 초과되었습니다. 더 작은 이미지를 사용해보세요."
            : error.message
          : "이미지 처리 중 오류가 발생했습니다.";

      Alert.alert("업로드 실패", errorMessage);
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
      console.error("이미지 선택 에러:", error);
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
      console.log("파일 정보:", fileInfo);

      if (!fileInfo.exists) {
        console.error("파일이 존재하지 않음:", uri);
        return null;
      }

      // 파일 크기 경고 (1MB 초과)
      if (fileInfo.size && fileInfo.size > 1024 * 1024) {
        console.log(
          `큰 파일 감지: ${
            Math.round((fileInfo.size / 1024 / 1024) * 10) / 10
          }MB`
        );
      }

      // 파일을 Base64로 읽기 (바이너리로 전송하기 위해)
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 단순화된 업로드 방식 - Supabase 클라이언트 직접 사용
      try {
        console.log("Supabase 업로드 시작 - 클라이언트 API");
        const { data, error } = await supabase.storage
          .from("avatar")
          .upload(filePath, decode(fileContent), {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (error) {
          console.error("Supabase 클라이언트 업로드 에러:", error);
          throw new Error(`업로드 실패: ${error.message}`);
        }

        console.log("업로드 성공:", data);

        // 업로드된 이미지의 공개 URL 가져오기
        const { data: urlData } = supabase.storage
          .from("avatar")
          .getPublicUrl(filePath);

        return urlData?.publicUrl || null;
      } catch (error) {
        console.error("업로드 실패:", error);
        throw error;
      }
    } catch (error) {
      console.error("아바타 이미지 업로드 에러:", error);
      throw error;
    }
  };

  // Base64 디코딩 유틸리티 함수
  function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

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
      // DateTimePicker 닫기
      setShowDatePicker(false);

      if (!user) return;

      // 입력 검증
      if (!nickname.trim()) {
        Alert.alert("오류", "닉네임을 입력해주세요.");
        return;
      }

      // 프로필 데이터 준비
      const profileData = {
        user_id: user.id,
        nickname,
        birthdate: birthdate ? birthdate.toISOString().split("T")[0] : null, // YYYY-MM-DD 형식으로 변환
        avatar_url: avatarUrl,
        character_type: selectedCharacter,
        updated_at: new Date(),
      };

      // 먼저 프로필이 이미 존재하는지 확인
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("프로필 확인 에러:", checkError);
        Alert.alert("오류", "프로필 정보 확인 중 오류가 발생했습니다.");
        return;
      }

      let saveError;

      if (existingProfile) {
        // 이미 존재하는 프로필이면 UPDATE 사용
        console.log("기존 프로필 업데이트:", existingProfile.id);
        const { error } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("user_id", user.id);
        saveError = error;
      } else {
        // 존재하지 않는 프로필이면 INSERT 사용
        console.log("새 프로필 생성");
        const { error } = await supabase.from("profiles").insert(profileData);
        saveError = error;
      }

      if (saveError) {
        console.error("프로필 저장 에러:", saveError);
        Alert.alert("오류", "프로필 저장 중 오류가 발생했습니다.");
        return;
      }

      Alert.alert("성공", "프로필이 업데이트되었습니다.");
      setIsEditing(false);

      // 프로필 스토어 업데이트
      updateStoreNickname(nickname);
      updateStoreCharacter(selectedCharacter);
      if (birthdate) {
        updateStoreBirthdate(birthdate.toISOString().split("T")[0]);
      }
      if (avatarUrl) {
        updateStoreAvatar(avatarUrl);
      }
    } catch (error) {
      console.error("프로필 저장 중 에러 발생:", error);
      Alert.alert("오류", "프로필 저장 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 변경
  const changePassword = async () => {
    try {
      // 입력 검증
      if (!currentPassword) {
        Alert.alert("오류", "현재 비밀번호를 입력해주세요.");
        return;
      }

      if (!newPassword) {
        Alert.alert("오류", "새 비밀번호를 입력해주세요.");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("오류", "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert("오류", "비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }

      // Supabase에서 비밀번호 변경
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("비밀번호 변경 에러:", error);
        Alert.alert("오류", "비밀번호 변경 중 오류가 발생했습니다.");
        return;
      }

      Alert.alert("성공", "비밀번호가 성공적으로 변경되었습니다.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("비밀번호 변경 중 에러 발생:", error);
      Alert.alert("오류", "비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  // 캐릭터 선택
  const selectCharacter = (character: CharacterType) => {
    setSelectedCharacter(character);
    setShowCharacterModal(false);
    // 편집 모드에서만 즉시 업데이트하지 않음 (저장시 업데이트)
  };

  // 특정 캐릭터의 이미지 URL 가져오기
  const getCharacterImageUrl = (
    characterType: CharacterType
  ): string | null => {
    return characterImageUrls[characterType] || null;
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

        {/* 비밀번호 변경 버튼 */}
        <TouchableOpacity
          style={[
            styles.passwordChangeButton,
            { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
          ]}
          onPress={() => setShowPasswordModal(true)}
        >
          <MaterialIcons
            name="lock"
            size={18}
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
        </TouchableOpacity>
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
            <ActivityIndicator size="large" color="#636B2F" />
          ) : (
            <>
              <Image
                source={getCharacterImageUrl(selectedCharacter) || undefined}
                style={styles.characterPreview}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={300}
              />
              <View style={styles.characterInfo}>
                <Text
                  style={[
                    styles.characterName,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {
                    characterOptions.find((c) => c.id === selectedCharacter)
                      ?.name
                  }{" "}
                  캐릭터
                </Text>
                {isEditing && (
                  <TouchableOpacity
                    style={[
                      styles.changeCharacterButton,
                      { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
                    ]}
                    onPress={() => setShowCharacterModal(true)}
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
          )}
        </View>
      </View>

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
                },
              ]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="현재 비밀번호"
              placeholderTextColor={isDark ? "#AAAAAA" : "#999999"}
              secureTextEntry
            />

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark ? "#444444" : "#F5F5F5",
                  color: isDark ? "#FFFFFF" : "#000000",
                },
              ]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="새 비밀번호"
              placeholderTextColor={isDark ? "#AAAAAA" : "#999999"}
              secureTextEntry
            />

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark ? "#444444" : "#F5F5F5",
                  color: isDark ? "#FFFFFF" : "#000000",
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="새 비밀번호 확인"
              placeholderTextColor={isDark ? "#AAAAAA" : "#999999"}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={changePassword}
              >
                <Text style={styles.saveButtonText}>변경</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 캐릭터 선택 모달 */}
      <Modal
        visible={showCharacterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCharacterModal(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              styles.characterModalContainer,
              { backgroundColor: isDark ? "#333333" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              캐릭터 선택
            </Text>

            <FlatList
              data={characterOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.characterOption,
                    selectedCharacter === item.id &&
                      styles.selectedCharacterOption,
                    {
                      backgroundColor: isDark ? "#444444" : "#F5F5F5",
                      borderColor:
                        selectedCharacter === item.id
                          ? "#636B2F"
                          : "transparent",
                    },
                  ]}
                  onPress={() => selectCharacter(item.id)}
                >
                  <Image
                    source={item.imageUrl || ""}
                    style={styles.characterOptionImage}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    transition={200}
                  />
                  <Text
                    style={[
                      styles.characterOptionName,
                      { color: isDark ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={2}
              contentContainerStyle={styles.characterGrid}
            />

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                { backgroundColor: isDark ? "#444444" : "#F5F5F5" },
              ]}
              onPress={() => setShowCharacterModal(false)}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                닫기
              </Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
  },
  characterPreview: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  changeCharacterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
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
  characterOption: {
    width: "45%",
    margin: "2.5%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
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
});
