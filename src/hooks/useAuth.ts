import { useAuthStore } from "../stores/authStore";

/**
 * useAuth - 사용자 인증 관련 커스텀 훅
 * useAuthStore를 래핑하여 인증 관련 기능들을 제공합니다.
 */
export const useAuth = () => {
  const { user, isLoading, error, signIn, signUp, signOut, clearError } =
    useAuthStore();

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    isAuthenticated: !!user,
  };
};
