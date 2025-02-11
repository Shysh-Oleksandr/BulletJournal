import React, { useCallback, useMemo } from "react";
import theme from "theme";

import Typography from "components/Typography";
import {
  useAllGroups,
  useAllTasks,
  useSubGroupsByGroupId,
  useSubTasksByTaskId,
  useTasksByGroupId,
} from "modules/tasks/api/tasksSelectors";
import { GroupItem, TaskItem } from "modules/tasks/types";
import styled from "styled-components/native";

type Props = {
  item: GroupItem | TaskItem;
  depth?: number;
  searchValue?: string;
  onlyGroups?: boolean;
  handlePress: (item: GroupItem | TaskItem) => void;
};

const TaskSearchItem = ({
  item,
  searchValue = "",
  depth = 0,
  onlyGroups = false,
  handlePress,
}: Props): JSX.Element | null => {
  const { allGroups } = useAllGroups();
  const { allTasks } = useAllTasks();
  const { subGroups } = useSubGroupsByGroupId(item._id);
  const { tasks } = useTasksByGroupId(item._id);
  const { subTasks } = useSubTasksByTaskId(item._id);

  const allSubItems = useMemo(
    () => (onlyGroups ? subGroups : [...subGroups, ...tasks, ...subTasks]),
    [onlyGroups, subGroups, tasks, subTasks],
  );

  // Recursive function to check if any descendant matches the searchValue
  const hasMatchingDescendants = useCallback(
    (subItem: GroupItem | TaskItem): boolean => {
      const matches = subItem.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      // Fetch sub-items of this subItem
      const subItemSubGroups = allGroups.filter(
        (group) => group.parentGroupId === subItem._id,
      );
      const subItemTasks = allTasks.filter(
        (task) => task.groupId === subItem._id,
      );
      const subItemSubTasks = allTasks.filter(
        (task) => task.parentTaskId === subItem._id,
      );
      const descendants = [
        ...subItemSubGroups,
        ...subItemTasks,
        ...subItemSubTasks,
      ];

      return (
        matches ||
        descendants.some((descendant) => hasMatchingDescendants(descendant))
      );
    },
    [allGroups, allTasks, searchValue],
  );

  const filteredSubItems = useMemo(
    () => allSubItems.filter((subItem) => hasMatchingDescendants(subItem)),
    [allSubItems, hasMatchingDescendants],
  );

  const bgColor = useMemo(
    () => (depth % 2 === 0 ? theme.colors.cyan300 : theme.colors.white),
    [depth],
  );
  const borderColor = useMemo(
    () => (depth % 2 === 0 ? theme.colors.cyan600 : theme.colors.cyan500),
    [depth],
  );

  // Exclude item if it doesn't match and has no matching descendants
  if (
    !item.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    filteredSubItems.length === 0
  ) {
    return null;
  }

  return (
    <Container
      bgColor={bgColor}
      borderColor={borderColor}
      onPress={() => handlePress(item)}
    >
      <Typography fontWeight="semibold" fontSize="lg">
        {item.name}
      </Typography>

      <SubItemsContainer>
        {filteredSubItems.map((subItem) => (
          <TaskSearchItem
            key={subItem._id}
            item={subItem}
            searchValue={searchValue}
            depth={depth + 1}
            handlePress={handlePress}
            onlyGroups={onlyGroups}
          />
        ))}
      </SubItemsContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity<{
  bgColor: string;
  borderColor: string;
}>`
  padding: 4px 10px;
  border-left-width: 3px;
  border-color: ${({ borderColor }) => borderColor};
  background-color: ${({ bgColor }) => bgColor};
`;

const SubItemsContainer = styled.View`
  gap: 5px;
  margin-top: 6px;
`;

export default React.memo(TaskSearchItem);
