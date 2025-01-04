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

const DUE_DATE_OPTIONS = Object.values(DueDateOptions);

const today = endOfToday();

type Props = {
  dueDate: number | null;
  setDueDate: (date: number | null) => void;
};

const DueDatePicker = ({ dueDate, setDueDate }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDueDateOption, setSelectedDueDateOption] =
    useState<DueDateOptions | null>(dueDate ? DueDateOptions.CUSTOM : null);

  const datePickerDate = useMemo(
    () => (dueDate ? new Date(dueDate) : today),
    [dueDate],
  );

  const getDueDateOptionTranslation = (option: string) =>
    t(`tasks.dueDateOptions.${option}`);

  const onDueDateOptionPress = (option: DueDateOptions) => {
    const today = endOfToday().getTime();

    setSelectedDueDateOption(option);
    switch (option) {
      case DueDateOptions.CUSTOM:
        setIsDatePickerVisible(true);
        break;
      case DueDateOptions.TOMORROW:
        setDueDate(addDays(today, 1).getTime());
        break;
      case DueDateOptions.THIS_WEEK:
        setDueDate(endOfWeek(today, { weekStartsOn: 1 }).getTime());
        break;
      case DueDateOptions.THIS_MONTH:
        setDueDate(endOfMonth(today).getTime());
        break;
      case DueDateOptions.THIS_YEAR:
        setDueDate(endOfYear(today).getTime());
        break;

      default:
        setDueDate(today);
        break;
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
        {DUE_DATE_OPTIONS.map((option) => (
          <DueDateOptionContainer
            key={option}
            onPress={() => onDueDateOptionPress(option)}
            isActive={option === selectedDueDateOption && !!dueDate}
          >
            <FontAwesome
              name="calendar-check-o"
              color={theme.colors.darkBlueText}
              size={13}
            />
            <Typography fontSize="xs">
              {option === DueDateOptions.CUSTOM &&
              selectedDueDateOption === DueDateOptions.CUSTOM &&
              dueDate
                ? format(dueDate, "dd.MM.yyyy")
                : getDueDateOptionTranslation(option)}
            </Typography>
          </DueDateOptionContainer>
        ))}
        <CancelDueDateButtonContainer
          onPress={() => {
            setDueDate(null);
            setSelectedDueDateOption(null);
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
