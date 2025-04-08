import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AmountType } from "../services/recordService";

interface SuccessDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: AmountType, memo: string) => void;
}

export const SuccessDetailModal: React.FC<SuccessDetailModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<AmountType>("보통");
  const [memo, setMemo] = useState("");

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

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (visible) {
      setAmount("보통");
      setMemo("");
    }
  }, [visible]);

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

  const handleSubmit = () => {
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
        // 한 번만 호출되도록 상태 관리
        const currentAmount = amount;
        const currentMemo = memo;

        // 상태 초기화
        isAnimating.current = false;
        isClosing.current = false;

        // 콜백 호출
        onSubmit(currentAmount, currentMemo);
      }
    });
  };

  // 양 선택 버튼 렌더링
  const renderAmountButton = (value: AmountType, label: string) => (
    <TouchableOpacity
      style={[
        styles.amountButton,
        amount === value ? styles.amountButtonSelected : null,
      ]}
      onPress={() => setAmount(value)}
    >
      <Text
        style={[
          styles.amountButtonText,
          amount === value ? styles.amountButtonTextSelected : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
            <Text style={styles.modalTitle}>세부 정보 입력</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#636B2F" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.sectionTitle}>배변량</Text>
            <View style={styles.amountContainer}>
              {renderAmountButton("많음", "많음")}
              {renderAmountButton("보통", "보통")}
              {renderAmountButton("적음", "적음")}
              {renderAmountButton("이상", "이상")}
            </View>

            <Text style={styles.sectionTitle}>메모</Text>
            <TextInput
              style={styles.memoInput}
              multiline
              placeholder="특이사항이나 메모를 입력하세요."
              value={memo}
              onChangeText={setMemo}
              maxLength={200}
            />

            <View style={styles.charCountContainer}>
              <Text style={styles.charCount}>{memo.length}/200</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>저장</Text>
          </TouchableOpacity>
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
    width: "85%",
    maxHeight: "80%",
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
  scrollContainer: {
    width: "100%",
    maxHeight: 300,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
    alignSelf: "flex-start",
  },
  amountContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  amountButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F5F5F5",
    minWidth: "22%",
    alignItems: "center",
  },
  amountButtonSelected: {
    backgroundColor: "#636B2F",
    borderColor: "#636B2F",
  },
  amountButtonText: {
    fontSize: 14,
    color: "#333",
  },
  amountButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  memoInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 5,
    backgroundColor: "#F9F9F9",
  },
  charCountContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  charCount: {
    fontSize: 12,
    color: "#888",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#636B2F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
