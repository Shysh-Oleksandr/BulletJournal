import React from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  label: string;
  onPress: () => void;
};

const AddItemButton = ({ label, onPress }: Props): JSX.Element => (
  <ButtonContainer onPress={onPress} bgColor={theme.colors.white}>
    <Typography
      fontWeight="semibold"
      fontSize="lg"
      color={theme.colors.cyan600}
    >
      {label}
    </Typography>
    <Entypo name="plus" size={24} color={theme.colors.cyan600} />
  </ButtonContainer>
);

const ButtonContainer = styled.TouchableOpacity<{ bgColor: string }>`
  padding: 6px 12px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: row;
  gap: 6px;
`;

export default React.memo(AddItemButton);
