import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Easing } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TextInput } from "react-native-gesture-handler";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Checkbox from "components/Checkbox";
import Input from "components/Input";
import Typography from "components/Typography";
import { BIG_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useHabitColors } from "modules/habits/hooks/useHabitColors";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { noop } from "utils/utilityFunctions";

import { Habit, HabitTypes } from "../../types";

import HabitTags from "./HabitTags";

const CIRCLE_SIZE = 42;
const CIRCLE_WIDTH = 5;

type Props = {
  habit: Habit;
  inputValue: string;
  isCompleted: boolean;
  amountTarget?: number;
  percentageCompleted?: number;
  isActiveOnSelectedDate?: boolean;
  updateLog?: () => void;
  onChange?: (text: string) => void;
  onLongPress?: () => void;
};

const HabitBody = ({
  habit,
  inputValue,
  isCompleted,
  amountTarget,
  percentageCompleted,
  isActiveOnSelectedDate = true,
  updateLog,
  onChange,
  onLongPress,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const navigation = useAppNavigation();

  const inputRef = useRef<TextInput | null>(null);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const {
    textColor,
    gradientColors,
    labelBgColor,
    checkboxBgColor,
    tintColor,
    bgTintColor,
  } = useHabitColors(isCompleted, habit.color);

  const inputFontSize = useMemo(() => {
    if (inputValue.length < 3) return "md";

    if (inputValue.length < 4) return "sm";

    if (inputValue.length < 5) return "xs";

    return "xxs";
  }, [inputValue.length]);

  const onCardPress = useCallback(() => {
    if (isCheckHabitType) {
      updateLog?.();

      return;
    }

    inputRef.current?.focus();
  }, [isCheckHabitType, updateLog]);

  const onDetailsPress = useCallback(() => {
    navigation.navigate(Routes.HABIT_STATS, { id: habit._id });
  }, [navigation, habit]);

  return (
    <Container
      activeOpacity={0.5}
      disabled={!updateLog}
      onPress={onCardPress}
      onLongPress={onLongPress}
    >
      <BgContainer colors={gradientColors}>
        {!isActiveOnSelectedDate && (
          <HabitTopTagContainer bgColor={labelBgColor}>
            <Typography fontSize="sm" fontWeight="semibold">
              {t("habits.notStartedYet")}
            </Typography>
          </HabitTopTagContainer>
        )}
        <RowContainer>
          <InfoContainer>
            <AnimatedCircularProgress
              duration={600}
              easing={Easing.ease}
              fill={Math.min(percentageCompleted ?? 0, 100)}
              size={CIRCLE_SIZE}
              width={CIRCLE_WIDTH}
              rotation={0}
              tintColor={tintColor}
              backgroundColor={bgTintColor}
            >
              {() => (
                <InnerContainer isCompleted={isCompleted}>
                  {isCheckHabitType ? (
                    <Checkbox
                      isActive={isCompleted}
                      borderRadius={0}
                      size={CIRCLE_SIZE}
                      iconSize={theme.fontSizes.md}
                      iconColor={textColor}
                      bgColor={checkboxBgColor}
                    />
                  ) : (
                    <>
                      <Input
                        value={inputValue}
                        inputRef={inputRef}
                        isCentered
                        paddingHorizontal={0}
                        maxLength={7}
                        numberOfLines={1}
                        keyboardType="number-pad"
                        fontWeight="semibold"
                        labelColor={textColor}
                        bgColor={checkboxBgColor}
                        withBorder={false}
                        selectTextOnFocus
                        fontSize={inputFontSize}
                        onChange={onChange ?? noop}
                        onBlur={updateLog}
                        editable={!!onChange}
                      />
                    </>
                  )}
                </InnerContainer>
              )}
            </AnimatedCircularProgress>

            <LabelContainer>
              <Typography
                color={textColor}
                paddingLeft={14}
                paddingRight={6}
                numberOfLines={2}
                fontSize="lg"
                fontWeight="semibold"
              >
                {habit.label}
              </Typography>
            </LabelContainer>
          </InfoContainer>
          {!!updateLog && (
            <MoreContainer
              hitSlop={BIG_BUTTON_HIT_SLOP}
              onPress={onDetailsPress}
            >
              <Entypo
                name="dots-three-horizontal"
                color={textColor}
                size={theme.fontSizes.xxl}
              />
            </MoreContainer>
          )}
        </RowContainer>
        <HabitTags
          habit={habit}
          amountTarget={amountTarget}
          labelBgColor={labelBgColor}
          textColor={textColor}
        />
      </BgContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  margin-bottom: 16px;
  elevation: 10;
  border-radius: 8px;
  background-color: ${theme.colors.white};
  width: 100%;
`;

const BgContainer = styled(LinearGradient)`
  width: 100%;
  border-radius: 8px;
  padding: 20px 16px 12px;
`;

const RowContainer = styled.View`
  width: 100%;
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
  flex: 1;
`;

const InnerContainer = styled.View<{ isCompleted: boolean }>`
  border-radius: 999px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const LabelContainer = styled.View`
  flex: 1;
`;

const HabitTopTagContainer = styled.View<{ bgColor: string }>`
  position: absolute;
  top: -12px;
  left: 8px;
  background-color: ${theme.colors.cyan400};
  padding: 3px 8px;
  border-radius: 5px;
  z-index: 10;
`;

export default React.memo(HabitBody);
