import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { COLORS } from "../../constants/theme";
import { useAuthStore } from "../../stores/authStore";

interface AvatarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const AvatarMenu: React.FC<AvatarMenuProps> = ({ visible, onClose }) => {
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 배경 오버레이 (터치 시 메뉴 닫힘) */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* 메뉴 컨테이너 */}
        <View style={styles.menuContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.email || "사용자"}</Text>
            <Text style={styles.userAge}>
              {user?.age_group ? `${user.age_group}대` : ""}
            </Text>
          </View>

          {/* 메뉴 아이템 */}
          <View style={styles.menuItems}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                console.log("내 프로필 선택됨");
                onClose();
              }}
            >
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>내 프로필</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                console.log("설정 선택됨");
                onClose();
              }}
            >
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                console.log("앱 정보 선택됨");
                onClose();
              }}
            >
              <Text style={styles.menuIcon}>ℹ️</Text>
              <Text style={styles.menuText}>앱 정보</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userAge: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  menuItems: {
    padding: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#333333",
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
    fontSize: 14,
    color: "#EF4444",
  },
});
