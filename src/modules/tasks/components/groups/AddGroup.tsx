import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import theme from "theme";

import Typography from "components/Typography";
import { useAuth } from "modules/auth/AuthContext";
import { tasksApi } from "modules/tasks/api/tasksApi";
import { useGroupPath } from "modules/tasks/api/tasksSelectors";

import AddItemButton from "../common/AddItemButton";
import ItemInfoBottomSheet from "../common/ItemInfoBottomSheet";
import TaskItemInput from "../common/TaskItemInput";

type Props = {
  isSubgroup?: boolean;
  parentGroupId?: string;
};

const AddGroup = ({ isSubgroup, parentGroupId }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { mutate: createGroup } = tasksApi.useCreateGroupMutation();
  const groupPath = useGroupPath(parentGroupId, true);

  const userId = useAuth().userId;

  const inputRef = useRef<TextInput | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState(theme.colors.cyan700);

  const hasChanges = useMemo(
    () => name.trim().length > 0 || color !== theme.colors.cyan700,
    [color, name],
  );

  const handleReset = () => {
    setName("");
    setColor(theme.colors.cyan600);
  };

  const handleCreateGroup = () => {
    if (name.trim().length > 0) {
      createGroup({
        author: userId,
        name: name.trim(),
        color,
        parentGroupId,
      });

      handleReset();
    }
  };

  return (
    <ItemInfoBottomSheet
      onOpen={() => {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.setSelection(name.length, name.length);
        }, 200);
      }}
      onClose={handleCreateGroup}
      content={(closeModal) => (
        <>
          {groupPath && (
            <Typography color={color} fontWeight="semibold">
              {groupPath}
            </Typography>
          )}
          <TaskItemInput
            inputRef={inputRef}
            name={name}
            setName={setName}
            color={color}
            setColor={setColor}
            inputPlaceholder={t(
              isSubgroup
                ? "tasks.subgroupPlaceholder"
                : "tasks.groupPlaceholder",
            )}
            onSubmitEditing={() => {
              handleCreateGroup();
              closeModal();
            }}
            onReset={hasChanges ? handleReset : undefined}
          />
        </>
      )}
    >
      {(openModal) => (
        <AddItemButton
          label={t(isSubgroup ? "tasks.subgroup" : "tasks.group")}
          onPress={openModal}
        />
      )}
    </ItemInfoBottomSheet>
  );
};

export default React.memo(AddGroup);
