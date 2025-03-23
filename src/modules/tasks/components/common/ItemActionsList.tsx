import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Typography from "components/Typography";
import { tasksApi } from "modules/tasks/api/tasksApi";
import styled from "styled-components/native";

import ItemInfoBottomSheet from "./ItemInfoBottomSheet";
import ItemMoveToBottomSheetContent from "./ItemMoveToBottomSheetContent";

type Props = {
  itemId?: string;
  isTask: boolean;
  canMoveOutside?: boolean;
  currentIsArchived: boolean;
  onDescriptionPress?: () => void;
  onLabelsPress?: () => void;
  onMoveItem: (value: {
    groupId: string | null;
    parentTaskId: string | null;
    parentGroupId: string | null;
  }) => void;
  onArchive: (value: boolean) => void;
  closeModal: () => void;
};

const ItemActionsList = ({
  itemId,
  isTask,
  canMoveOutside,
  currentIsArchived,
  onDescriptionPress,
  onLabelsPress,
  onArchive,
  onMoveItem,
  closeModal,
}: Props): JSX.Element | null => {
  const { mutate: deleteTask } = tasksApi.useDeleteTaskMutation();
  const { mutate: deleteGroup } = tasksApi.useDeleteGroupMutation();

  const { t } = useTranslation();

  const [isDeletionAlertVisible, setIsDeletionAlertVisible] = useState(false);

  const handleDelete = () => {
    if (!itemId) return;

    if (isTask) {
      deleteTask({ _id: itemId });
    } else {
      deleteGroup({ _id: itemId });
    }

    closeModal();
  };

  const handleArchive = () => {
    onArchive(!currentIsArchived);
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
          onPress={handleArchive}
          bgColor={
            currentIsArchived ? theme.colors.cyan500 : theme.colors.cyan600
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
            {t(currentIsArchived ? "habits.unarchive" : "habits.archive")}
          </Typography>
        </ActionItemContainer>
        {onDescriptionPress && (
          <ActionItemContainer
            onPress={onDescriptionPress}
            bgColor={theme.colors.cyan600}
          >
            <Entypo
              name="text"
              color={theme.colors.white}
              size={theme.fontSizes.lg}
            />
            <Typography
              fontSize="sm"
              fontWeight="semibold"
              color={theme.colors.white}
            >
              {t("tasks.description")}
            </Typography>
          </ActionItemContainer>
        )}

        {onLabelsPress && (
          <ActionItemContainer onPress={onLabelsPress}>
            <MaterialIcons
              name="label"
              size={theme.fontSizes.lg}
              color={theme.colors.white}
            />
            <Typography
              fontSize="sm"
              fontWeight="semibold"
              color={theme.colors.white}
            >
              {t("tasks.labels")}
            </Typography>
          </ActionItemContainer>
        )}

        <ItemInfoBottomSheet
          bottomModalProps={{
            minHeight: "49%",
            withHeader: true,
            title: t("tasks.moveTo"),
          }}
          content={(closeModal) => (
            <ItemMoveToBottomSheetContent
              itemId={itemId}
              isTask={isTask}
              canMoveOutside={canMoveOutside}
              onMoveItem={onMoveItem}
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

        {itemId && (
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
        )}
      </Container>

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
