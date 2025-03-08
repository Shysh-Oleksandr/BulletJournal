import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { useAuth } from "modules/auth/AuthContext";
import { tasksApi } from "modules/tasks/api/tasksApi";
import {
  useGroupPath,
  useSubGroupsByGroupId,
  useTasksCountInfoByGroupId,
} from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import { GroupItem } from "../../types";
import ArchivedItemLabel from "../common/ArchivedItemLabel";
import ItemActionsList from "../common/ItemActionsList";
import ItemInfoBottomSheet from "../common/ItemInfoBottomSheet";
import TaskItemInput from "../common/TaskItemInput";
import { TaskLabelContainer } from "../common/TaskLabelContainer";

import ArchivedSubtasksListSection from "./ArchivedSubtasksListSection";
import SubgroupsListSection from "./SubgroupsListSection";

type Props = {
  group: GroupItem;
  depth?: number;
};

// TODO: refactor as TaskBottomSheet
const GroupHeaderDisplayItem = ({ group, depth = 0 }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { mutate: updateGroup } = tasksApi.useUpdateGroupMutation();

  const userId = useAuth().userId;
  const { subGroups } = useSubGroupsByGroupId(group._id);

  const { completedTasksCount, tasksCount } = useTasksCountInfoByGroupId(
    group._id,
  );
  const {
    completedTasksCount: completedArchivedTasksCount,
    tasksCount: archivedTasksCount,
  } = useTasksCountInfoByGroupId(group._id, true);

  const groupPath = useGroupPath(group._id);

  const [name, setName] = useState(group.name);
  const [color, setColor] = useState(group.color);

  const hasChanges = useMemo(
    () => name !== group.name || color !== group.color,
    [color, group.color, group.name, name],
  );

  const handleUpdateGroup = () => {
    if (hasChanges) {
      updateGroup({
        _id: group._id,
        author: userId,
        name,
        color,
      });
    }
  };

  const resetState = useCallback(() => {
    setName(group.name);
    setColor(group.color);
  }, [group.color, group.name]);

  useEffect(() => {
    resetState();
  }, [resetState]);

  return (
    <ItemInfoBottomSheet
      bottomModalProps={{ minHeight: `${50 - 1 * depth}%` }}
      onClose={handleUpdateGroup}
      content={(closeModal) => (
        <>
          {groupPath && (
            <Typography
              color={group?.color ?? theme.colors.darkBlueText}
              fontWeight="semibold"
            >
              {groupPath}
            </Typography>
          )}
          <TaskItemInput
            name={name}
            setName={setName}
            color={color}
            setColor={setColor}
            inputPlaceholder={t("tasks.groupPlaceholder")}
            onSubmitEditing={() => {
              handleUpdateGroup();
              closeModal();
            }}
            onReset={hasChanges ? resetState : undefined}
          />
          <ItemActionsList item={group} closeModal={closeModal} />
          <SubgroupsListSection group={group} depth={depth} />
          <ArchivedSubtasksListSection groupId={group._id} />
        </>
      )}
    >
      {(openModal) => (
        <HeaderInfo onPress={openModal}>
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
            <ArchivedItemLabel
              isArchived={group.isArchived}
              color={group.color}
            />
          </LabelsContainer>
        </HeaderInfo>
      )}
    </ItemInfoBottomSheet>
  );
};

const LabelsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeaderInfo = styled.TouchableOpacity`
  max-width: 85%;
`;

export default React.memo(GroupHeaderDisplayItem);
