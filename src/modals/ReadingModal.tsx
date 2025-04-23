import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../stores/themeStore";

interface ReadingModalProps {
  visible: boolean;
  onClose: () => void;
}

// 광고 이미지 목록
const ADVERTISEMENT_IMAGES = [
  {
    id: 1,
    url: "https://placehold.co/600x400/A6BF4F/FFFFFF/png?text=건강한+배변+활동을+위한+식습관",
    title: "건강한 배변 활동을 위한 식습관",
  },
  {
    id: 2,
    url: "https://placehold.co/600x400/BAC095/333333/png?text=올바른+화장실+자세",
    title: "올바른 화장실 자세 가이드",
  },
  {
    id: 3,
    url: "https://placehold.co/600x400/738C22/FFFFFF/png?text=식이섬유+풍부한+음식+추천",
    title: "식이섬유 풍부한 음식 추천",
  },
  {
    id: 4,
    url: "https://placehold.co/600x400/94A53C/FFFFFF/png?text=장건강에+좋은+음식",
    title: "장건강에 좋은 음식",
  },
  {
    id: 5,
    url: "https://placehold.co/600x400/D4DE95/333333/png?text=하루+2리터+물+마시기",
    title: "하루 2리터 물 마시기",
  },
];

export const ReadingModal: React.FC<ReadingModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const isClosing = useRef(false);
  const mountedRef = useRef(true);

  const { width } = Dimensions.get("window");
  const imageWidth = width * 0.85; // 모달 너비의 95%

  // 광고 이미지
  const advertisements = ADVERTISEMENT_IMAGES;

  // 컴포넌트 마운트/언마운트 관리
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 모달이 열릴 때 랜덤 이미지 선택
  useEffect(() => {
    if (visible) {
      // 랜덤 인덱스 선택
      const randomIndex = Math.floor(Math.random() * advertisements.length);
      setCurrentIndex(randomIndex);
    }
  }, [visible]);

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
        Animated.timing(scaleAnim, {
          toValue: 1,
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
        Animated.timing(scaleAnim, {
          toValue: 0.9,
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
      Animated.timing(scaleAnim, {
        toValue: 0.9,
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

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? advertisements.length - 1 : prev - 1
    );
  };

  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentIndex((prev) =>
      prev === advertisements.length - 1 ? 0 : prev + 1
    );
  };

  // 현재 표시중인 광고
  const currentAd = advertisements[currentIndex];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#BAC095" : "#636B2F" },
              ]}
            >
              읽을거리
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#BAC095" : "#636B2F"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentAd.url }}
              style={[styles.adImage, { width: imageWidth }]}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.imageTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {currentAd.title}
            </Text>
          </View>

          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrevImage}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={isDark ? "#BAC095" : "#636B2F"}
              />
              <Text
                style={[
                  styles.navButtonText,
                  { color: isDark ? "#BAC095" : "#636B2F" },
                ]}
              >
                이전
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.pageIndicator,
                { color: isDark ? "#CCCCCC" : "#666666" },
              ]}
            >
              {currentIndex + 1} / {advertisements.length}
            </Text>

            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextImage}
            >
              <Text
                style={[
                  styles.navButtonText,
                  { color: isDark ? "#BAC095" : "#636B2F" },
                ]}
              >
                다음
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={isDark ? "#BAC095" : "#636B2F"}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  adImage: {
    height: 300,
    borderRadius: 8,
  },
  imageTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.2)",
    marginTop: 10,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pageIndicator: {
    fontSize: 12,
  },
});
