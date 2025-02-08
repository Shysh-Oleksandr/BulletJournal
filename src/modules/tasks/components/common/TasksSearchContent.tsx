import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import {
  getAllOrphanedTasks,
  getOrphanedGroups,
} from "modules/tasks/TasksSelectors";
import { GroupItem, TaskItem } from "modules/tasks/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import TaskSearchItem from "./TaskSearchItem";

const DEBOUNCE_DELAY = 300;

type Props = {
  excludedItemId?: string;
  extraContent?: JSX.Element | null;
  shouldSearchTasks?: boolean;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<GroupItem | TaskItem | null>
  >;
};

const TasksSearchContent = ({
  excludedItemId,
  extraContent,
  shouldSearchTasks = true,
  setSelectedItem,
}: Props): JSX.Element | null => {
  const orphanedGroups = useAppSelector(getOrphanedGroups);
  const orphanedTasks = useAppSelector(getAllOrphanedTasks);

  const orphanedItems = useMemo(
    () =>
      (shouldSearchTasks
        ? [...orphanedGroups, ...orphanedTasks]
        : orphanedGroups
      ).filter((orphanedItem) => orphanedItem._id !== excludedItemId),
    [shouldSearchTasks, excludedItemId, orphanedGroups, orphanedTasks],
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
            handlePress={setSelectedItem}
            onlyGroups={!shouldSearchTasks}
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
