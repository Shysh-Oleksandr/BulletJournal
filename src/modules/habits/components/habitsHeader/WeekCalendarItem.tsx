import { format, isAfter, startOfToday } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { CircularProgress } from "react-native-circular-progress";
import theme from "theme";

import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import styled from "styled-components/native";

const today = startOfToday();

const CIRCLE_SIZE = 40;
const CIRCLE_WIDTH = 5;

const BG_GRADIENT_COLORS = [
  theme.colors.darkSkyBlue,
  theme.colors.cyan500,
] as const;

type Props = {
  date: number;
  percentageCompleted: number;
  isActive: boolean;
  setSelectedDate: (val: number) => void;
};

const WeekCalendarItem = ({
  date,
  percentageCompleted,
  isActive,
  setSelectedDate,
}: Props): JSX.Element => {
  const isDisabled = isAfter(date, today);
  const isCompleted = percentageCompleted >= 100;

  const day = format(date, "EEEEEE", {
    locale: getDateFnsLocale(),
  });

  const bgColor = useMemo(() => {
    if (isDisabled) return theme.colors.crystal;
    if (isCompleted) return theme.colors.cyan500;

    return theme.colors.bubbles;
  }, [isCompleted, isDisabled]);

  return (
    <Container disabled={isDisabled} onPress={() => setSelectedDate(date)}>
      {isActive ? (
        <ActiveContainer colors={BG_GRADIENT_COLORS}>
          <Typography
            fontSize="xs"
            fontWeight="semibold"
            color={theme.colors.white}
            uppercase
          >
            {day}
          </Typography>
        </ActiveContainer>
      ) : (
        <CircularProgress
          fill={isDisabled ? 0 : percentageCompleted}
          size={CIRCLE_SIZE}
          width={CIRCLE_WIDTH}
          rotation={0}
          tintColor={theme.colors.cyan500}
          backgroundColor={theme.colors.crystal}
        >
          {() => (
            <InnerContainer bgColor={bgColor}>
              <Typography
                fontSize="xs"
                fontWeight="semibold"
                uppercase
                adjustsFontSizeToFit
                color={
                  isCompleted ? theme.colors.white : theme.colors.darkBlueText
                }
              >
                {day}
              </Typography>
            </InnerContainer>
          )}
        </CircularProgress>
      )}
    </Container>
  );
};

const Container = styled.TouchableOpacity``;

const ActiveContainer = styled(LinearGradient)`
  border-radius: 14px;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.View<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default WeekCalendarItem;
