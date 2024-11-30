import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useCalculateHabitBestStreaks } from "modules/habits/hooks/useCalculateHabitBestStreaks";
import { HabitLog } from "modules/habits/types";
import styled from "styled-components/native";

const MIN_ITEM_WIDTH = 30;
const MAX_ITEM_WIDTH = 200;
const STREAK_DAY_WIDTH_MULTIPLIER = 8;

type Props = {
  habitLogs: HabitLog[];
};

const HabitBestStreaksChart = ({ habitLogs }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const streaksData = useCalculateHabitBestStreaks(habitLogs);

  if (streaksData.length === 0) return null;

  return (
    <Container>
      <HeaderContainer>
        <Typography
          fontWeight="bold"
          color={theme.colors.darkBlueText}
          fontSize="xl"
        >
          {t("habits.bestStreaks")}
        </Typography>
      </HeaderContainer>
      <StreaksContainer>
        {streaksData.map((streak, index) => (
          <StreakItemContainer key={index}>
            <Typography color={theme.colors.cyan700} fontSize="xs">
              {format(streak.startDate, "dd MMM yyyy")}
            </Typography>
            <StreakNumberContainer numberOfDays={streak.numberOfDays}>
              <Typography
                fontWeight="bold"
                color={theme.colors.darkBlueText}
                fontSize="lg"
              >
                {streak.numberOfDays}
              </Typography>
            </StreakNumberContainer>
            <Typography color={theme.colors.cyan700} fontSize="xs">
              {format(streak.endDate, "dd MMM yyyy")}
            </Typography>
          </StreakItemContainer>
        ))}
      </StreaksContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 30px;
`;

const HeaderContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StreaksContainer = styled.View`
  margin-top: 10px;
  gap: 4px;
`;

const StreakItemContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StreakNumberContainer = styled.View<{ numberOfDays: number }>`
  padding: 2px 16px;
  background-color: ${theme.colors.cyan300};
  border-radius: 4px;
  align-items: center;
  min-width: ${({ numberOfDays }) =>
    Math.min(
      MIN_ITEM_WIDTH + numberOfDays * STREAK_DAY_WIDTH_MULTIPLIER,
      MAX_ITEM_WIDTH,
    )}px;
`;

export default React.memo(HabitBestStreaksChart);
