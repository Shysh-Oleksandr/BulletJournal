import React from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Typography from "components/Typography";

import { TaskLabelContainer } from "./TaskLabelContainer";

type Props = {
  color: string;
  description?: string;
};

const DescriptionLabel = ({
  description,
  color,
}: Props): JSX.Element | null => {
  if (!description) return null;

  return (
    <TaskLabelContainer>
      <Entypo name="text" color={color} size={theme.fontSizes.sm} />
      <Typography fontSize="xs" color={color} numberOfLines={1}>
        {description.slice(0, 20)}
        {description.length > 20 ? "..." : ""}
      </Typography>
    </TaskLabelContainer>
  );
};

export default React.memo(DescriptionLabel);
