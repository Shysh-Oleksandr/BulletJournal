import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo } from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Checkbox from "components/Checkbox";
import Typography from "components/Typography";
import { BIG_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";

import { Habit } from "../types";

type Props = {
  habit: Habit;
  isActive: boolean;
};

const HabitItem = ({ habit, isActive }: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const bgGradientColors = useMemo(
    () =>
      isActive
        ? [theme.colors.cyan300, theme.colors.cyan500]
        : [theme.colors.white, theme.colors.cyan300],
    [isActive],
  );

  const color = isActive ? theme.colors.policeBlue : theme.colors.darkBlueText;

  const onDetailsPress = useCallback(() => {
    navigation.navigate(Routes.EDIT_HABIT, { item: habit });
  }, [navigation, habit]);

  return (
    <Container activeOpacity={0.5}>
      <BgContainer colors={bgGradientColors}>
        <InfoContainer>
          <Checkbox isActive={isActive} />
          <Typography color={color} paddingLeft={16} fontWeight="semibold">
            {habit.label}
          </Typography>
        </InfoContainer>
        <MoreContainer hitSlop={BIG_BUTTON_HIT_SLOP} onPress={onDetailsPress}>
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

export default HabitItem;
