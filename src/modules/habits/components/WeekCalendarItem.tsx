import { format, isAfter, startOfToday } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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
  progress: number;
  isActive: boolean;
  setSelectedDate: (val: number) => void;
};

const WeekCalendarItem = ({
  date,
  progress,
  isActive,
  setSelectedDate,
}: Props): JSX.Element => {
  const isDisabled = isAfter(date, today);

  const day = format(date, "EEEEEE", {
    locale: getDateFnsLocale(),
  });

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
          fill={isDisabled ? 0 : progress}
          size={CIRCLE_SIZE}
          width={CIRCLE_WIDTH}
          rotation={0}
          tintColor={theme.colors.cyan500}
          backgroundColor={
            isDisabled ? theme.colors.gray : theme.colors.crystal
          }
        >
          {() => (
            <InnerContainer>
              <Typography fontSize="xs" fontWeight="semibold" uppercase>
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

const InnerContainer = styled.View`
  background-color: ${theme.colors.bubbles};
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default WeekCalendarItem;
