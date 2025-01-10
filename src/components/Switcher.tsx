import React from "react";
import theme from "theme";

import styled from "styled-components/native";

import Typography from "./Typography";

type SwitcherProps = {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  getLocalizedOption?: (option: string) => string;
  fullWidth?: boolean;
};

const Switcher = ({
  options,
  selectedOption,
  setSelectedOption,
  getLocalizedOption,
  fullWidth,
}: SwitcherProps) => {
  return (
    <Container fullWidth={fullWidth}>
      {options.map((option) => (
        <Option
          key={option}
          isSelected={selectedOption === option}
          onPress={() => setSelectedOption(option)}
          fullWidth={fullWidth}
        >
          <Typography
            color={
              selectedOption === option
                ? theme.colors.white
                : theme.colors.cyan600
            }
            fontWeight={selectedOption === option ? "bold" : "semibold"}
            fontSize="sm"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {getLocalizedOption ? getLocalizedOption(option) : option}
          </Typography>
        </Option>
      ))}
    </Container>
  );
};

export default Switcher;

const Container = styled.View<{ fullWidth?: boolean }>`
  flex-direction: row;
  background-color: ${theme.colors.cyan300};
  border-radius: 20px;
  padding: 2px;
  ${({ fullWidth }) => fullWidth && `flex: 1;`}
`;

const Option = styled.TouchableOpacity<{
  isSelected: boolean;
  fullWidth?: boolean;
}>`
  padding: 9px 10px;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.cyan500 : "transparent"};

  ${({ fullWidth }) => fullWidth && `flex: 1;`}
`;
