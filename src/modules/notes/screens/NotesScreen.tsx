import React, { FC } from "react";
import { Text } from "react-native";

import styled from "styled-components/native";

const NotesScreen: FC = () => {
  return (
    <Container>
      <Text>NotesScreen</Text>
    </Container>
  );
};

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default NotesScreen;
