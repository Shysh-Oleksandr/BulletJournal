import React, { useState } from "react";
import theme from "theme";

import Input from "components/Input";
import Typography from "components/Typography";
import styled from "styled-components/native";

import FormLabel from "./FormLabel";

type Props = {
  currentImportance: number;
  setCurrentImportance: React.Dispatch<React.SetStateAction<number>>;
};

const ImportanceInput = ({
  currentImportance,
  setCurrentImportance,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState(
    currentImportance?.toString() ?? "",
  );

  const onChange = (text: string) => {
    const newValue = Number(text);

    if (isNaN(newValue)) {
      return;
    }

    if (newValue > 10) {
      setInputValue("10");
      setCurrentImportance(10);

      return;
    }
    if (newValue < 0) {
      setInputValue("0");
      setCurrentImportance(0);

      return;
    }

    setInputValue(text);
    setCurrentImportance(Number(text));
  };

  const onBlur = () => {
    if (inputValue.trim() === "") {
      setInputValue("0");
      setCurrentImportance(0);
    }
  };

  return (
    <Section>
      <Input
        value={inputValue}
        isCentered
        maxWidth={40}
        paddingHorizontal={1}
        keyboardType="number-pad"
        selectTextOnFocus
        fontSize="lg"
        maxLength={2}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Typography
        fontSize="xl"
        paddingLeft={3}
        paddingTop={7}
        color={theme.colors.darkBlueText}
      >
        /10
      </Typography>
      <FormLabel label="Importance" />
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: center;
  width: 100%;
`;

export default ImportanceInput;
