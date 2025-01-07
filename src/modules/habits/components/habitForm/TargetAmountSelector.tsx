import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import Typography from "components/Typography";
import styled from "styled-components/native";

const DEFAULT_AMOUNT_VALUE = 10;

type Props = {
  unitsPlaceholder: string;
  currentAmount: number | null;
  currentUnits: string;
  bgColor?: string;
  setCurrentAmount: (val: number) => void;
  setCurrentUnits: (val: string) => void;
};

const TargetAmountSelector = ({
  unitsPlaceholder,
  currentAmount,
  currentUnits,
  bgColor,
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
      <AmountContainer>
        <Typography fontSize="sm" paddingBottom={2}>
          {t("habits.target")}
        </Typography>
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
          bgColor={bgColor}
        />
      </AmountContainer>
      <UnitsContainer>
        <Typography fontSize="sm" paddingBottom={2}>
          {t("habits.units")}
        </Typography>
        <Input
          value={currentUnits}
          isCentered
          paddingHorizontal={1}
          paddingVertical={4}
          selectTextOnFocus
          placeholder={unitsPlaceholder}
          fontSize="lg"
          autoCapitalize="none"
          onChange={onUnitsChange}
          bgColor={bgColor}
        />
      </UnitsContainer>
    </Container>
  );
};

const Container = styled.View`
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

export default TargetAmountSelector;
