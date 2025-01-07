import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import Switcher from "components/Switcher";
import Typography from "components/Typography";
import { HabitFrequency, HabitPeriods } from "modules/habits/types";
import { getDaysByHabitPeriod } from "modules/habits/utils/getDaysByHabitPeriod";
import styled from "styled-components/native";

const DEFAULT_DAYS = "7";

const HabitPeriodsOptions = Object.values(HabitPeriods);

type Props = {
  currentFrequency: HabitFrequency;
  setCurrentFrequency: React.Dispatch<React.SetStateAction<HabitFrequency>>;
};

const HabitFrequencySelector = ({
  currentFrequency,
  setCurrentFrequency,
}: Props) => {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState(
    currentFrequency.days?.toString() ?? DEFAULT_DAYS,
  );

  const onChange = (text: string) => {
    if (text === "") {
      setInputValue("");

      return;
    }

    const newValue = Number(text);

    if (isNaN(newValue)) {
      return;
    }

    const maxDays = getDaysByHabitPeriod(currentFrequency.period);

    const clampedValue = Math.min(Math.max(newValue, 1), maxDays);

    setInputValue(clampedValue.toString());
    setCurrentFrequency((prev) => ({ ...prev, days: clampedValue }));
  };

  const setSelectedOption = (option: string) => {
    const maxDays = getDaysByHabitPeriod(currentFrequency.period);

    setCurrentFrequency({
      ...currentFrequency,
      period: option as HabitPeriods,
      days: Math.min(currentFrequency.days ?? 7, maxDays),
    });

    setInputValue(Math.min(currentFrequency.days ?? 7, maxDays).toString());
  };

  const getLocalizedOption = (option: string) => t(`habits.${option}`);

  return (
    <Container>
      <Typography
        fontWeight="semibold"
        fontSize="lg"
        paddingRight={8}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {t("habits.frequency")}
      </Typography>
      <WeekdaysContainer>
        <AmountContainer>
          <Input
            value={inputValue}
            isCentered
            paddingHorizontal={1}
            paddingVertical={4}
            keyboardType="number-pad"
            placeholder={DEFAULT_DAYS}
            maxWidth={50}
            selectTextOnFocus
            fontSize="lg"
            onChange={onChange}
          />
          <Typography fontSize="lg" paddingLeft={8} numberOfLines={1}>
            {t("habits.times")} {t("habits.per")}
          </Typography>
        </AmountContainer>

        <Switcher
          options={HabitPeriodsOptions}
          selectedOption={currentFrequency.period}
          setSelectedOption={setSelectedOption}
          getLocalizedOption={getLocalizedOption}
        />
      </WeekdaysContainer>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  margin: 20px 8px 10px;
`;

const AmountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

const WeekdaysContainer = styled.View`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
`;

export default HabitFrequencySelector;
