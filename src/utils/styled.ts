import { cssInterop } from "nativewind";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

// 스타일링된 컴포넌트 내보내기
export const StyledText = cssInterop(Text, { className: "style" });
export const StyledView = cssInterop(View, { className: "style" });
export const StyledTextInput = cssInterop(TextInput, { className: "style" });
export const StyledScrollView = cssInterop(ScrollView, { className: "style" });
export const StyledTouchableOpacity = cssInterop(TouchableOpacity, {
  className: "style",
});
export const StyledImage = cssInterop(Image, { className: "style" });
export const StyledSafeAreaView = cssInterop(SafeAreaView, {
  className: "style",
});
export const StyledFlatList = cssInterop(FlatList, { className: "style" });
export const StyledKeyboardAvoidingView = cssInterop(KeyboardAvoidingView, {
  className: "style",
});
