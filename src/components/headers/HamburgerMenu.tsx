import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  BackHandler,
} from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { Ionicons } from "@expo/vector-icons";

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useThemeStore();
  const slideAnim = useRef(new Animated.Value(-210)).current;
  const isClosing = useRef(false);
  const mountedRef = useRef(true);

  // 컴포넌트 마운트/언마운트 관리
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 뒤로가기 버튼 처리
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible && !isClosing.current) {
          handleClose();
          return true;
        }
        return false;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [visible]);

  // 애니메이션 처리
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      // 열기 애니메이션
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (mountedRef.current) {
      // 닫기 애니메이션
      Animated.timing(slideAnim, {
        toValue: -210,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 메뉴 닫기 처리
  const handleClose = () => {
    if (isClosing.current) return;

    isClosing.current = true;
    // 닫기 애니메이션 후 onClose 호출
    Animated.timing(slideAnim, {
      toValue: -210,
      duration: 150,
      useNativeDriver: true,
    }).start(({ finished }) => {
      onClose();
      if (mountedRef.current) {
        isClosing.current = false;
      }
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: "#FFFFFF",
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>메뉴</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>홈</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>프로필</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>설정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>도움말</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>통계</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    top: 72,
    left: 0,
    bottom: "50%",
    width: 210,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#636B2F",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    color: "#000000",
  },
});
