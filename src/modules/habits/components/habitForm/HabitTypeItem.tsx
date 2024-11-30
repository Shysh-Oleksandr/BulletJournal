import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import { HabitTypes } from "modules/habits/types";
import styled from "styled-components/native";

type Props = {
  habitType: HabitTypes;
  active: boolean;
  isDisabled?: boolean;
  onPress: (habitType: HabitTypes) => void;
};

const HabitTypeItem = ({ habitType, isDisabled, active, onPress }: Props) => {
  const { t } = useTranslation();

  const label = useMemo(() => {
    switch (habitType) {
      case HabitTypes.CHECK:
        return t("habits.check");

      case HabitTypes.AMOUNT:
        return t("habits.amount");

      default:
        return t("habits.time");
    }
  }, [habitType, t]);

  const iconName = useMemo(() => {
    switch (habitType) {
      case HabitTypes.CHECK:
        return "check";

      case HabitTypes.AMOUNT:
        return "sort-amount-asc";

      default:
        return "clock-o";
    }
  }, [habitType]);

  return (
    <TypeItemContainer
      activeOpacity={0.4}
      active={active}
      disabled={isDisabled}
      onPress={() => onPress(habitType)}
    >
      <IconContainer>
        <FontAwesome
          name={iconName}
          color={active ? theme.colors.white : theme.colors.cyan600}
          size={theme.fontSizes.lg}
        />
      </IconContainer>
      <Typography
        fontSize="sm"
        fontWeight={active ? "bold" : "semibold"}
        color={active ? theme.colors.white : theme.colors.cyan600}
        paddingTop={4}
      >
        {label}
      </Typography>
    </TypeItemContainer>
  );
};

const TypeItemContainer = styled.TouchableOpacity<{
  active: boolean;
  disabled?: boolean;
}>`
  align-items: center;
  background-color: ${({ active, disabled }) =>
    active
      ? theme.colors.cyan500
      : disabled
      ? theme.colors.azureishWhite
      : theme.colors.cyan300};
  border-radius: 12px;
  padding: 8px;
  flex: 1;
`;

const IconContainer = styled.View`
  align-items: center;
`;

export default HabitTypeItem;
