import React from "react";
import theme from "theme";

import styled from "styled-components/native";

import Typography from "./Typography";

type SwitcherProps = {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  getLocalizedOption?: (option: string) => string;
};

const Switcher = ({
  options,
  selectedOption,
  setSelectedOption,
  getLocalizedOption,
}: SwitcherProps) => {
  return (
    <Container>
      {options.map((option) => (
        <Option
          key={option}
          isSelected={selectedOption === option}
          onPress={() => setSelectedOption(option)}
        >
          <Typography
            color={
              selectedOption === option
                ? theme.colors.white
                : theme.colors.cyan600
            }
            fontWeight={selectedOption === option ? "bold" : "semibold"}
            fontSize="sm"
          >
            {getLocalizedOption ? getLocalizedOption(option) : option}
          </Typography>
        </Option>
      ))}
    </Container>
  );
};

export default Switcher;

const Container = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.cyan300};
  border-radius: 20px;
  padding: 3px;
`;

const Option = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 9px 12px;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.cyan500 : "transparent"};
`;
