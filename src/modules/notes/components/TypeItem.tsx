import React from "react";
import theme from "theme";

import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  type: string;
  isActive: boolean;
  Icon?: JSX.Element;
  onChoose: (type: string) => void;
};

const TypeItem = ({ type, isActive, Icon, onChoose }: Props): JSX.Element => (
  <TypeItemContainer
    isActive={isActive}
    onPress={() => onChoose(type)}
    activeOpacity={isActive ? 0.5 : 0.2}
  >
    {Icon ?? (
      <Typography
        fontWeight="medium"
        fontSize="md"
        align="center"
        color={isActive ? theme.colors.white : theme.colors.darkBlueText}
      >
        {type}
      </Typography>
    )}
  </TypeItemContainer>
);

const TypeItemContainer = styled.TouchableOpacity<{
  isActive: boolean;
}>`
  width: 100%;
  padding: 16px 12px;

  ${({ isActive }) => isActive && `background-color: ${theme.colors.cyan500};`}
`;

export default React.memo(TypeItem);
