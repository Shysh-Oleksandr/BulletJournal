import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { tasksApi } from "../../TasksApi";
import {
  getSubGroupsByGroupId,
  getTasksCountInfoByGroupId,
} from "../../TasksSelectors";
import { GroupItem } from "../../types";
import ItemInfoBottomSheet from "../common/ItemInfoBottomSheet";
import TaskItemInput from "../common/TaskItemInput";

import SubgroupsListSection from "./SubgroupsListSection";

type Props = {
  group: GroupItem;
  depth?: number;
};

// TODO: refactor as TaskBottomSheet
const GroupHeaderDisplayItem = ({ group, depth = 0 }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [updateGroup] = tasksApi.useUpdateGroupMutation();
  const [deleteGroup] = tasksApi.useDeleteGroupMutation();

  const userId = useAppSelector(getUserId);
  const subGroups = useAppSelector((state) =>
    getSubGroupsByGroupId(state, group._id),
  );
  const { completedTasksCount, tasksCount } = useAppSelector((state) =>
    getTasksCountInfoByGroupId(state, group._id),
  );

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
          <TaskItemInput
            name={name}
            setName={setName}
            color={color}
            setColor={setColor}
            inputPlaceholder={t("tasks.groupPlaceholder")}
            onDelete={() => {
              deleteGroup(group._id);
              closeModal();
            }}
            onSubmitEditing={() => {
              handleUpdateGroup();
              closeModal();
            }}
            onReset={hasChanges ? resetState : undefined}
          />
          <SubgroupsListSection group={group} depth={depth} />
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
              <LabelContainer>
                <FontAwesome5
                  name="layer-group"
                  color={group.color}
                  size={theme.fontSizes.xs}
                />
                <Typography fontSize="xs" color={group.color}>
                  {subGroups.length}
                </Typography>
              </LabelContainer>
            )}
            {tasksCount > 0 && (
              <LabelContainer>
                <FontAwesome5
                  name="tasks"
                  color={group.color}
                  size={theme.fontSizes.xs}
                />
                <Typography fontSize="xs" color={group.color}>
                  {completedTasksCount}/{tasksCount}
                </Typography>
              </LabelContainer>
            )}
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

const LabelContainer = styled.View`
  padding: 3px 6px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const HeaderInfo = styled.TouchableOpacity`
  max-width: 85%;
`;

export default React.memo(GroupHeaderDisplayItem);
