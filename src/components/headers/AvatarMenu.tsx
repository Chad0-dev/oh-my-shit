import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Image,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useProfileStore } from "../../stores/profileStore";
import { MenuItem } from "./MenuItem";
import { HamburgerScreenType } from "../../screens/AppNavigation";

interface AvatarMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: HamburgerScreenType) => void;
}

export const AvatarMenu: React.FC<AvatarMenuProps> = ({
  visible,
  onClose,
  onNavigate,
}) => {
  const { user, signOut } = useAuthStore();
  const { avatarUrl, nickname } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const isClosing = useRef(false);
  const mountedRef = useRef(true);

  // 컴포넌트 마운트/언마운트 관리
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 애니메이션 처리
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      // 열기 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mountedRef.current) {
      // 닫기 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    if (isClosing.current) return;

    isClosing.current = true;
    // 닫기 애니메이션 후 onClose 호출
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      if (mountedRef.current) {
        isClosing.current = false;
      }
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleProfilePress = () => {
    if (onNavigate) {
      onNavigate("profile" as HamburgerScreenType);
    }
    handleClose();
  };

  const handleSettingsPress = () => {
    if (onNavigate) {
      onNavigate("settings" as HamburgerScreenType);
    }
    handleClose();
  };

  const handleInfoPress = () => {
    if (onNavigate) {
      onNavigate("notifications" as HamburgerScreenType);
    }
    handleClose();
  };

  // 메뉴 아이템 정의
  const menuItems = [
    {
      icon: "👤",
      label: "내 프로필",
      onPress: handleProfilePress,
    },
    {
      icon: "⚙️",
      label: "설정",
      onPress: handleSettingsPress,
    },
    {
      icon: "ℹ️",
      label: "앱 정보",
      onPress: handleInfoPress,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* 배경 오버레이 (터치 시 메뉴 닫힘) */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* 메뉴 컨테이너 */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <View
              style={[
                styles.avatarCircle,
                {
                  // 테두리 얇게 수정
                  borderWidth: avatarUrl ? 1.5 : 0,
                  borderColor: "white",
                },
              ]}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: 0, // 이미지 내부 테두리 제거
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Text>
              )}
            </View>
            <Text style={styles.profileName}>{nickname}</Text>
          </View>

          {/* 메뉴 아이템 */}
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
              />
            ))}

            <View style={styles.divider} />

            <MenuItem
              icon="🚪"
              label="로그아웃"
              onPress={handleLogout}
              containerStyle={styles.logoutButton}
              textStyle={styles.logoutText}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    width: 175,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 92,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#636B2F",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#BAC095",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  menuItems: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 4,
  },
  logoutText: {
    color: "#EF4444",
  },
});
