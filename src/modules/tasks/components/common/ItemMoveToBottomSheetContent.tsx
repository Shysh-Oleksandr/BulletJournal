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
  task: TaskItem;
  closeModal: () => void;
};

const ItemMoveToBottomSheetContent = ({
  task,
  closeModal,
}: Props): JSX.Element | null => {
  const [updateTask] = tasksApi.useUpdateTaskMutation();

  const userId = useAppSelector(getUserId);
  const orphanedGroups = useAppSelector(getOrphanedGroups);
  const orphanedTasks = useAppSelector(getOrphanedTasks);

  const orphanedItems = useMemo(
    () => [...orphanedGroups, ...orphanedTasks],
    [orphanedGroups, orphanedTasks],
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
      updateTask({
        _id: task._id,
        author: userId,
        groupId: null,
        parentTaskId: null,
      });
    } else {
      const isTask = "type" in selectedItem!;

      updateTask({
        _id: task._id,
        author: userId,
        groupId: isTask ? null : selectedItem!._id,
        parentTaskId: isTask ? selectedItem._id : null,
      });
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
      <Container
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ gap: 6 }}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          value={searchValue}
          placeholder={t("search.search")}
          isCentered
          onChange={setSearchValue}
          minHeight={55}
        />

        <ItemsListContainer>
          {(task.groupId || task.parentTaskId) && (
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

          {orphanedItems.map((item) => (
            <MoveToListItem
              key={item._id}
              item={item}
              searchValue={debouncedSearchValue}
              handlePress={(item) =>
                item._id !== task._id && setSelectedItem(item)
              }
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

const Container = styled.ScrollView``;

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
