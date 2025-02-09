import {
  addDays,
  addWeeks,
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
  NEXT_WEEK = "next_week",
  THIS_MONTH = "this_month",
  THIS_YEAR = "this_year",
}

const today = endOfToday();

const dueDateMap = {
  [DueDateOptions.TODAY]: () => today.getTime(),
  [DueDateOptions.TOMORROW]: () => addDays(today, 1).getTime(),
  [DueDateOptions.THIS_WEEK]: () =>
    endOfWeek(today, { weekStartsOn: 1 }).getTime(),
  [DueDateOptions.NEXT_WEEK]: () =>
    endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }).getTime(),
  [DueDateOptions.THIS_MONTH]: () => endOfMonth(today).getTime(),
  [DueDateOptions.THIS_YEAR]: () => endOfYear(today).getTime(),
};

type Props = {
  dueDate: number | null;
  setDueDate: (date: number | null) => void;
  completedAt?: number | null;
  setCompletedAt?: (date: number | null) => void;
};

const DueDatePicker = ({
  dueDate,
  setDueDate,
  completedAt,
  setCompletedAt,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCompletedAtDatePickerVisible, setIsCompletedAtDatePickerVisible] =
    useState(false);

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
    t(`tasks.categories.${option}`);

  const onDueDateOptionPress = (option: DueDateOptions) => {
    if (option === DueDateOptions.CUSTOM) {
      setIsDatePickerVisible(true);
    } else {
      setDueDate(dueDateMap[option]?.() || null);
    }
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
        keyboardShouldPersistTaps="handled"
      >
        {completedAt && (
          <>
            <DueDateOptionContainer
              onPress={() => setIsCompletedAtDatePickerVisible(true)}
              isActive
            >
              <FontAwesome
                name="calendar-check-o"
                color={theme.colors.darkBlueText}
                size={13}
              />
              <Typography fontSize="xs">
                {format(completedAt, "dd/MM/yyyy")}
              </Typography>
            </DueDateOptionContainer>
            <VerticalDivider />

            <DateTimePickerModal
              isVisible={isCompletedAtDatePickerVisible}
              date={new Date(completedAt)}
              accentColor={theme.colors.cyan600}
              mode="date"
              onConfirm={(newDate: Date) => {
                setIsCompletedAtDatePickerVisible(false);
                requestAnimationFrame(() => {
                  setCompletedAt?.(endOfDay(newDate).getTime());
                });
              }}
              onCancel={() => setIsCompletedAtDatePickerVisible(false)}
              maximumDate={today}
            />
          </>
        )}
        {[DueDateOptions.CUSTOM, ...Object.keys(dueDateMap)].map((option) => (
          <DueDateOptionContainer
            key={option}
            onPress={() => onDueDateOptionPress(option as DueDateOptions)}
            isActive={option === selectedDueDateOption && !!dueDate}
          >
            <FontAwesome
              name="calendar-times-o"
              color={theme.colors.darkBlueText}
              size={13}
            />
            <Typography fontSize="xs">
              {option === DueDateOptions.CUSTOM && dueDate
                ? format(dueDate, "dd/MM/yyyy")
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
        onConfirm={(newDate: Date) => {
          setIsDatePickerVisible(false);
          requestAnimationFrame(() => {
            setDueDate(endOfDay(newDate).getTime());
          });
        }}
        onCancel={() => setIsDatePickerVisible(false)}
        minimumDate={today}
      />
    </>
  );
};

const CancelDueDateButtonContainer = styled.TouchableOpacity``;

const DueDatePickerContainer = styled.ScrollView``;

const VerticalDivider = styled.View`
  height: 100%;
  width: 2px;
  background-color: ${theme.colors.cyan400};
`;

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
