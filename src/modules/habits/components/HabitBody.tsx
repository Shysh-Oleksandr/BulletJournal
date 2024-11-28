import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useRef } from "react";
import { Easing } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TextInput } from "react-native-gesture-handler";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Checkbox from "components/Checkbox";
import Input from "components/Input";
import Typography from "components/Typography";
import { BIG_BUTTON_HIT_SLOP } from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { noop } from "utils/utilityFunctions";

import { useHabitTags } from "../hooks/useHabitTags";
import { Habit, HabitTypes } from "../types";

const CIRCLE_SIZE = 42;
const CIRCLE_WIDTH = 5;

type Props = {
  habit: Habit;
  inputValue: string;
  isCompleted: boolean;
  amountTarget?: number;
  percentageCompleted?: number;
  updateLog?: () => void;
  onChange?: (text: string) => void;
};

const HabitBody = ({
  habit,
  inputValue,
  isCompleted,
  amountTarget,
  percentageCompleted,
  updateLog,
  onChange,
}: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const inputRef = useRef<TextInput | null>(null);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const color = isCompleted
    ? theme.colors.policeBlue
    : theme.colors.darkBlueText;

  const bgGradientColors = useMemo(
    () =>
      isCompleted
        ? [theme.colors.cyan300, theme.colors.cyan500]
        : [theme.colors.white, theme.colors.cyan300],
    [isCompleted],
  );

  const tags = useHabitTags({ habit, amountTarget });

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
    navigation.navigate(Routes.HABIT_STATS, { item: habit });
  }, [navigation, habit]);

  return (
    <Container activeOpacity={0.5} disabled={!updateLog} onPress={onCardPress}>
      <BgContainer colors={bgGradientColors}>
        <RowContainer>
          <InfoContainer>
            <AnimatedCircularProgress
              duration={600}
              easing={Easing.ease}
              fill={percentageCompleted ?? 0}
              size={CIRCLE_SIZE}
              width={CIRCLE_WIDTH}
              rotation={0}
              tintColor={theme.colors.cyan500}
              backgroundColor={theme.colors.crystal}
            >
              {() => (
                <InnerContainer isCompleted={isCompleted}>
                  {isCheckHabitType ? (
                    <Checkbox
                      isActive={isCompleted}
                      borderRadius={0}
                      size={CIRCLE_SIZE}
                      iconSize={theme.fontSizes.md}
                      bgColor="transparent"
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
                        labelColor={isCompleted ? theme.colors.white : color}
                        bgColor={
                          isCompleted ? theme.colors.cyan500 : "transparent"
                        }
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
                color={color}
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
                color={color}
                size={theme.fontSizes.xxl}
              />
            </MoreContainer>
          )}
        </RowContainer>
        <TagsContainer>
          {tags.map((tag, index) => (
            <TagContainer key={index} isActive={isCompleted}>
              <Typography
                color={color}
                fontWeight="semibold"
                align="center"
                fontSize="xs"
              >
                {tag}
              </Typography>
            </TagContainer>
          ))}
        </TagsContainer>
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
  background-color: ${({ isCompleted }) =>
    isCompleted ? theme.colors.cyan500 : "transparent"};
  padding: 1px;
`;

const LabelContainer = styled.View`
  flex: 1;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const TagContainer = styled.View<{ isActive: boolean }>`
  z-index: 20;
  padding: 3px 6px;
  background-color: ${({ isActive }) =>
    isActive ? `${theme.colors.cyan400}70` : `${theme.colors.cyan500}25`};
  border-radius: 6px;
`;

export default React.memo(HabitBody);
