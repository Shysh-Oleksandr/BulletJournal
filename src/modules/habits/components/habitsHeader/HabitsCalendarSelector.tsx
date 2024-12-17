import { addDays, isToday } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import theme from "theme";

import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import HabitsCalendarBottomSheet from "./HabitsCalendarBottomSheet";

const BUTTON_SIZE = 48;

const BG_GRADIENT_COLORS = [
  getDifferentColor(theme.colors.cyan600, 25),
  getDifferentColor(theme.colors.cyan600, -15),
] as const;

type Props = {
  selectedDate: number;
  setSelectedDate: (val: number) => void;
};

const HabitsCalendarSelector = ({
  selectedDate,
  setSelectedDate,
}: Props): JSX.Element => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const isSelectedDateToday = isToday(selectedDate);

  const openModal = useCallback(() => {
    setIsBottomSheetOpen(true);
  }, []);

  const onArrowPress = useCallback(
    (isRightArrow = false) => {
      const newDate = addDays(selectedDate, isRightArrow ? 1 : -1).getTime();

      setSelectedDate(newDate);
    },
    [selectedDate, setSelectedDate],
  );

  return (
    <>
      <Container>
        <ArrowsContainer>
          <ArrowContainer
            onPress={() => onArrowPress(false)}
            hitSlop={BUTTON_HIT_SLOP}
          >
            <FontAwesome5
              name="chevron-left"
              color={theme.colors.cyan500}
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
          <ArrowContainer
            onPress={() => onArrowPress(true)}
            hitSlop={BUTTON_HIT_SLOP}
            disabled={isSelectedDateToday}
          >
            <FontAwesome5
              name="chevron-right"
              color={
                isSelectedDateToday ? theme.colors.gray : theme.colors.cyan500
              }
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
        </ArrowsContainer>

        <ButtonContainer hitSlop={SMALL_BUTTON_HIT_SLOP} onPress={openModal}>
          <ActiveContainer colors={BG_GRADIENT_COLORS}>
            <FontAwesome
              name="calendar-o"
              color={theme.colors.white}
              size={theme.fontSizes.xxl}
            />
          </ActiveContainer>
        </ButtonContainer>
      </Container>
      {isBottomSheetOpen && (
        <HabitsCalendarBottomSheet
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          hideBottomSheet={() => setIsBottomSheetOpen(false)}
        />
      )}
    </>
  );
};

const ActiveContainer = styled(LinearGradient)`
  border-radius: 99px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.TouchableOpacity``;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const ArrowsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 30px;
`;

const ArrowContainer = styled.TouchableOpacity``;

export default HabitsCalendarSelector;
