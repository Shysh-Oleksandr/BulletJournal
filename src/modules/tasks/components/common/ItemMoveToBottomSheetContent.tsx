import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Feather } from "@expo/vector-icons";
import Typography from "components/Typography";
import { GroupItem, TaskItem } from "modules/tasks/types";
import styled from "styled-components/native";

import TasksSearchContent from "./TasksSearchContent";

type Props = {
  itemId?: string;
  isTask: boolean;
  canMoveOutside?: boolean;
  closeModal: () => void;
  onMoveItem: (value: {
    groupId: string | null;
    parentTaskId: string | null;
    parentGroupId: string | null;
  }) => void;
};

const ItemMoveToBottomSheetContent = ({
  itemId,
  isTask,
  canMoveOutside,
  onMoveItem,
  closeModal,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const handleMove = (
    selectedItem: GroupItem | TaskItem | null,
    shouldMoveOutside = false,
  ) => {
    if (!selectedItem && !shouldMoveOutside) return;

    if (shouldMoveOutside) {
      onMoveItem({
        groupId: null,
        parentTaskId: null,
        parentGroupId: null,
      });
    } else {
      const isSelectedItemTask = "type" in selectedItem!;

      if (isTask) {
        onMoveItem({
          groupId: isSelectedItemTask ? null : selectedItem!._id,
          parentTaskId: isSelectedItemTask ? selectedItem._id : null,
          parentGroupId: null,
        });
      } else {
        onMoveItem({
          parentGroupId: selectedItem!._id,
          groupId: null,
          parentTaskId: null,
        });
      }
    }

    closeModal();
  };

  return (
    <TasksSearchContent
      onItemSelect={handleMove}
      excludedItemId={itemId}
      shouldSearchTasks={isTask}
      extraContent={
        canMoveOutside ? (
          <OutsideItemContainer onPress={() => handleMove(null, true)}>
            <Feather
              name="log-out"
              size={theme.fontSizes.xxl}
              color={theme.colors.darkBlueText}
            />
            <Typography fontSize="lg" fontWeight="semibold">
              {t("tasks.moveOutside")}
            </Typography>
          </OutsideItemContainer>
        ) : null
      }
    />
  );
};

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
