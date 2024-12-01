import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import Typography from "components/Typography";
import { HabitTypes } from "modules/habits/types";
import styled from "styled-components/native";

import HabitTypeItem from "./HabitTypeItem";

const DEFAULT_AMOUNT_VALUE = 10;

const HABIT_TYPES = [HabitTypes.CHECK, HabitTypes.AMOUNT, HabitTypes.TIME];

type Props = {
  selectedType: HabitTypes;
  currentAmount: number | null;
  currentUnits: string;
  isDisabled?: boolean;
  setSelectedType: (val: HabitTypes) => void;
  setCurrentAmount: (val: number) => void;
  setCurrentUnits: (val: string) => void;
};

const HabitTypeSelector = ({
  selectedType,
  currentAmount,
  currentUnits,
  isDisabled,
  setSelectedType,
  setCurrentAmount,
  setCurrentUnits,
}: Props) => {
  const { t } = useTranslation();

  const [amountValue, setAmountValue] = useState(
    currentAmount ? currentAmount.toString() : "",
  );

  const onAmountChange = (text: string) => {
    const newValue = Number(text);

    if (isNaN(newValue)) {
      return;
    }

    if (newValue < 0) {
      setAmountValue("0");
      setCurrentAmount(0);

      return;
    }

    setAmountValue(text);
    setCurrentAmount(Number(text));
  };

  const onUnitsChange = (text: string) => {
    const trimmedText = text.trim();

    setCurrentUnits(trimmedText);
  };

  return (
    <Container>
      <Typography
        fontWeight="semibold"
        fontSize="lg"
        paddingBottom={8}
        align="center"
      >
        {t("habits.type")}
      </Typography>
      <TypesContainer>
        {HABIT_TYPES.map((habitType) => (
          <HabitTypeItem
            key={habitType}
            habitType={habitType}
            active={selectedType === habitType}
            isDisabled={isDisabled}
            onPress={() => {
              if (currentAmount === null && habitType !== HabitTypes.CHECK) {
                setCurrentAmount(DEFAULT_AMOUNT_VALUE);
                setAmountValue(DEFAULT_AMOUNT_VALUE.toString());
              }
              if (habitType === HabitTypes.TIME && !currentUnits) {
                setCurrentUnits(t("habits.defaultTimeUnits"));
              }
              setSelectedType(habitType);
            }}
          />
        ))}
      </TypesContainer>
      {selectedType !== HabitTypes.CHECK && (
        <TargetContainer>
          <AmountContainer>
            <Typography fontSize="sm">{t("habits.target")}</Typography>
            <Input
              value={amountValue}
              isCentered
              paddingHorizontal={1}
              paddingVertical={4}
              keyboardType="number-pad"
              placeholder={DEFAULT_AMOUNT_VALUE.toString()}
              selectTextOnFocus
              fontSize="lg"
              onChange={onAmountChange}
            />
          </AmountContainer>
          <UnitsContainer>
            <Typography fontSize="sm">{t("habits.units")}</Typography>
            <Input
              value={currentUnits}
              isCentered
              paddingHorizontal={1}
              paddingVertical={4}
              selectTextOnFocus
              placeholder={t(
                selectedType === HabitTypes.AMOUNT
                  ? "habits.unitsAmountPlaceholder"
                  : "habits.unitsTimePlaceholder",
              )}
              fontSize="lg"
              autoCapitalize="none"
              onChange={onUnitsChange}
            />
          </UnitsContainer>
        </TargetContainer>
      )}
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  margin: 12px 8px 4px;
`;

const TypesContainer = styled.View`
  width: 100%;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TargetContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const AmountContainer = styled.View`
  width: 48%;
`;

const UnitsContainer = styled.View`
  width: 48%;
`;

export default HabitTypeSelector;
