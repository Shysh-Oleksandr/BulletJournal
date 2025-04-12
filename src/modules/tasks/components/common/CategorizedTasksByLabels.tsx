import React, { useMemo, useState } from "react";
import theme from "theme";

import Typography from "components/Typography";
import { useLabelsWithTasks } from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import CategorizedTasksByLabelsItem from "./CategorizedTasksByLabelsItem";

const contentContainerStyle = {
  paddingBottom: 8,
};

const CategorizedTasksByLabels = (): JSX.Element | null => {
  const labels = useLabelsWithTasks();

  const [showAll, setShowAll] = useState(false);

  const labelsWithTasks = useMemo(() => {
    if (showAll) return labels;

    return labels.filter((label) => label.activeTasksAmount > 0);
  }, [labels, showAll]);

  if (labelsWithTasks.length === 0) return null;

  return (
    <Container
      contentContainerStyle={contentContainerStyle}
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      horizontal
      bounces={false}
    >
      <CategoryContainer>
        {labelsWithTasks.map((label) => (
          <CategorizedTasksByLabelsItem key={label.labelName} label={label} />
        ))}
        <ButtonContainer onPress={() => setShowAll(!showAll)}>
          <Typography fontWeight="semibold" color={theme.colors.darkBlueText}>
            {showAll ? "Hide all" : "Show all"}
          </Typography>
        </ButtonContainer>
      </CategoryContainer>
    </Container>
  );
};

const Container = styled.ScrollView``;

const CategoryContainer = styled.View`
  gap: 4px;
  flex-direction: row;
`;

const ButtonContainer = styled.TouchableOpacity`
  padding: 4px 6px;
  border-radius: 8px;
  background-color: ${theme.colors.white};
`;

export default React.memo(CategorizedTasksByLabels);
