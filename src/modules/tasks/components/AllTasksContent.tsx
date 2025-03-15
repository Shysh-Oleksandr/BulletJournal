import React from "react";

import styled from "styled-components/native";

import { useOrphanedGroups, useOrphanedTasks } from "../api/tasksSelectors";

import AddGroupButton from "./groups/AddGroupButton";
import GroupAccordionDisplayItem from "./groups/GroupAccordionDisplayItem";
import TaskDisplayItem from "./tasks/TaskDisplayItem";

const contentContainerStyle = {
  paddingBottom: 40,
  paddingHorizontal: 16,
};

const AllTasksContent = (): JSX.Element => {
  const { orphanedGroups } = useOrphanedGroups();
  const { orphanedTasks } = useOrphanedTasks();

  return (
    <Container
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      bounces={false}
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <TaskGroupsContainer>
        <ItemListContainer>
          {orphanedGroups.map((group) => (
            <GroupAccordionDisplayItem key={group._id} group={group} />
          ))}
        </ItemListContainer>

        <AddGroupButton />

        <ItemListContainer>
          {orphanedTasks.map((task) => (
            <TaskDisplayItem key={task._id} task={task} />
          ))}
        </ItemListContainer>
      </TaskGroupsContainer>
    </Container>
  );
};

const Container = styled.ScrollView``;

const TaskGroupsContainer = styled.View`
  gap: 12px;
`;

const ItemListContainer = styled.View`
  gap: 6px;
`;

export default React.memo(AllTasksContent);
