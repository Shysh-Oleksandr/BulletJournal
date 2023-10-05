import React from "react";
import theme from "theme";

import Divider from "components/Divider";
import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  type: string;
  isLast: boolean;
  isActive: boolean;
  Icon?: JSX.Element;
  onChoose: (type: string) => void;
};

const TypeItem = ({
  type,
  isActive,
  isLast,
  Icon,
  onChoose,
}: Props): JSX.Element => (
  <>
    <BgContainer style={{ backgroundColor: theme.colors.cyan200 }}>
      <TypeItemContainer
        isLast={isLast}
        isActive={isActive}
        activeOpacity={0.8}
        onPress={() => onChoose(type)}
      >
        {Icon ?? (
          <Typography
            fontWeight="medium"
            fontSize="md"
            align="center"
            color={theme.colors.white}
          >
            {type}
          </Typography>
        )}
      </TypeItemContainer>
    </BgContainer>
    {!isLast && <Divider />}
  </>
);

const BgContainer = styled.View`
  background-color: ${theme.colors.cyan200};
`;

const TypeItemContainer = styled.TouchableOpacity<{
  isLast: boolean;
  isActive: boolean;
}>`
  width: 100%;
  background-color: ${({ isActive }) =>
    isActive ? theme.colors.cyan500 : theme.colors.cyan600};
  padding: 10px 12px;
  height: 40px;

  ${({ isLast }) =>
    isLast &&
    `
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
    `}
`;

export default React.memo(TypeItem);
