import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import { useCalculateHabitBestStreaks } from "modules/habits/hooks/useCalculateHabitBestStreaks";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { HabitLog } from "modules/habits/types";
import styled from "styled-components/native";

const MIN_ITEM_WIDTH = 30;
const MAX_ITEM_WIDTH = 200;
const STREAK_DAY_WIDTH_MULTIPLIER = 8;

type Props = {
  habitLogs: HabitLog[];
  color?: string;
};

const HabitBestStreaksChart = ({
  habitLogs,
  color,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const streaksData = useCalculateHabitBestStreaks(habitLogs);

  const { textColor, bgColor, activeBgColor } = useHabitStatColors(color);

  if (streaksData.length === 0) return null;

  return (
    <Container>
      <Typography fontWeight="bold" color={textColor} fontSize="xl">
        {t("habits.bestStreaks")}
      </Typography>
      <StreaksContainer>
        {streaksData.map((streak, index) => (
          <StreakItemContainer key={index}>
            <StreakDateContainer isLeft>
              <Typography color={textColor} fontSize="xs">
                {format(streak.startDate, "dd MMM yyyy", {
                  locale: getDateFnsLocale(),
                })}
              </Typography>
            </StreakDateContainer>
            <StreakNumberContainer
              numberOfDays={streak.numberOfDays}
              bgColor={bgColor}
              activeBgColor={activeBgColor}
            >
              <Typography
                fontWeight="bold"
                color={theme.colors.white}
                fontSize="lg"
                align="center"
              >
                {streak.numberOfDays}
              </Typography>
            </StreakNumberContainer>
            <StreakDateContainer>
              <Typography color={textColor} fontSize="xs">
                {format(streak.endDate, "dd MMM yyyy", {
                  locale: getDateFnsLocale(),
                })}
              </Typography>
            </StreakDateContainer>
          </StreakItemContainer>
        ))}
      </StreaksContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 30px;
`;

const StreaksContainer = styled.View`
  margin-top: 10px;
  gap: 4px;
`;

const StreakItemContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;

const StreakDateContainer = styled.View<{
  isLeft?: boolean;
}>`
  flex: 1;
  align-items: ${({ isLeft }) => (isLeft ? "flex-end" : "flex-start")}
  justify-content: ${({ isLeft }) => (isLeft ? "flex-end" : "flex-start")}
`;

const StreakNumberContainer = styled.View<{
  numberOfDays: number;
  bgColor: string;
  activeBgColor: string;
}>`
  padding: 2px 16px;
  background-color: ${({ numberOfDays, activeBgColor, bgColor }) =>
    numberOfDays >= 10 ? activeBgColor : bgColor};
  border-radius: 4px;
  align-items: center;
  min-width: ${({ numberOfDays }) =>
    Math.min(
      MIN_ITEM_WIDTH + numberOfDays * STREAK_DAY_WIDTH_MULTIPLIER,
      MAX_ITEM_WIDTH,
    )}px;
`;

export default React.memo(HabitBestStreaksChart);
