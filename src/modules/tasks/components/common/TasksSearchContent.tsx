import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import {
  useAllOrphanedTasks,
  useOrphanedGroups,
} from "modules/tasks/api/tasksSelectors";
import { GroupItem, TaskItem } from "modules/tasks/types";
import styled from "styled-components/native";

import TaskSearchItem from "./TaskSearchItem";

const DEBOUNCE_DELAY = 300;

type Props = {
  excludedItemId?: string;
  extraContent?: JSX.Element | null;
  shouldSearchTasks?: boolean;
  onItemSelect: (item: GroupItem | TaskItem | null) => void;
};

const TasksSearchContent = ({
  excludedItemId,
  extraContent,
  shouldSearchTasks = true,
  onItemSelect,
}: Props): JSX.Element | null => {
  const { orphanedGroups } = useOrphanedGroups();
  const { allOrphanedTasks } = useAllOrphanedTasks();

  const orphanedItems = useMemo(
    () =>
      shouldSearchTasks
        ? [...orphanedGroups, ...allOrphanedTasks]
        : orphanedGroups,
    [shouldSearchTasks, orphanedGroups, allOrphanedTasks],
  );

  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  const searchValueDebouncer = useMemo(
    () => debounce(setDebouncedSearchValue, DEBOUNCE_DELAY),
    [setDebouncedSearchValue],
  );

  useEffect(() => {
    searchValueDebouncer(searchValue);
  }, [searchValue, searchValueDebouncer]);

  return (
    <Container>
      <Input
        value={searchValue}
        placeholder={t("search.search")}
        isCentered
        onChange={setSearchValue}
        minHeight={55}
      />
      <ItemsListContainer>
        {extraContent}

        {orphanedItems.map((orphanedItem) => (
          <TaskSearchItem
            key={orphanedItem._id}
            item={orphanedItem}
            searchValue={debouncedSearchValue}
            handlePress={onItemSelect}
            onlyGroups={!shouldSearchTasks}
            excludedItemId={excludedItemId}
          />
        ))}
      </ItemsListContainer>
    </Container>
  );
};

const Container = styled.View`
  gap: 6px;
  padding-bottom: 20px;
`;

const ItemsListContainer = styled.View`
  gap: 4px;
`;

export default React.memo(TasksSearchContent);
