import React from "react";
import { useTranslation } from "react-i18next";

import AddItemButton from "../common/AddItemButton";

import TaskBottomSheet, { TaskBottomSheetProps } from "./TaskBottomSheet";

type Props = {
  groupId?: string;
  parentTaskId?: string;
} & Pick<
  TaskBottomSheetProps,
  "defaultDueDate" | "defaultColor" | "defaultCustomLabels"
>;

const AddTaskButton = ({
  groupId,
  parentTaskId,
  ...taskBottomSheetProps
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <TaskBottomSheet
      parentTaskId={parentTaskId}
      groupId={groupId}
      {...taskBottomSheetProps}
    >
      {(openModal) => (
        <AddItemButton
          label={t(parentTaskId ? "tasks.subtask" : "tasks.task")}
          onPress={openModal}
        />
      )}
    </TaskBottomSheet>
  );
};

export default React.memo(AddTaskButton);
