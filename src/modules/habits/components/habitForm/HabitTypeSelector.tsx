import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "components/Typography";
import { HabitTypes } from "modules/habits/types";
import styled from "styled-components/native";

import HabitTypeItem from "./HabitTypeItem";
import TargetAmountSelector from "./TargetAmountSelector";

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
        <TargetAmountSelector
          currentAmount={currentAmount}
          currentUnits={currentUnits}
          setCurrentAmount={setCurrentAmount}
          setCurrentUnits={setCurrentUnits}
          unitsPlaceholder={t(
            selectedType === HabitTypes.AMOUNT
              ? "habits.unitsAmountPlaceholder"
              : "habits.unitsTimePlaceholder",
          )}
        />
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

export default HabitTypeSelector;
