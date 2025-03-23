import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Toast from "react-native-toast-message";
import theme from "theme";

import Button from "components/Button";
import ConfirmAlert from "components/ConfirmAlert";
import HeaderBar from "components/HeaderBar";
import LeaveConfirmAlert from "components/LeaveConfirmAlert";
import Typography from "components/Typography";
import logging from "config/logging";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { useAppNavigation } from "modules/navigation/NavigationService";
import styled from "styled-components/native";
import { alertError } from "utils/alertMessages";

import { habitsApi } from "../api/habitsApi";
import { useAllHabits } from "../api/habitsSelectors";
import HabitBulkEditItem from "../components/habitItem/HabitBulkEditItem";
import { BulkEditHabit, HabitActions } from "../types";
import { getHabitActionButtonsData } from "../utils/getHabitActionButtonsData";

const HabitsBulkEditScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const navigation = useAppNavigation();

  const { mutateAsync: reorderHabits } = habitsApi.useReorderHabitsMutation();
  const { mutateAsync: updateHabit } = habitsApi.useUpdateHabitMutation();
  const { mutateAsync: deleteHabit } = habitsApi.useDeleteHabitMutation();

  const [isUpdating, setIsUpdating] = useState(false);

  const userId = useAuthStore((state) => state.userId);
  const { allHabits } = useAllHabits();

  const initialHabits = useMemo(
    () =>
      allHabits.map((habit) => ({
        _id: habit._id,
        label: habit.label,
        action: habit.isArchived
          ? HabitActions.ARCHIVE
          : HabitActions.UNARCHIVE,
        isSelected: false,
      })),
    [allHabits],
  );

  const [currentHabits, setCurrentHabits] =
    useState<BulkEditHabit[]>(initialHabits);
  const [withLeaveDialog, setWithLeaveDialog] = useState(true);
  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);

  const { isOrderChanged, isActionChanged } = useMemo(() => {
    const isOrderChanged = currentHabits.some(
      (habit, i) => allHabits[i]._id !== habit._id,
    );

    const isActionChanged = currentHabits.some(
      (habit, i) => initialHabits[i].action !== habit.action,
    );

    return { isOrderChanged, isActionChanged };
  }, [allHabits, currentHabits, initialHabits]);

  const hasChanges = isOrderChanged || isActionChanged;

  const areHabitsSelected = useMemo(
    () => currentHabits.filter((habit) => habit.isSelected).length > 0,
    [currentHabits],
  );

  const actionButtonsData = useMemo(
    () => getHabitActionButtonsData(currentHabits),
    [currentHabits],
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: BulkEditHabit[] }) => {
      setCurrentHabits(data);
    },
    [setCurrentHabits],
  );

  const renderItem = useCallback(
    ({ item, drag }: RenderItemParams<BulkEditHabit>) => {
      return (
        <HabitBulkEditItem
          label={item.label}
          isSelected={item.isSelected}
          action={item.action}
          onPressIn={drag}
          onPress={() =>
            setCurrentHabits((prev) =>
              prev.map((habit) =>
                habit._id === item._id
                  ? { ...habit, isSelected: !item.isSelected }
                  : habit,
              ),
            )
          }
        />
      );
    },
    [],
  );

  const handleActionButtonPress = useCallback((action: HabitActions) => {
    const newAction =
      action === HabitActions.RESTORE ? HabitActions.UNARCHIVE : action;

    setCurrentHabits((prev) =>
      prev.map((habit) =>
        habit.isSelected
          ? { ...habit, action: newAction, isSelected: false }
          : habit,
      ),
    );
  }, []);

  const handleUpdateHabits = useCallback(
    async (isLeaveDialog = false) => {
      try {
        setIsUpdating(true);
        setWithLeaveDialog(false);

        if (isActionChanged) {
          const changedHabits = currentHabits.filter(
            (habit, i) => initialHabits[i].action !== habit.action,
          );

          await Promise.all(
            changedHabits.map((habit) => {
              if (habit.action === HabitActions.DELETE) {
                return deleteHabit({ _id: habit._id, userId });
              }
              if (
                habit.action === HabitActions.ARCHIVE ||
                habit.action === HabitActions.UNARCHIVE
              ) {
                return updateHabit({
                  _id: habit._id,
                  author: userId,
                  isArchived: habit.action === HabitActions.ARCHIVE,
                });
              }

              return Promise.resolve();
            }),
          );
        }

        if (isOrderChanged) {
          await reorderHabits({
            habitIds: currentHabits.map((habit) => habit._id),
            userId,
          });
        }

        Toast.show({
          type: "success",
          text1: t("general.success"),
          text2: t("habits.updatedInfo"),
        });

        !isLeaveDialog && navigation.goBack();
      } catch (error) {
        logging.error(error);
        alertError();
      } finally {
        setIsUpdating(false);
      }
    },
    [
      currentHabits,
      deleteHabit,
      initialHabits,
      isActionChanged,
      isOrderChanged,
      navigation,
      reorderHabits,
      t,
      updateHabit,
      userId,
    ],
  );

  return (
    <>
      <HeaderBar
        withBackArrow
        title={t("habits.habits")}
        trailingContent={() => (
          <Button
            label={t("note.update")}
            shouldReverseBgColor
            labelProps={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              fontSize: "md",
            }}
            disabled={isUpdating || (!isOrderChanged && !isActionChanged)}
            onPress={() => setIsSaveDialogVisible(true)}
            isLoading={isUpdating}
          />
        )}
      />
      <SelectedActionContainer>
        {actionButtonsData.map(({ label, disabled, action, bgColor }) => (
          <Button
            key={action}
            label={label}
            bgColor={bgColor}
            disabled={disabled || !areHabitsSelected}
            onPress={() => handleActionButtonPress(action)}
            width="32%"
            labelProps={{
              fontSize: "sm",
              paddingVertical: 6,
              paddingHorizontal: 4,
            }}
          />
        ))}
      </SelectedActionContainer>
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <DraggableFlatList
          data={currentHabits}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <EmptyContainer>
              <Typography fontWeight="semibold" fontSize="lg">
                {t("habits.noHabitsText")}
              </Typography>
            </EmptyContainer>
          }
          contentContainerStyle={{
            paddingTop: 10,
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
          renderItem={renderItem}
          onDragEnd={handleDragEnd}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </SLinearGradient>
      <ConfirmAlert
        message={t("general.confirmation")}
        isDialogVisible={isSaveDialogVisible}
        setIsDialogVisible={setIsSaveDialogVisible}
        onConfirm={handleUpdateHabits}
      />
      <LeaveConfirmAlert
        enabled={withLeaveDialog}
        hasChanges={hasChanges}
        onConfirm={async () => {
          await handleUpdateHabits(true);
        }}
      />
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const EmptyContainer = styled.View`
  align-items: center;
`;

const SelectedActionContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background-color: ${theme.colors.cyan300};
  padding: 8px 20px;
`;

export default HabitsBulkEditScreen;
