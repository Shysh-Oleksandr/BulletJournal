import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native-gesture-handler";
import theme from "theme";

import { useAuth } from "modules/auth/AuthContext";
import { tasksApi } from "modules/tasks/api/tasksApi";
import { useGroupPath } from "modules/tasks/api/tasksSelectors";

import { GroupItem } from "../../types";
import ItemActionsList from "../common/ItemActionsList";
import ItemInfoBottomSheet from "../common/ItemInfoBottomSheet";
import ItemPathLabel from "../common/ItemPathLabel";
import TaskDescriptionInput from "../common/TaskDescriptionInput";
import TaskItemInput from "../common/TaskItemInput";

type Props = {
  parentGroupId?: string;
  group?: GroupItem;
  content?: (closeModal: () => void) => JSX.Element;
  openByDefault?: boolean;
  depth?: number;
  onClose?: () => void;
  children: (openModal: () => void) => JSX.Element;
};

const GroupBottomSheet = ({
  group,
  parentGroupId,
  openByDefault,
  content,
  onClose,
  children,
  depth = 0,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { mutate: createGroup } = tasksApi.useCreateGroupMutation();
  const { mutate: updateGroup } = tasksApi.useUpdateGroupMutation();

  const userId = useAuth().userId;

  const inputRef = useRef<TextInput | null>(null);
  const descriptionInputRef = useRef<TextInput | null>(null);

  const defaultValues = useMemo(
    () => ({
      name: group?.name ?? "",
      color: group?.color ?? theme.colors.cyan700,
      description: group?.description ?? "",
      currentIsArchived: !!group?.isArchived,
      currentParentGroupId: group?.parentGroupId ?? parentGroupId ?? null,
    }),
    [group, parentGroupId],
  );

  const [formValues, setFormValues] = useState(defaultValues);
  const [showDescriptionField, setShowDescriptionField] = useState(
    !!defaultValues.description,
  );

  const groupPath = useGroupPath(
    group?._id,
    !group,
    formValues.currentParentGroupId,
  );

  const hasChanges = useMemo(
    () => JSON.stringify(defaultValues) !== JSON.stringify(formValues),
    [defaultValues, formValues],
  );

  const handleReset = useCallback(() => {
    setFormValues(defaultValues);
    setShowDescriptionField(!!defaultValues.description);
  }, [defaultValues]);

  const handleUpdateGroup = () => {
    onClose?.();

    const normalizedName = formValues.name.trim();

    if (normalizedName.length === 0) return;

    const commonFields = {
      author: userId,
      color: formValues.color,
      name: normalizedName,
      description: formValues.description.trim(),
      isArchived: formValues.currentIsArchived,
      parentGroupId: formValues.currentParentGroupId,
    };

    if (group) {
      if (hasChanges) {
        updateGroup({
          _id: group._id,
          ...commonFields,
        });
      }
    } else {
      createGroup(commonFields);

      handleReset();
    }
  };

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <ItemInfoBottomSheet
      bottomModalProps={{
        minHeight: group ? `${50 - 1 * depth}%` : undefined,
      }}
      onClose={handleUpdateGroup}
      onOpen={() => {
        if (group) return;

        setTimeout(() => {
          const nameLength = formValues.name.length;

          inputRef.current?.focus();
          inputRef.current?.setSelection(nameLength, nameLength);
        }, 200);
      }}
      openByDefault={openByDefault}
      content={(closeModal) => (
        <>
          <ItemPathLabel color={formValues.color} itemPath={groupPath} />
          <TaskItemInput
            inputRef={inputRef}
            name={formValues.name}
            setName={(name) => setFormValues((prev) => ({ ...prev, name }))}
            color={formValues.color}
            setColor={(color) => setFormValues((prev) => ({ ...prev, color }))}
            inputPlaceholder={t(
              parentGroupId
                ? "tasks.subgroupPlaceholder"
                : "tasks.groupPlaceholder",
            )}
            onReset={hasChanges ? handleReset : undefined}
          />
          {showDescriptionField && (
            <TaskDescriptionInput
              description={formValues.description}
              color={formValues.color}
              setDescription={(description) =>
                setFormValues((prev) => ({ ...prev, description }))
              }
              inputRef={descriptionInputRef}
              onBlur={() => {
                if (formValues.description.trim().length === 0) {
                  setShowDescriptionField(false);
                }
              }}
            />
          )}

          <ItemActionsList
            isTask={false}
            canMoveOutside={Boolean(formValues.currentParentGroupId)}
            itemId={group?._id}
            onDescriptionPress={
              showDescriptionField
                ? undefined
                : () => {
                    setShowDescriptionField(true);
                    requestAnimationFrame(() => {
                      descriptionInputRef.current?.focus();
                    });
                  }
            }
            onMoveItem={({ parentGroupId }) =>
              setFormValues((prev) => ({
                ...prev,
                currentParentGroupId: parentGroupId,
              }))
            }
            currentIsArchived={formValues.currentIsArchived}
            onArchive={(isArchived) =>
              setFormValues((prev) => ({
                ...prev,
                currentIsArchived: isArchived,
              }))
            }
            closeModal={closeModal}
          />

          {content?.(closeModal)}
        </>
      )}
    >
      {(openModal) => children(openModal)}
    </ItemInfoBottomSheet>
  );
};

export default React.memo(GroupBottomSheet);
