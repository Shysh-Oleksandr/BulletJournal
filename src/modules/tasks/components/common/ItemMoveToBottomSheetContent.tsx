import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Feather } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Input from "components/Input";
import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { tasksApi } from "modules/tasks/TasksApi";
import {
  getOrphanedGroups,
  getOrphanedTasks,
} from "modules/tasks/TasksSelectors";
import { GroupItem, TaskItem } from "modules/tasks/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import MoveToListItem from "./MoveToListItem";

const DEBOUNCE_DELAY = 300;

type Props = {
  item: GroupItem | TaskItem;
  canMoveOutside?: boolean;
  closeModal: () => void;
};

const ItemMoveToBottomSheetContent = ({
  item,
  canMoveOutside,
  closeModal,
}: Props): JSX.Element | null => {
  const [updateTask] = tasksApi.useUpdateTaskMutation();
  const [updateGroup] = tasksApi.useUpdateGroupMutation();

  const userId = useAppSelector(getUserId);
  const orphanedGroups = useAppSelector(getOrphanedGroups);
  const orphanedTasks = useAppSelector(getOrphanedTasks);

  const isTask = "type" in item;

  const orphanedItems = useMemo(
    () =>
      (isTask ? [...orphanedGroups, ...orphanedTasks] : orphanedGroups).filter(
        (orphanedItem) => orphanedItem._id !== item._id,
      ),
    [isTask, item._id, orphanedGroups, orphanedTasks],
  );

  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  const [selectedItem, setSelectedItem] = useState<GroupItem | TaskItem | null>(
    null,
  );

  const handleMove = (shouldMoveOutside = false) => {
    if (!selectedItem && !shouldMoveOutside) return;

    if (shouldMoveOutside) {
      if (isTask) {
        updateTask({
          _id: item._id,
          author: userId,
          groupId: null,
          parentTaskId: null,
        });
      } else {
        updateGroup({
          _id: item._id,
          author: userId,
          parentGroupId: null,
        });
      }
    } else {
      const isSelectedItemTask = "type" in selectedItem!;

      if (isTask) {
        updateTask({
          _id: item._id,
          author: userId,
          groupId: isSelectedItemTask ? null : selectedItem!._id,
          parentTaskId: isSelectedItemTask ? selectedItem._id : null,
        });
      } else {
        updateGroup({
          _id: item._id,
          author: userId,
          parentGroupId: selectedItem?._id,
        });
      }
    }

    closeModal();
  };

  const searchValueDebouncer = useMemo(
    () => debounce(setDebouncedSearchValue, DEBOUNCE_DELAY),
    [setDebouncedSearchValue],
  );

  useEffect(() => {
    searchValueDebouncer(searchValue);
  }, [searchValue, searchValueDebouncer]);

  return (
    <>
      <Container>
        <Input
          value={searchValue}
          placeholder={t("search.search")}
          isCentered
          onChange={setSearchValue}
          minHeight={55}
        />
        <ItemsListContainer>
          {canMoveOutside && (
            <OutsideItemContainer onPress={() => handleMove(true)}>
              <Feather
                name="log-out"
                size={theme.fontSizes.xxl}
                color={theme.colors.darkBlueText}
              />
              <Typography fontSize="lg" fontWeight="semibold">
                {t("tasks.moveOutside")}
              </Typography>
            </OutsideItemContainer>
          )}

          {orphanedItems.map((orphanedItem) => (
            <MoveToListItem
              key={orphanedItem._id}
              item={orphanedItem}
              searchValue={debouncedSearchValue}
              handlePress={setSelectedItem}
              onlyGroups={!isTask}
            />
          ))}
        </ItemsListContainer>
      </Container>
      <ConfirmAlert
        message={t("general.confirmation")}
        isDialogVisible={!!selectedItem}
        setIsDialogVisible={(val) => !val && setSelectedItem(null)}
        onConfirm={handleMove}
      />
    </>
  );
};

const Container = styled.View`
  gap: 6px;
  padding-bottom: 85px;
`;

const ItemsListContainer = styled.View`
  gap: 4px;
`;

const OutsideItemContainer = styled.TouchableOpacity`
  padding: 6px 10px;
  border-width: 1px;
  border-radius: 6px;
  border-color: ${theme.colors.cyan600};
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export default React.memo(ItemMoveToBottomSheetContent);
