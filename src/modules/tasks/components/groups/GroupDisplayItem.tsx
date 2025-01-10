import React from "react";

import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import {
  getSubGroupsByGroupId,
  getTasksByGroupId,
  getTasksCountInfoByGroupId,
} from "../../TasksSelectors";
import { GroupItem } from "../../types";
import AddTaskButton from "../tasks/AddTaskButton";
import TaskDisplayItem from "../tasks/TaskDisplayItem";

import GroupHeaderDisplayItem from "./GroupHeaderDisplayItem";
import GroupItemAccordion from "./GroupItemAccordion";

type Props = {
  group: GroupItem;
};

const GroupDisplayItem = ({ group }: Props): JSX.Element => {
  const subGroups = useAppSelector((state) =>
    getSubGroupsByGroupId(state, group._id),
  );
  const tasks = useAppSelector((state) => getTasksByGroupId(state, group._id));

  const { percentageCompleted } = useAppSelector((state) =>
    getTasksCountInfoByGroupId(state, group._id),
  );

  return (
    <GroupItemAccordion
      headerContent={<GroupHeaderDisplayItem group={group} />}
      content={
        <ContentContainer>
          {subGroups.map((subGroup) => (
            <GroupDisplayItem key={subGroup._id} group={subGroup} />
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

export default React.memo(GroupDisplayItem);
