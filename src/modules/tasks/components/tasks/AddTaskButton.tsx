import React from "react";
import { useTranslation } from "react-i18next";

import AddItemButton from "../common/AddItemButton";

import TaskBottomSheet from "./TaskBottomSheet";

type Props = {
  groupId?: string;
  parentTaskId?: string;
  defaultDueDate?: number;
};

const AddTaskButton = ({
  groupId,
  parentTaskId,
  defaultDueDate,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <TaskBottomSheet
      parentTaskId={parentTaskId}
      groupId={groupId}
      defaultDueDate={defaultDueDate}
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
