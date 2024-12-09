import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  label: string;
  currentTarget: number;
  setCurrentTarget: (val: number) => void;
};

const HabitTargetSelector = ({
  label,
  currentTarget,
  setCurrentTarget,
}: Props) => {
  const { t } = useTranslation();

  const [initialTargetValue] = useState(currentTarget.toString());

  const [inputValue, setInputValue] = useState(initialTargetValue);

  const onChange = (text: string) => {
    const newValue = Number(text);

    if (isNaN(newValue)) {
      return;
    }

    if (newValue < 0) {
      setInputValue("0");
      setCurrentTarget(0);

      return;
    }

    setInputValue(text);
    setCurrentTarget(Number(text));
  };

  return (
    <Container>
      <HalfContainer>
        <Typography fontWeight="semibold" fontSize="lg" paddingRight={8}>
          {label}
        </Typography>
      </HalfContainer>
      <AmountContainer>
        <Input
          value={inputValue}
          isCentered
          paddingHorizontal={1}
          paddingVertical={4}
          keyboardType="number-pad"
          placeholder={initialTargetValue}
          maxWidth={80}
          selectTextOnFocus
          fontSize="lg"
          onChange={onChange}
        />
        <Typography fontSize="lg" paddingLeft={8} numberOfLines={1}>
          {t("habits.times")}
        </Typography>
      </AmountContainer>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 12px 8px 0;
`;

const HalfContainer = styled.View`
  width: 50%;
`;

const AmountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

export default HabitTargetSelector;
