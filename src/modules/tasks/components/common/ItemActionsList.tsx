import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { tasksApi } from "modules/tasks/TasksApi";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { TaskItem } from "../../types";

import ItemInfoBottomSheet from "./ItemInfoBottomSheet";
import ItemMoveToBottomSheetContent from "./ItemMoveToBottomSheetContent";

type Props = {
  task: TaskItem;
};

const ItemActionsList = ({ task }: Props): JSX.Element | null => {
  const [updateTask] = tasksApi.useUpdateTaskMutation();

  const userId = useAppSelector(getUserId);

  const { t } = useTranslation();

  const [isArchiveAlertVisible, setIsArchiveAlertVisible] = useState(false);

  const handleArchive = () => {
    updateTask({
      _id: task._id,
      author: userId,
      isArchived: !task.isArchived,
    });
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
            task.isArchived ? theme.colors.cyan500 : theme.colors.cyan600
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
            {t(task.isArchived ? "habits.unarchive" : "habits.archive")}
          </Typography>
        </ActionItemContainer>
        <ItemInfoBottomSheet
          bottomModalProps={{
            minHeight: "49%",
            maxHeight: "85%",
            withHeader: true,
            title: t("tasks.moveTo"),
          }}
          content={(closeModal) => (
            <ItemMoveToBottomSheetContent task={task} closeModal={closeModal} />
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
      </Container>

      <ConfirmAlert
        message={t("general.confirmation")}
        isDialogVisible={isArchiveAlertVisible}
        setIsDialogVisible={setIsArchiveAlertVisible}
        onConfirm={handleArchive}
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
