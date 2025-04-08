import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const isClosing = useRef(false);
  const mountedRef = useRef(true);
  const isAnimating = useRef(false);

  // 컴포넌트 마운트/언마운트 관리
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 애니메이션 처리
  useEffect(() => {
    if (!mountedRef.current) return;

    if (visible && !isClosing.current && !isAnimating.current) {
      isAnimating.current = true;
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
      ]).start(() => {
        if (mountedRef.current) {
          isAnimating.current = false;
        }
      });
    } else if (!visible && isClosing.current && !isAnimating.current) {
      isAnimating.current = true;
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
      ]).start(() => {
        if (mountedRef.current) {
          isAnimating.current = false;
          isClosing.current = false;
        }
      });
    }
  }, [visible]);

  const handleClose = () => {
    if (isClosing.current || isAnimating.current) return;

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
      if (mountedRef.current) {
        isAnimating.current = false;
        isClosing.current = false;
        onClose();
      }
    });
  };

  const handleSuccess = () => {
    if (isClosing.current || isAnimating.current) return;
    isClosing.current = true;

    // 애니메이션 후 결과 처리
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
      if (mountedRef.current) {
        isAnimating.current = false;
        isClosing.current = false;
        onSuccess();
      }
    });
  };

  const handleFailure = () => {
    if (isClosing.current || isAnimating.current) return;
    isClosing.current = true;

    // 애니메이션 후 결과 처리
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
      if (mountedRef.current) {
        isAnimating.current = false;
        isClosing.current = false;
        onFailure();
      }
    });
  };

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
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>결과 확인</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#636B2F" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalText}>배변을 완료 하셨나요?</Text>

          <View style={styles.resultButtonContainer}>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: "#66BB6A" }]}
              onPress={handleSuccess}
            >
              <Text style={styles.resultButtonText}>성공</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: "#EF5350" }]}
              onPress={handleFailure}
            >
              <Text style={styles.resultButtonText}>실패</Text>
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
    width: "80%",
    backgroundColor: "#FFFFFF",
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#636B2F",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  resultButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  resultButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  resultButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
