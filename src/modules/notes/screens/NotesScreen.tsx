import React, { FC } from "react";
import { Text } from "react-native";

import HeaderBar from "components/HeaderBar";
import styled from "styled-components/native";

const NotesScreen: FC = () => {
  return (
    <>
      <HeaderBar withLogo />
      <Container>
        <Text>NotesScreen</Text>
      </Container>
    </>
  );
};

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default NotesScreen;
