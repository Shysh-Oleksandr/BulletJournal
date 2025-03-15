import React from "react";
import theme from "theme";

import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import {
  useSubGroupsByGroupId,
  useTasksCountInfoByGroupId,
} from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import { GroupItem } from "../../types";
import ArchivedItemLabel from "../common/ArchivedItemLabel";
import DescriptionLabel from "../common/DescriptionLabel";
import { TaskLabelContainer } from "../common/TaskLabelContainer";

import AddGroupButton from "./AddGroupButton";
import ArchivedSubtasksListSection from "./ArchivedSubtasksListSection";
import GroupBottomSheet from "./GroupBottomSheet";
import SubgroupsListSection from "./SubgroupsListSection";

type Props = {
  group: GroupItem;
  depth?: number;
};

const GroupDisplayItem = ({ group, depth = 0 }: Props): JSX.Element => {
  const { subGroups } = useSubGroupsByGroupId(group._id);

  const { completedTasksCount, tasksCount } = useTasksCountInfoByGroupId(
    group._id,
  );
  const {
    completedTasksCount: completedArchivedTasksCount,
    tasksCount: archivedTasksCount,
  } = useTasksCountInfoByGroupId(group._id, true);

  return (
    <GroupBottomSheet
      group={group}
      depth={depth}
      content={() => (
        <ContentContainer>
          <SubgroupsListSection group={group} depth={depth} />
          <AddGroupButton parentGroupId={group._id} />
          <ArchivedSubtasksListSection groupId={group._id} />
        </ContentContainer>
      )}
    >
      {(openModal) => (
        <HeaderInfo onPress={openModal} fullWidth={!!depth}>
          <Typography
            fontWeight="bold"
            fontSize="lg"
            color={group.color}
            paddingBottom={4}
          >
            {group.name}
          </Typography>
          <LabelsContainer>
            {subGroups.length > 0 && (
              <TaskLabelContainer>
                <FontAwesome5
                  name="layer-group"
                  color={group.color}
                  size={theme.fontSizes.xs}
                />
                <Typography fontSize="xs" color={group.color}>
                  {subGroups.length}
                </Typography>
              </TaskLabelContainer>
            )}
            {tasksCount > 0 && (
              <TaskLabelContainer>
                <FontAwesome5
                  name="tasks"
                  color={group.color}
                  size={theme.fontSizes.xs}
                />
                <Typography fontSize="xs" color={group.color}>
                  {completedTasksCount}/{tasksCount}
                </Typography>
              </TaskLabelContainer>
            )}
            {archivedTasksCount > 0 && (
              <TaskLabelContainer>
                <Entypo
                  name="archive"
                  color={group.color}
                  size={theme.fontSizes.xs}
                />

                <Typography fontSize="xs" color={group.color}>
                  {completedArchivedTasksCount}/{archivedTasksCount}
                </Typography>
              </TaskLabelContainer>
            )}
            <DescriptionLabel
              description={group.description}
              color={group.color}
            />
            <ArchivedItemLabel
              isArchived={group.isArchived}
              color={group.color}
            />
          </LabelsContainer>
        </HeaderInfo>
      )}
    </GroupBottomSheet>
  );
};

const LabelsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ContentContainer = styled.View`
  margin-top: 12px;
  gap: 12px;
`;

const HeaderInfo = styled.TouchableOpacity<{ fullWidth: boolean }>`
  ${({ fullWidth }) => (fullWidth ? `width: 100%;` : `max-width: 85%;`)}
`;

export default React.memo(GroupDisplayItem);
