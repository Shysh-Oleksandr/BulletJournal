import React from "react";

import { Entypo } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  color: string;
  itemPath: string[];
};

const ItemPathLabel = ({ itemPath, color }: Props): JSX.Element => (
  <PathLabelContainer>
    {itemPath.map((path, index) => (
      <PathItemContainer key={path + index}>
        <Typography color={color} fontWeight="semibold">
          {path}
        </Typography>
        <Entypo
          name="chevron-small-right"
          style={{ marginTop: 1 }}
          size={22}
          color={color}
        />
      </PathItemContainer>
    ))}
  </PathLabelContainer>
);

const PathLabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const PathItemContainer = styled.View`
  flex-direction: row;
`;

export default React.memo(ItemPathLabel);
