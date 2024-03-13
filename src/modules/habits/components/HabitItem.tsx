import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import theme from "theme";

import { Entypo, FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import { BIG_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import { Habit } from "../types";

type Props = {
  habit: Habit;
  isActive: boolean;
};

const HabitItem = ({ habit, isActive }: Props): JSX.Element => {
  const bgGradientColors = useMemo(
    () =>
      isActive
        ? [theme.colors.cyan300, theme.colors.cyan500]
        : [theme.colors.white, theme.colors.cyan300],
    [isActive],
  );

  const color = isActive ? theme.colors.policeBlue : theme.colors.darkBlueText;

  return (
    <Container activeOpacity={0.5}>
      <BgContainer colors={bgGradientColors}>
        <InfoContainer>
          <CheckboxContainer isActive={isActive}>
            {isActive && (
              <FontAwesome
                name="check"
                color={theme.colors.white}
                size={theme.fontSizes.sm}
              />
            )}
          </CheckboxContainer>
          <Typography color={color} fontWeight="semibold">
            {habit.label}
          </Typography>
        </InfoContainer>
        <MoreContainer hitSlop={BIG_BUTTON_HIT_SLOP}>
          <Entypo
            name="dots-three-horizontal"
            color={color}
            size={theme.fontSizes.xxl}
          />
        </MoreContainer>
      </BgContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  margin-bottom: 16px;
  elevation: 10;
  border-radius: 8px;
  background-color: ${theme.colors.white};
`;

const BgContainer = styled(LinearGradient)`
  width: 100%;
  border-radius: 8px;
  padding: 20px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MoreContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: space-between;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CheckboxContainer = styled.View<{ isActive: boolean }>`
  padding: 2px;
  width: 24px;
  height: 24px;
  background-color: ${({ isActive }) =>
    isActive ? theme.colors.cyan500 : theme.colors.gray};
  border-radius: 6px;
  margin-right: 16px;
  align-items: center;
  justify-content: center;
`;

export default HabitItem;
