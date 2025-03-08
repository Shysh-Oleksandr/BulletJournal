import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Typography from "components/Typography";
import { useAuth } from "modules/auth/AuthContext";
import { tasksApi } from "modules/tasks/api/tasksApi";
import styled from "styled-components/native";

import { GroupItem, TaskItem, UpdateTaskRequest } from "../../types";

import ItemInfoBottomSheet from "./ItemInfoBottomSheet";
import ItemMoveToBottomSheetContent from "./ItemMoveToBottomSheetContent";

type Props = {
  item: GroupItem | TaskItem;
  closeModal: () => void;
};

const ItemActionsList = ({ item, closeModal }: Props): JSX.Element | null => {
  const { mutate: updateTask } = tasksApi.useUpdateTaskMutation();
  const { mutate: updateGroup } = tasksApi.useUpdateGroupMutation();
  const { mutate: deleteTask } = tasksApi.useDeleteTaskMutation();
  const { mutate: deleteGroup } = tasksApi.useDeleteGroupMutation();

  const userId = useAuth().userId;

  const { t } = useTranslation();

  const [isArchiveAlertVisible, setIsArchiveAlertVisible] = useState(false);
  const [isDeletionAlertVisible, setIsDeletionAlertVisible] = useState(false);

  const isTask = "type" in item;

  const canMoveOutside = Boolean(
    isTask ? item.groupId || item.parentTaskId : item.parentGroupId,
  );

  const handleDelete = () => {
    if (isTask) {
      deleteTask({ _id: item._id, author: userId });
    } else {
      deleteGroup({ _id: item._id, author: userId });
    }

    closeModal();
  };

  const handleArchive = () => {
    const payload: UpdateTaskRequest = {
      _id: item._id,
      author: userId,
      isArchived: !item.isArchived,
    };

    isTask ? updateTask(payload) : updateGroup(payload);
  };

  return (
    <>
      <Container
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ gap: 6 }}
        keyboardShouldPersistTaps="handled"
      >
        <ActionItemContainer
          onPress={() => setIsArchiveAlertVisible(true)}
          bgColor={
            item.isArchived ? theme.colors.cyan500 : theme.colors.cyan600
          }
        >
          <Entypo
            name="archive"
            size={theme.fontSizes.lg}
            color={theme.colors.white}
          />
          <Typography
            fontSize="sm"
            fontWeight="semibold"
            color={theme.colors.white}
          >
            {t(item.isArchived ? "habits.unarchive" : "habits.archive")}
          </Typography>
        </ActionItemContainer>
        <ItemInfoBottomSheet
          bottomModalProps={{
            minHeight: "49%",
            withHeader: true,
            title: t("tasks.moveTo"),
          }}
          content={(closeModal) => (
            <ItemMoveToBottomSheetContent
              item={item}
              canMoveOutside={canMoveOutside}
              closeModal={closeModal}
            />
          )}
        >
          {(openModal) => (
            <ActionItemContainer onPress={openModal}>
              <MaterialIcons
                name="drive-file-move"
                size={theme.fontSizes.lg}
                color={theme.colors.white}
              />
              <Typography
                fontSize="sm"
                fontWeight="semibold"
                color={theme.colors.white}
              >
                {t("tasks.moveTo")}...
              </Typography>
            </ActionItemContainer>
          )}
        </ItemInfoBottomSheet>

        <ActionItemContainer
          onPress={() => setIsDeletionAlertVisible(true)}
          bgColor={theme.colors.red600}
        >
          <MaterialIcons
            name="delete"
            size={theme.fontSizes.lg}
            color={theme.colors.white}
          />
          <Typography
            fontSize="sm"
            fontWeight="semibold"
            color={theme.colors.white}
          >
            {t("note.delete")}
          </Typography>
        </ActionItemContainer>
      </Container>

      <ConfirmAlert
        message={t("general.confirmation")}
        isDialogVisible={isArchiveAlertVisible}
        setIsDialogVisible={setIsArchiveAlertVisible}
        onConfirm={handleArchive}
      />
      <ConfirmAlert
        isDeletion
        message={t("general.deleteConfirmation")}
        isDialogVisible={isDeletionAlertVisible}
        setIsDialogVisible={setIsDeletionAlertVisible}
        onConfirm={handleDelete}
      />
    </>
  );
};

const Container = styled.ScrollView`
  margin-top: 10px;
`;

const ActionItemContainer = styled.TouchableOpacity<{ bgColor?: string }>`
  padding: 5px 10px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background-color: ${({ bgColor }) => bgColor || theme.colors.cyan600};
`;

export default React.memo(ItemActionsList);
