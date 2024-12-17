import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import theme from "theme";

import Typography from "components/Typography";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

const { width: screenWidth } = Dimensions.get("screen");

const CIRCLE_SIZE = screenWidth > 400 ? 40 : 36;
const CIRCLE_WIDTH = 4;

type Props = {
  percentageCompleted: number;
  day: number;
  isDisabled: boolean;
  onDayPress: () => void;
};

const HabitsCalendarDayItem = ({
  percentageCompleted,
  day,
  isDisabled,
  onDayPress,
}: Props): JSX.Element => {
  const isCompleted = percentageCompleted >= 100;

  const { bgColor, textColor, tintColor, tintBgColor } = useMemo(() => {
    let bgColor = theme.colors.white;
    let textColor = theme.colors.cyan600;
    let tintColor = theme.colors.cyan500;
    const tintBgColor = theme.colors.cyan400;

    if (isDisabled) {
      bgColor = theme.colors.cyan400;
    } else if (isCompleted) {
      bgColor = theme.colors.cyan500;
      textColor = theme.colors.white;
      tintColor = theme.colors.cyan500;
    }

    return { bgColor, textColor, tintColor, tintBgColor };
  }, [isCompleted, isDisabled]);

  return (
    <TouchableContainer
      onPress={onDayPress}
      disabled={isDisabled}
      hitSlop={SMALL_BUTTON_HIT_SLOP}
      activeOpacity={0.35}
    >
      <CircularProgress
        fill={isDisabled ? 0 : percentageCompleted}
        size={CIRCLE_SIZE}
        width={CIRCLE_WIDTH}
        rotation={0}
        tintColor={tintColor}
        backgroundColor={tintBgColor}
      >
        {() => (
          <>
            <InnerContainer bgColor={bgColor}>
              <Typography
                align="center"
                fontWeight="semibold"
                color={textColor}
              >
                {day}
              </Typography>
            </InnerContainer>
          </>
        )}
      </CircularProgress>
    </TouchableContainer>
  );
};

const TouchableContainer = styled.TouchableOpacity``;

const InnerContainer = styled.View<{
  bgColor: string;
}>`
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor};
`;

export default React.memo(HabitsCalendarDayItem);
