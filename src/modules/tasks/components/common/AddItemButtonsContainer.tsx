import React, { useState } from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import styled from "styled-components/native";

type Props = {
  isDark?: boolean;
  children?: React.ReactNode;
};

const AddItemButtonsContainer = ({ isDark, children }: Props): JSX.Element => {
  const [showButtons, setShowButtons] = useState(false);

  return (
    <>
      {showButtons ? (
        <>{children}</>
      ) : (
        <ButtonContainer
          onPress={() => setShowButtons(!showButtons)}
          bgColor={isDark ? theme.colors.cyan500 : theme.colors.white}
        >
          <Entypo
            name="plus"
            size={24}
            color={isDark ? theme.colors.white : theme.colors.cyan600}
          />
        </ButtonContainer>
      )}
    </>
  );
};

const ButtonContainer = styled.TouchableOpacity<{ bgColor: string }>`
  padding: 6px 18px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 999px;
  margin-horizontal: auto;
  align-items: center;
  justify-content: center;
`;

export default React.memo(AddItemButtonsContainer);
