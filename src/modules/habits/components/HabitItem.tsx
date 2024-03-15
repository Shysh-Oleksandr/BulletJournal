import { isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo } from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Checkbox from "components/Checkbox";
import Typography from "components/Typography";
import { BIG_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { useAppDispatch } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { habitsApi } from "../HabitsApi";
import { updateHabitLog } from "../HabitsSlice";
import { Habit, HabitLog, HabitTypes } from "../types";

type Props = {
  habit: Habit;
  selectedDate: number;
};

const HabitItem = ({ habit, selectedDate }: Props): JSX.Element => {
  const [updateHabit] = habitsApi.useUpdateHabitMutation();

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const value = 10;

  const isActive = useMemo(
    () =>
      habit.logs.some(
        (log) =>
          log.percentageCompleted >= 100 && isSameDay(log.date, selectedDate),
      ),
    [habit.logs, selectedDate],
  );

  const bgGradientColors = useMemo(
    () =>
      isActive
        ? [theme.colors.cyan300, theme.colors.cyan500]
        : [theme.colors.white, theme.colors.cyan300],
    [isActive],
  );

  const color = isActive ? theme.colors.policeBlue : theme.colors.darkBlueText;

  const onCardPress = useCallback(() => {
    const hasLog = habit.logs.some((log) => isSameDay(log.date, selectedDate));

    const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

    const amountPercentageCompleted = habit.amountTarget
      ? Math.round((value / habit.amountTarget) * 100)
      : 0;

    const updatedLogs: HabitLog[] = hasLog
      ? habit.logs.map((log) => {
          if (!isSameDay(log.date, selectedDate)) return log;

          const checkedPercentageCompleted =
            log.percentageCompleted === 100 ? 0 : 100;

          const percentageCompleted = isCheckHabitType
            ? checkedPercentageCompleted
            : amountPercentageCompleted;

          return {
            ...log,
            percentageCompleted,
            amount: isCheckHabitType ? checkedPercentageCompleted / 100 : value,
          } as HabitLog;
        })
      : [
          ...habit.logs,
          {
            date: selectedDate,
            percentageCompleted: isCheckHabitType
              ? 100
              : amountPercentageCompleted,
            amount: isCheckHabitType ? 1 : value,
            amountTarget: habit.amountTarget ?? undefined,
          },
        ];

    dispatch(updateHabitLog({ habitId: habit._id, updatedLogs }));

    updateHabit({ ...habit, logs: updatedLogs });
  }, [habit, selectedDate, dispatch, updateHabit]);

  const onDetailsPress = useCallback(() => {
    navigation.navigate(Routes.EDIT_HABIT, { item: habit });
  }, [navigation, habit]);

  return (
    <Container activeOpacity={0.5} onPress={onCardPress}>
      <BgContainer colors={bgGradientColors}>
        <InfoContainer>
          {habit.habitType === HabitTypes.CHECK && (
            <Checkbox isActive={isActive} />
          )}
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
