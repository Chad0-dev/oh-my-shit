import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText, StyledScrollView } from "../../utils/styled";
import { Ionicons } from "@expo/vector-icons";

// 아이콘 타입을 명시적으로 지정
type IconName = React.ComponentProps<typeof Ionicons>["name"];

export const ManualScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  const textColor = isDark ? "text-gray-200" : "text-mossy-darkest";
  const sectionBg = isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40";
  const titleColor = isDark ? "text-white" : "text-mossy-darkest";
  const iconColor = isDark ? "#BAC095" : "#636B2F";
  const dividerColor = "#3D4127";

  // 기능별 매뉴얼 항목
  const manualSections = [
    {
      title: "배변 기록",
      icon: "water-outline" as IconName,
      items: [
        "홈 화면에서 + 버튼을 눌러 새 배변 기록을 추가할 수 있습니다.",
        "배변 유형, 색상, 상태, 특이사항 등을 선택하여 기록할 수 있습니다.",
        "기록된 데이터는 캘린더와 통계 화면에서 확인할 수 있습니다.",
      ],
    },
    {
      title: "건강 정보",
      icon: "newspaper-outline" as IconName,
      items: [
        "건강 정보 탭에서 다양한 건강 관련 게시글을 확인할 수 있습니다.",
        "키워드별로 게시글을 필터링하여 원하는 정보를 찾을 수 있습니다.",
        "게시글을 클릭하면 상세 내용을 모달 창으로 확인할 수 있습니다.",
      ],
    },
    {
      title: "통계 보기",
      icon: "stats-chart" as IconName,
      items: [
        "통계 탭에서 자신의 배변 패턴을 그래프로 확인할 수 있습니다.",
        "일간, 주간, 월간 단위로 배변 빈도와 상태를 분석할 수 있습니다.",
        "시간대별 배변 패턴을 확인하여 생활 습관 개선에 활용할 수 있습니다.",
      ],
    },
    {
      title: "캘린더",
      icon: "calendar-outline" as IconName,
      items: [
        "캘린더 탭에서 날짜별 배변 기록을 한눈에 확인할 수 있습니다.",
        "특정 날짜를 선택하면 해당 날짜의 상세 기록을 볼 수 있습니다.",
        "월별로 배변 패턴을 확인하여 건강 상태를 모니터링할 수 있습니다.",
      ],
    },
    {
      title: "설정",
      icon: "settings-outline" as IconName,
      items: [
        "설정 메뉴에서 다크 모드를 활성화/비활성화할 수 있습니다.",
        "알림 설정을 통해 정기적인 배변 기록 알림을 받을 수 있습니다.",
        "개인 정보 및 앱 사용 데이터를 관리할 수 있습니다.",
      ],
    },
  ];

  return (
    <StyledScrollView
      className={`flex-1 p-4 ${
        isDark ? "bg-mossy-darkest" : "bg-mossy-lightest"
      }`}
    >
      <StyledView
        className={`rounded-lg p-4 mb-6 ${sectionBg}`}
        style={styles.cardShadow}
      >
        <StyledText className={`text-lg font-bold mb-3 ${titleColor}`}>
          앱 소개
        </StyledText>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <StyledText className={`${textColor} mt-4 mb-3 leading-6`}>
          Oh My Sh!t 앱은 당신의 배변 활동을 기록하고 건강 상태를 모니터링하여
          더 건강한 생활 습관을 형성하도록 도와주는 앱입니다. 일상적인 배변
          활동을 추적하고, 관련 건강 정보를 확인하세요.
        </StyledText>
      </StyledView>

      {manualSections.map((section, index) => (
        <StyledView
          key={index}
          className={`rounded-lg p-4 mb-4 ${sectionBg}`}
          style={styles.cardShadow}
        >
          <StyledView className="flex-row items-center mb-3">
            <Ionicons name={section.icon} size={24} color={iconColor} />
            <StyledText className={`text-lg font-bold ml-2 ${titleColor}`}>
              {section.title}
            </StyledText>
          </StyledView>
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <StyledView className="mt-3">
            {section.items.map((item, idx) => (
              <StyledView key={idx} className="flex-row mb-2 items-start">
                <StyledText className={`${textColor} mr-2`}>•</StyledText>
                <StyledText className={`${textColor} flex-1`}>
                  {item}
                </StyledText>
              </StyledView>
            ))}
          </StyledView>
        </StyledView>
      ))}

      <StyledView
        className={`rounded-lg p-4 mb-4 ${sectionBg}`}
        style={styles.cardShadow}
      >
        <StyledText className={`text-lg font-bold mb-3 ${titleColor}`}>
          도움말
        </StyledText>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <StyledView className="mt-3">
          <StyledText className={`${textColor} mb-2`}>
            • 앱 사용 중 문제가 발생하면 설정 &gt; 도움말 메뉴를 참고하세요.
          </StyledText>
          <StyledText className={`${textColor} mb-2`}>
            • 건강 정보는 참고용이며, 전문적인 의료 조언을 대체할 수 없습니다.
          </StyledText>
          <StyledText className={`${textColor}`}>
            • 개인정보는 안전하게 보호되며, 사용자 동의 없이 외부로 공유되지
            않습니다.
          </StyledText>
        </StyledView>
      </StyledView>

      <StyledView className="items-center my-4">
        <StyledText className={`${textColor} text-sm`}>
          © 2024 Oh My Sh!t. All rights reserved.
        </StyledText>
      </StyledView>
    </StyledScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.7,
  },
});
