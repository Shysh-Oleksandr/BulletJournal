import React from "react";

import Typography from "components/Typography";
import styled from "styled-components/native";

type TabBarProps = {
  label: string;
  color: string;
  Icon: JSX.Element;
  onPress: () => void;
};

const TabBarItem = ({ label, color, Icon, onPress }: TabBarProps) => (
  <Container onPress={onPress}>
    {Icon}
    <Typography paddingTop={2} fontSize="xs" color={color}>
      {label}
    </Typography>
  </Container>
);

const Container = styled.TouchableOpacity`
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  width: 33.3%;
`;

export default TabBarItem;
