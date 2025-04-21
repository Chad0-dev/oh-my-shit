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
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { HamburgerScreenType } from "../../screens/AppNavigation";
import { MenuItem } from "./MenuItem";

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: HamburgerScreenType) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  visible,
  onClose,
  onNavigate,
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

  // 페이지 이동 처리
  const handleNavigation = (screen: HamburgerScreenType) => {
    if (onNavigate) {
      onNavigate(screen);
      handleClose();
    }
  };

  // 메뉴 아이템 정의
  const menuItems = [
    {
      icon: "🛒",
      label: "상점",
      onPress: () => handleNavigation("store"),
    },
    {
      icon: "📖",
      label: "설명서",
      onPress: () => handleNavigation("manual"),
    },
    {
      icon: "❓",
      label: "도움말",
      onPress: () => handleNavigation("help"),
    },
    {
      icon: "✉️",
      label: "문의하기",
      onPress: () => handleNavigation("contact"),
    },
  ];

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
              backgroundColor: isDark ? "#333333" : "#FFFFFF",
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>MENU</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
                textStyle={{
                  color: isDark ? "#FFFFFF" : "#333333",
                  fontSize: 16,
                }}
              />
            ))}
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
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
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
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    padding: 8,
  },
});
