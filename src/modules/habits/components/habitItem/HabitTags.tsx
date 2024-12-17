import React from "react";

import Typography from "components/Typography";
import styled from "styled-components/native";

import { useHabitTags } from "../../hooks/useHabitTags";
import { Habit } from "../../types";

type Props = {
  habit: Habit;
  amountTarget?: number;
  labelBgColor: string;
  textColor: string;
};

const HabitTags = ({
  habit,
  amountTarget,
  labelBgColor,
  textColor,
}: Props): JSX.Element => {
  const tags = useHabitTags(habit, amountTarget);

  return (
    <TagsContainer>
      {tags.map((tag, index) => (
        <TagContainer key={index} bgColor={labelBgColor}>
          <Typography
            color={textColor}
            fontWeight="semibold"
            align="center"
            fontSize="xs"
          >
            {tag}
          </Typography>
        </TagContainer>
      ))}
    </TagsContainer>
  );
};

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const TagContainer = styled.View<{ bgColor: string }>`
  z-index: 20;
  padding: 3px 6px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 6px;
`;

export default React.memo(HabitTags);
