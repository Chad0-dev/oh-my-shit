import React from "react";
import { StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";

export const ArticleScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  const articles = [
    {
      id: 1,
      title: "건강한 대변 상태에 대한 가이드",
      excerpt:
        "건강한 대변은 어떤 모양과 색상을 가지고 있는지, 정상과 비정상의 차이를 알아봅니다.",
      date: "2024-03-30",
      author: "장 건강 연구소",
      category: "건강 정보",
    },
    {
      id: 2,
      title: "변비에 좋은 음식 TOP 10",
      excerpt:
        "만성적인 변비로 고생하는 분들을 위한 자연 식품과 섬유질이 풍부한 음식을 소개합니다.",
      date: "2024-03-28",
      author: "식이요법 전문가",
      category: "식이 정보",
    },
    {
      id: 3,
      title: "장내 미생물과 면역력의 관계",
      excerpt:
        "건강한 장내 미생물이 면역 체계를 강화하는 데 어떤 역할을 하는지 살펴봅니다.",
      date: "2024-03-25",
      author: "미생물학 연구원",
      category: "연구 자료",
    },
  ];

  return (
    <StyledScrollView
      className={`flex-1 ${isDark ? "bg-mossy-darkest" : "bg-white"}`}
    >
      <StyledView className="p-4">
        <StyledText
          className={`text-2xl font-bold mb-4 ${
            isDark ? "text-mossy-light" : "text-mossy-dark"
          }`}
        >
          건강 정보 게시글
        </StyledText>

        {/* 카테고리 필터 */}
        <StyledScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {["전체", "건강 정보", "식이 정보", "연구 자료", "생활 팁"].map(
            (category, index) => (
              <StyledView
                key={index}
                className={`mr-2 px-4 py-2 rounded-full ${
                  index === 0
                    ? isDark
                      ? "bg-mossy-light"
                      : "bg-mossy-dark"
                    : isDark
                    ? "bg-mossy-dark/50"
                    : "bg-mossy-light/50"
                }`}
              >
                <StyledText
                  className={`${
                    index === 0
                      ? isDark
                        ? "text-mossy-darkest font-bold"
                        : "text-white font-bold"
                      : isDark
                      ? "text-mossy-medium"
                      : "text-mossy-darkest"
                  }`}
                >
                  {category}
                </StyledText>
              </StyledView>
            )
          )}
        </StyledScrollView>

        {/* 게시글 목록 */}
        {articles.map((article) => (
          <StyledView
            key={article.id}
            className={`p-4 rounded-lg mb-4 ${
              isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
            }`}
          >
            <StyledView className="flex-row justify-between mb-1">
              <StyledText
                className={`text-xs ${
                  isDark ? "text-mossy-medium" : "text-mossy-dark"
                }`}
              >
                {article.category}
              </StyledText>
              <StyledText
                className={`text-xs ${
                  isDark ? "text-mossy-medium" : "text-mossy-dark"
                }`}
              >
                {article.date}
              </StyledText>
            </StyledView>
            <StyledText
              className={`text-lg font-bold mb-2 ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              {article.title}
            </StyledText>
            <StyledText
              className={`mb-3 ${
                isDark ? "text-mossy-medium" : "text-mossy-darkest"
              }`}
            >
              {article.excerpt}
            </StyledText>
            <StyledView className="flex-row justify-between">
              <StyledText
                className={`text-xs ${
                  isDark ? "text-mossy-light" : "text-mossy-dark"
                }`}
              >
                작성자: {article.author}
              </StyledText>
              <StyledText
                className={`text-xs underline ${
                  isDark ? "text-mossy-light" : "text-mossy-dark"
                }`}
              >
                자세히 보기
              </StyledText>
            </StyledView>
          </StyledView>
        ))}
      </StyledView>
    </StyledScrollView>
  );
};
