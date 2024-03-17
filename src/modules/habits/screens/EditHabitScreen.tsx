import isEqual from "lodash.isequal";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import theme from "theme";

import { RouteProp } from "@react-navigation/native";
import ConfirmAlert from "components/ConfirmAlert";
import HeaderBar from "components/HeaderBar";
import LeaveConfirmAlert from "components/LeaveConfirmAlert";
import logging from "config/logging";
import { CustomUserEvents } from "modules/app/types";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import FormActionButtons from "modules/notes/components/noteForm/FormActionButtons";
import SavingStatusLabel from "modules/notes/components/noteForm/SavingStatusLabel";
import TitleInput from "modules/notes/components/noteForm/TitleInput";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";
import { logUserEvent } from "utils/logUserEvent";

import HabitFrequencySelector from "../components/habitForm/HabitFrequencySelector";
import HabitTargetSelector from "../components/habitForm/HabitTargetSelector";
import HabitTypeSelector from "../components/habitForm/HabitTypeSelector";
import { EMPTY_HABIT } from "../data";
import { habitsApi } from "../HabitsApi";
import { Habit, HabitTypes, UpdateHabitRequest } from "../types";

const contentContainerStyle = {
  paddingHorizontal: 20,
  paddingBottom: 70,
};

const EditHabitScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.EDIT_HABIT>;
}> = ({ route }) => {
  const [updateHabit] = habitsApi.useUpdateHabitMutation();
  const [createHabit] = habitsApi.useCreateHabitMutation();
  const [deleteHabit] = habitsApi.useDeleteHabitMutation();

  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const userId = useAppSelector(getUserId) ?? "";

  const { item: initialHabit, isNewHabit } = route.params;

  const [currentLabel, setCurrentLabel] = useState(initialHabit.label);

  const [selectedType, setSelectedType] = useState(initialHabit.habitType);
  const [currentAmount, setCurrentAmount] = useState<number | null>(
    initialHabit.amountTarget ?? null,
  );
  const [currentUnits, setCurrentUnits] = useState(initialHabit.units ?? "");

  const [currentStreakTarget, setCurrentStreakTarget] = useState(
    initialHabit.streakTarget,
  );
  const [currentOverallTarget, setCurrentOverallTarget] = useState(
    initialHabit.overallTarget,
  );
  const [currentFrequency, setCurrentFrequency] = useState<number[]>(
    initialHabit.frequency.weekdays,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const isCheckHabitType = selectedType === HabitTypes.CHECK;

  const isValidForm =
    (isCheckHabitType || !!currentAmount) && currentLabel.trim() !== "";

  const currentHabit: Habit = {
    ...initialHabit,
    author: userId,
    label: currentLabel.trim(),
    habitType: selectedType,
    streakTarget: currentStreakTarget,
    overallTarget: currentOverallTarget,
    amountTarget: isCheckHabitType ? initialHabit.amountTarget : currentAmount,
    units: isCheckHabitType ? initialHabit.units : currentUnits,
    frequency: {
      weekdays: currentFrequency,
    },
  };

  const [savedHabit, setSavedHabit] = useState(currentHabit);

  const hasChanges = !isEqual(savedHabit, currentHabit);

  const saveHabitHandler = async (withAlert = true) => {
    if (!userId) return;

    setIsSaving(true);

    logUserEvent(
      isNewHabit ? CustomUserEvents.CREATE_HABIT : CustomUserEvents.SAVE_HABIT,
      currentHabit._id ? { habitId: currentHabit._id } : undefined,
    );
    addCrashlyticsLog(
      `User tries to ${isNewHabit ? "create" : "update"} a habit`,
    );

    setSavedHabit(currentHabit);

    const updateHabitData: UpdateHabitRequest = {
      ...currentHabit,
      label: currentHabit.label || t("habits.habit"),
    };

    try {
      if (isNewHabit) {
        await createHabit(updateHabitData).unwrap();
      } else {
        await updateHabit(updateHabitData);
      }

      withAlert && navigation.goBack();

      if (withAlert) {
        Toast.show({
          type: "success",
          text1: t("general.success"),
          text2: t(isNewHabit ? "habits.createdInfo" : "habits.updatedInfo"),
        });
      }
    } catch (error) {
      logging.error(error);
      alertError();
      addCrashlyticsLog(error as string);
    } finally {
      // The save btn doesn't change its state without using timeout(for some reason)
      setTimeout(() => {
        setIsSaving(false);
      }, 100);
    }
  };

  const deleteHabitHandler = useCallback(async () => {
    const { _id } = initialHabit;

    if (!_id) return;

    try {
      logUserEvent(CustomUserEvents.DELETE_HABIT, { habitId: _id });
      addCrashlyticsLog(`User tries to delete the habit ${_id}`);
      setIsDeleting(true);
      await deleteHabit(_id);

      Toast.show({
        type: "success",
        text1: t("general.success"),
        text2: t("habits.deletedInfo"),
      });

      setTimeout(() => {
        navigation.pop();
      }, 500);
    } catch (error) {
      logging.error(error);
      alertError();
    } finally {
      setTimeout(() => {
        setIsDeleting(false);
      }, 300);
    }
  }, [deleteHabit, initialHabit, navigation, t]);

  return (
    <>
      <HeaderBar
        title={isNewHabit ? t("habits.createHabit") : t("habits.editHabit")}
        withAddBtn={!isNewHabit}
        onAddBtnPress={() => {
          navigation.replace(Routes.EDIT_HABIT, {
            item: EMPTY_HABIT,
            isNewHabit: true,
          });
        }}
        withBackArrow
      />
      <SScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={contentContainerStyle}
      >
        <HeaderSection>
          <SavingStatusLabel isSaving={isSaving} hasChanges={hasChanges} />
        </HeaderSection>
        <ContentContainer
          pointerEvents={isSaving || isDeleting ? "none" : "auto"}
        >
          <TitleInput
            currentTitle={currentLabel}
            withAutoFocus={!!isNewHabit}
            setCurrentTitle={setCurrentLabel}
          />
          {/* <ColorSelectorContainer>
          <Typography>Color selection</Typography>
        </ColorSelectorContainer> */}
          <HabitTypeSelector
            selectedType={selectedType}
            currentAmount={currentAmount}
            currentUnits={currentUnits}
            setSelectedType={setSelectedType}
            setCurrentUnits={setCurrentUnits}
            setCurrentAmount={setCurrentAmount}
          />
          <HabitTargetSelector
            label={t("habits.streakTarget")}
            currentTarget={currentStreakTarget}
            setCurrentTarget={setCurrentStreakTarget}
          />
          <HabitTargetSelector
            label={t("habits.overallTarget")}
            currentTarget={currentOverallTarget}
            setCurrentTarget={setCurrentOverallTarget}
          />
          <HabitFrequencySelector
            currentFrequency={currentFrequency}
            setCurrentFrequency={setCurrentFrequency}
          />
          <FormActionButtons
            isSaving={false}
            disabled={!isValidForm || !hasChanges}
            isDeleting={isDeleting}
            isNewItem={!!isNewHabit}
            saveItem={saveHabitHandler}
            deleteItem={() => setIsDeleteDialogVisible(true)}
          />
        </ContentContainer>
      </SScrollView>
      <ConfirmAlert
        message={t("habits.deleteConfirmation")}
        isDeletion
        isDialogVisible={isDeleteDialogVisible}
        setIsDialogVisible={setIsDeleteDialogVisible}
        onConfirm={deleteHabitHandler}
      />
      <LeaveConfirmAlert
        hasChanges={hasChanges}
        onConfirm={async () => {
          await saveHabitHandler(false);
        }}
      />
    </>
  );
};

const SScrollView = styled.ScrollView``;

const ContentContainer = styled.View`
  padding: 10px 16px 30px;
  margin: 10px 0 20px;
  align-center: center;
  background-color: ${theme.colors.white};
  border-radius: 6px;
  margin-bottom: 20px;
  elevation: 16;
  align-items: center;
`;

const HeaderSection = styled.View`
  height: 40px;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

export default EditHabitScreen;
