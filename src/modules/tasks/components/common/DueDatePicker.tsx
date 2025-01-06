import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  format,
} from "date-fns";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import theme from "theme";

import { Entypo, FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

enum DueDateOptions {
  CUSTOM = "custom",
  TODAY = "today",
  TOMORROW = "tomorrow",
  THIS_WEEK = "this_week",
  THIS_MONTH = "this_month",
  THIS_YEAR = "this_year",
}

const today = endOfToday();

const dueDateMap = {
  [DueDateOptions.TODAY]: () => endOfToday().getTime(),
  [DueDateOptions.TOMORROW]: () => addDays(endOfToday(), 1).getTime(),
  [DueDateOptions.THIS_WEEK]: () =>
    endOfWeek(endOfToday(), { weekStartsOn: 1 }).getTime(),
  [DueDateOptions.THIS_MONTH]: () => endOfMonth(endOfToday()).getTime(),
  [DueDateOptions.THIS_YEAR]: () => endOfYear(endOfToday()).getTime(),
};

type Props = {
  dueDate: number | null;
  setDueDate: (date: number | null) => void;
};

const DueDatePicker = ({ dueDate, setDueDate }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const datePickerDate = useMemo(
    () => (dueDate ? new Date(dueDate) : today),
    [dueDate],
  );

  const selectedDueDateOption = useMemo(() => {
    if (!dueDate) return null;

    for (const [option, calculateDate] of Object.entries(dueDateMap)) {
      if (dueDate === calculateDate()) return option as DueDateOptions;
    }

    return DueDateOptions.CUSTOM;
  }, [dueDate]);

  const getDueDateOptionTranslation = (option: string) =>
    t(`tasks.dueDateOptions.${option}`);

  const onDueDateOptionPress = (option: DueDateOptions) => {
    if (option === DueDateOptions.CUSTOM) {
      setIsDatePickerVisible(true);
    } else {
      setDueDate(dueDateMap[option]?.() || null);
    }
  };

  const onDatePickerConfirm = (newDate: Date) => {
    setIsDatePickerVisible(false);
    requestAnimationFrame(() => {
      setDueDate(endOfDay(newDate).getTime());
    });
  };

  return (
    <>
      <DueDatePickerContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
        contentContainerStyle={{
          marginTop: 8,
          alignItems: "center",
          gap: 6,
        }}
        keyboardShouldPersistTaps="always"
      >
        {[DueDateOptions.CUSTOM, ...Object.keys(dueDateMap)].map((option) => (
          <DueDateOptionContainer
            key={option}
            onPress={() => onDueDateOptionPress(option as DueDateOptions)}
            isActive={option === selectedDueDateOption && !!dueDate}
          >
            <FontAwesome
              name="calendar-check-o"
              color={theme.colors.darkBlueText}
              size={13}
            />
            <Typography fontSize="xs">
              {option === DueDateOptions.CUSTOM && dueDate
                ? format(dueDate, "dd.MM.yyyy")
                : getDueDateOptionTranslation(option)}
            </Typography>
          </DueDateOptionContainer>
        ))}
        <CancelDueDateButtonContainer
          onPress={() => {
            setDueDate(null);
          }}
          hitSlop={SMALL_BUTTON_HIT_SLOP}
        >
          <Entypo name="eraser" size={20} color={theme.colors.darkBlueText} />
        </CancelDueDateButtonContainer>
      </DueDatePickerContainer>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={datePickerDate}
        accentColor={theme.colors.cyan600}
        mode="date"
        onConfirm={onDatePickerConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
        minimumDate={today}
      />
    </>
  );
};

const CancelDueDateButtonContainer = styled.TouchableOpacity``;

const DueDatePickerContainer = styled.ScrollView``;

const DueDateOptionContainer = styled.TouchableOpacity<{ isActive: boolean }>`
  padding: 4px 6px;
  border-radius: 6px;
  border: 2px solid ${theme.colors.cyan400};
  flex-direction: row;
  align-items: center;
  gap: 4px;

  ${({ isActive }) => isActive && `background-color: ${theme.colors.cyan400};`}
`;

export default React.memo(DueDatePicker);
