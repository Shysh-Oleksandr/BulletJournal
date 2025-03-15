import React from "react";

import {
  useArchivedTasksByGroupId,
  useSubGroupsByGroupId,
  useTasksCountInfoByGroupId,
} from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import { GroupItem } from "../../types";
import AddTaskButton from "../tasks/AddTaskButton";
import TaskDisplayItem from "../tasks/TaskDisplayItem";

import GroupDisplayItem from "./GroupDisplayItem";
import GroupItemAccordion from "./GroupItemAccordion";

type Props = {
  group: GroupItem;
};

const GroupAccordionDisplayItem = ({ group }: Props): JSX.Element => {
  const { subGroups } = useSubGroupsByGroupId(group._id);

  const { unArchivedTasks: tasks } = useArchivedTasksByGroupId(group._id);

  const { percentageCompleted } = useTasksCountInfoByGroupId(group._id);

  return (
    <GroupItemAccordion
      headerContent={<GroupDisplayItem group={group} />}
      content={
        <ContentContainer>
          {subGroups.map((subGroup) => (
            <GroupAccordionDisplayItem key={subGroup._id} group={subGroup} />
          ))}
          {tasks.map((task) => (
            <TaskDisplayItem key={task._id} task={task} />
          ))}
          <AddTaskButton groupId={group._id} />
        </ContentContainer>
      }
      viewKey={group._id}
      accentColor={group.color}
      percentageCompleted={percentageCompleted}
    />
  );
};

const ContentContainer = styled.View`
  width: 100%;
  padding: 2px 0px 8px;
  gap: 8px;
`;

export default React.memo(GroupAccordionDisplayItem);
