import isEqual from "lodash.isequal";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import theme from "theme";

import { RouteProp } from "@react-navigation/native";
import ConfirmAlert from "components/ConfirmAlert";
import HeaderBar from "components/HeaderBar";
import AddItemButton from "components/HeaderBar/components/AddItemButton";
import LeaveConfirmAlert from "components/LeaveConfirmAlert";
import Typography from "components/Typography";
import logging from "config/logging";
import { CustomUserEvents } from "modules/app/types";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import ColorPicker from "modules/notes/components/noteForm/ColorPicker";
import FormActionButtons from "modules/notes/components/noteForm/FormActionButtons";
import SavingStatusLabel from "modules/notes/components/noteForm/SavingStatusLabel";
import TitleInput from "modules/notes/components/noteForm/TitleInput";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";
import { logUserEvent } from "utils/logUserEvent";

import { habitsApi } from "../api/habitsApi";
import HabitFrequencySelector from "../components/habitForm/HabitFrequencySelector";
import HabitTargetSelector from "../components/habitForm/HabitTargetSelector";
import HabitTypeSelector from "../components/habitForm/HabitTypeSelector";
import HabitBody from "../components/habitItem/HabitBody";
import { EMPTY_HABIT } from "../data";
import {
  CreateHabitRequest,
  Habit,
  HabitTypes,
  UpdateHabitRequest,
} from "../types";

const contentContainerStyle = {
  paddingHorizontal: 16,
  paddingBottom: 70,
};

const EditHabitScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.EDIT_HABIT>;
}> = ({ route }) => {
  const { mutateAsync: createHabit } = habitsApi.useCreateHabitMutation();
  const { mutateAsync: updateHabit } = habitsApi.useUpdateHabitMutation();
  const { mutate: deleteHabit } = habitsApi.useDeleteHabitMutation();

  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const userId = useAppSelector(getUserId);

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
  const [currentFrequency, setCurrentFrequency] = useState(
    initialHabit.frequency,
  );
  const [currentColor, setCurrentColor] = useState(
    initialHabit.color ?? theme.colors.cyan600,
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
    color: currentColor,
    habitType: selectedType,
    streakTarget: currentStreakTarget,
    overallTarget: currentOverallTarget,
    amountTarget: isCheckHabitType ? initialHabit.amountTarget : currentAmount,
    units: isCheckHabitType ? initialHabit.units : currentUnits,
    frequency: currentFrequency,
  };

  const [savedHabit, setSavedHabit] = useState(currentHabit);

  const hasChanges = !isEqual(savedHabit, currentHabit);

  const saveHabitHandler = async (
    withAlert = true,
    shouldUpdateArchive = false,
  ) => {
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

    const createHabitData: CreateHabitRequest = {
      ...currentHabit,
      label: currentHabit.label,
      isArchived: shouldUpdateArchive
        ? !currentHabit.isArchived
        : currentHabit.isArchived,
    };

    const updateHabitData = createHabitData as UpdateHabitRequest;

    delete updateHabitData.logs;

    try {
      if (isNewHabit) {
        await createHabit(createHabitData);
      } else {
        console.log("updateHabitData:", updateHabitData);

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

      deleteHabit({ _id, userId });

      navigation.pop(2);

      Toast.show({
        type: "success",
        text1: t("general.success"),
        text2: t("habits.deletedInfo"),
      });
    } catch (error) {
      logging.error(error);
      alertError();
    } finally {
      setTimeout(() => {
        setIsDeleting(false);
      }, 300);
    }
  }, [deleteHabit, initialHabit, navigation, t, userId]);

  return (
    <>
      <HeaderBar
        title={isNewHabit ? t("habits.createHabit") : t("habits.editHabit")}
        trailingContent={
          isNewHabit
            ? undefined
            : (textColor) => (
                <AddItemButton
                  textColor={textColor}
                  onPress={() => {
                    navigation.replace(Routes.EDIT_HABIT, {
                      item: EMPTY_HABIT,
                      isNewHabit: true,
                    });
                  }}
                />
              )
        }
        bgColor={currentColor}
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
          <HabitTypeSelector
            selectedType={selectedType}
            currentAmount={currentAmount}
            currentUnits={currentUnits}
            isDisabled={!isNewHabit}
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
          <ColorPickerContainer>
            <Typography fontWeight="semibold" fontSize="lg" paddingRight={8}>
              {t("note.color")}
            </Typography>
            <ColorPicker
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              isFormItem={false}
            />
          </ColorPickerContainer>
          <FormActionButtons
            isSaving={false}
            disabled={!isValidForm || !hasChanges}
            isDeleting={isDeleting}
            isNewItem={!!isNewHabit}
            isArchived={currentHabit.isArchived}
            saveItem={saveHabitHandler}
            deleteItem={() => setIsDeleteDialogVisible(true)}
            archiveItem={() => saveHabitHandler(true, true)}
          />
        </ContentContainer>
        <Typography fontSize="lg" paddingBottom={8}>
          {t("note.preview")}
        </Typography>
        <HabitBody
          habit={currentHabit}
          inputValue={currentHabit.amountTarget?.toString() ?? "0"}
          isCompleted
          percentageCompleted={100}
        />
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

const ColorPickerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

export default EditHabitScreen;
