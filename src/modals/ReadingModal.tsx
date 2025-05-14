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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../stores/themeStore";
import { supabase } from "../supabase/client"; // 수파베이스 클라이언트 임포트 경로 수정
import { SUPABASE_URL } from "../supabase/config"; // 수파베이스 URL 임포트

interface ReadingModalProps {
  visible: boolean;
  onClose: () => void;
}

// 광고 인터페이스 정의
interface Advertisement {
  id: number;
  url: string;
  title: string;
  created_at?: string;
  image_path?: string; // image_path 속성 추가
}

export const ReadingModal: React.FC<ReadingModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const isClosing = useRef(false);
  const mountedRef = useRef(true);

  const { width } = Dimensions.get("window");
  const imageWidth = width * 0.85; // 모달 너비의 95%

  // 컴포넌트 마운트/언마운트 관리
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 이미지 URL 생성 함수
  const getImageUrl = (ad: Advertisement): string => {
    // 이미 HTTP나 HTTPS URL인 경우 그대로 사용
    if (
      ad.url &&
      (ad.url.startsWith("http://") || ad.url.startsWith("https://"))
    ) {
      return ad.url;
    }

    // 이미지 경로(ad/image.jpg)가 있는 경우 수파베이스 스토리지 URL 생성
    const imagePath = ad.image_path || ad.url;
    return `${SUPABASE_URL}/storage/v1/object/public/${imagePath}`;
  };

  // 수파베이스에서 광고 데이터 가져오기
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);

      // 수파베이스에서 광고 데이터 조회
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // 각 광고 항목에 이미지 URL 추가
        const formattedAds = data.map((ad: Advertisement) => ({
          ...ad,
          url: getImageUrl(ad),
        }));

        setAdvertisements(formattedAds);
      } else {
        // 데이터가 없을 경우 기본 광고 사용
        setAdvertisements([
          {
            id: 1,
            url: "https://placehold.co/600x400/A6BF4F/FFFFFF/png?text=건강한+배변+활동을+위한+식습관",
            title: "건강한 배변 활동을 위한 식습관",
          },
        ]);
      }
    } catch (err) {
      console.error("광고 데이터 로드 오류:", err);
      setError("광고를 불러오는데 실패했습니다.");
      // 오류 발생 시 기본 광고 표시
      setAdvertisements([
        {
          id: 1,
          url: "https://placehold.co/600x400/A6BF4F/FFFFFF/png?text=건강한+배변+활동을+위한+식습관",
          title: "건강한 배변 활동을 위한 식습관",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 모달이 열릴 때 광고 데이터 로드
  useEffect(() => {
    if (visible) {
      fetchAdvertisements();
    }
  }, [visible]);

  // 모달이 열릴 때 랜덤 이미지 선택
  useEffect(() => {
    if (visible && advertisements.length > 0) {
      // 랜덤 인덱스 선택
      const randomIndex = Math.floor(Math.random() * advertisements.length);
      setCurrentIndex(randomIndex);
      setImageError(false);
    }
  }, [visible, advertisements]);

  // 이미지 에러 처리
  const handleImageError = () => {
    console.log("이미지 로드 실패:", currentAd?.url);
    setImageError(true);
  };

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

  // 새로고침 기능
  const handleRefresh = () => {
    fetchAdvertisements();
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
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleRefresh}
                style={styles.refreshButton}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={isDark ? "#BAC095" : "#636B2F"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "#BAC095" : "#636B2F"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={isDark ? "#BAC095" : "#636B2F"}
              />
              <Text
                style={{ color: isDark ? "#CCCCCC" : "#666666", marginTop: 10 }}
              >
                콘텐츠를 불러오는 중...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={40} color="#FF6B6B" />
              <Text
                style={{ color: isDark ? "#FFFFFF" : "#000000", marginTop: 10 }}
              >
                {error}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : advertisements.length > 0 && currentAd ? (
            <>
              <View style={styles.imageContainer}>
                {imageError ? (
                  <View
                    style={[styles.errorImageContainer, { width: imageWidth }]}
                  >
                    <Ionicons
                      name="image-outline"
                      size={60}
                      color={isDark ? "#BAC095" : "#636B2F"}
                    />
                    <Text
                      style={{
                        color: isDark ? "#CCCCCC" : "#666666",
                        marginTop: 10,
                      }}
                    >
                      이미지를 불러올 수 없습니다
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: currentAd.url }}
                    style={[styles.adImage, { width: imageWidth }]}
                    resizeMode="cover"
                    onError={handleImageError}
                  />
                )}

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
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                표시할 콘텐츠가 없습니다.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    marginRight: 15,
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
    backgroundColor: "#f0f0f0", // 이미지 로딩 시 배경색 추가
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#636B2F",
    borderRadius: 6,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  errorImageContainer: {
    height: 300,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});
