import { Article } from "./ArticleCard";

// 목업 게시물 데이터 생성
export const generateMockArticles = (count: number = 20): Article[] => {
  const keywords = [
    "건강팁",
    "식이요법",
    "영양소",
    "운동",
    "배변습관",
    "질환정보",
    "약품정보",
  ];
  const titles = [
    "건강한 배변 습관을 위한 식이요법",
    "좋은 장 건강을 유지하는 방법",
    "소화 건강을 위한 영양소 가이드",
    "아침에 배변을 촉진하는 음식",
    "장 건강에 도움이 되는 운동법",
    "장 건강과 수면의 관계",
    "변비 예방을 위한 일상 습관",
    "면역력 강화와 장 건강의 연관성",
    "장내 세균총 균형을 위한 식품",
    "스트레스와 소화 건강의 관계",
  ];

  const contentStart = [
    "건강한 배변 습관은 전반적인 건강에 매우 중요합니다.",
    "우리 몸의 소화 시스템은 복잡한 메커니즘을 가지고 있습니다.",
    "장 건강은 면역 체계와 밀접한 관련이 있습니다.",
    "규칙적인 배변 습관을 유지하는 것이 중요합니다.",
    "물을 충분히 마시는 것은 장 건강에 필수적입니다.",
    "식이 섬유가 풍부한 식단은 장 건강을 촉진합니다.",
    "프로바이오틱스는 장내 건강한 세균을 증가시킵니다.",
    "스트레스는 소화 시스템에 부정적인 영향을 미칠 수 있습니다.",
    "규칙적인 운동은 장 운동을 촉진합니다.",
    "장 건강은 전반적인 건강 상태를 반영합니다.",
  ];

  const longContent = `
건강한 배변 습관은 전반적인 건강에 매우 중요합니다. 불규칙한 배변 습관은 다양한 건강 문제를 초래할 수 있으며, 이는 일상 생활의 질을 저하시킬 수 있습니다.

좋은 장 건강을 유지하기 위해서는 다음과 같은 습관을 기르는 것이 중요합니다:

1. 충분한 수분 섭취: 하루에 최소 8잔의 물을 마시는 것이 좋습니다. 물은 장내 노폐물을 부드럽게 만들어 배변을 용이하게 합니다.

2. 식이 섬유 섭취: 과일, 채소, 전곡물, 콩류 등 식이 섬유가 풍부한 식품을 충분히 섭취하세요. 식이 섬유는 장 운동을 촉진하고 변의 부피를 증가시켜 배변을 돕습니다.

3. 규칙적인 운동: 적절한 신체 활동은 장 근육을 강화하고 소화 시스템의 기능을 개선합니다. 하루 30분 정도의 걷기, 조깅, 수영 등의 운동이 도움이 됩니다.

4. 스트레스 관리: 스트레스는 장 건강에 부정적인 영향을 미칠 수 있습니다. 명상, 요가, 깊은 호흡 등의 스트레스 완화 기법을 실천하세요.

5. 프로바이오틱스 섭취: 요구르트, 김치, 된장 등 발효 식품에 포함된 프로바이오틱스는 장내 유익균의 균형을 유지하는 데 도움이 됩니다.

6. 규칙적인 식사 시간: 일정한 시간에 식사를 하면 소화 시스템이 규칙적으로 작동하도록 도와줍니다.

이러한 습관들을 일상 생활에 꾸준히 실천한다면, 건강한 배변 습관을 유지하는 데 큰 도움이 될 것입니다. 건강한 장은 영양소 흡수를 개선하고, 면역 체계를 강화하며, 전반적인 건강 상태를 향상시키는 데 중요한 역할을 합니다.

만약 지속적인 소화 문제나 배변 이상이 있다면, 전문 의료인과 상담하는 것이 좋습니다. 간단한 식이 조절이나 생활 습관의 변화로 많은 장 건강 문제를 개선할 수 있습니다.
`;

  return Array(count)
    .fill(0)
    .map((_, index) => {
      const today = new Date();
      today.setDate(today.getDate() - Math.floor(Math.random() * 30));
      const date = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      const title =
        titles[Math.floor(Math.random() * titles.length)] +
        (Math.random() > 0.5 ? ` ${index + 1}` : "");
      const contentStarter =
        contentStart[Math.floor(Math.random() * contentStart.length)];

      return {
        id: index + 1,
        keyword,
        date,
        title,
        content: `${contentStarter} ${longContent}`,
        views: Math.floor(Math.random() * 500) + 10,
        source:
          Math.random() > 0.3
            ? "건강정보 포털"
            : Math.random() > 0.5
            ? "국민건강보험공단"
            : "대한장연구학회",
      };
    });
};
