import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";

import CustomModal from "components/CustomModal";
import Input from "components/Input";
import Switcher from "components/Switcher";
import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import { habitsApi } from "modules/habits/api/habitsApi";
import { Habit, HabitCalendarDataItem, HabitLog } from "modules/habits/types";
import styled from "styled-components/native";

const screenHeight = Dimensions.get("window").height;

const isSmallScreen = screenHeight < 700;
const isBigScreen = screenHeight > 800;

const regularModalHeight = isSmallScreen ? 0.6 : 0.5;
const modalHeight = screenHeight * (isBigScreen ? 0.42 : regularModalHeight);

enum LogOptionalStatus {
  no = "no",
  yes = "yes",
}

const LogOptionalStatusValues = Object.values(LogOptionalStatus);

type Props = {
  habit: Habit;
  selectedLog: HabitCalendarDataItem | HabitLog | null;
  onClose: () => void;
};

const HabitLogInfoModal = ({
  habit,
  selectedLog,
  onClose,
}: Props): JSX.Element => {
  const { mutate: createOrUpdateHabitLog } =
    habitsApi.useCreateOrUpdateHabitLogMutation();

  const { t } = useTranslation();

  const [logOptionalStatus, setLogOptionalStatus] = useState<LogOptionalStatus>(
    LogOptionalStatus.no,
  );
  const [note, setNote] = useState("");

  const setSelectedOption = (option: string) => {
    setLogOptionalStatus(option as LogOptionalStatus);
  };
  const getLocalizedOption = (option: string) => t(`general.${option}`);

  const formattedDate = useMemo(
    () =>
      selectedLog
        ? format(new Date(selectedLog.date), "EEEE, dd MMMM yyyy", {
            locale: getDateFnsLocale(),
          })
        : "",
    [selectedLog],
  );

  const onModalClose = () => {
    onClose();

    if (!selectedLog) return;

    const normalizedNote = note.trim().length === 0 ? undefined : note.trim();

    const isManuallyOptionalSelected =
      logOptionalStatus === LogOptionalStatus.yes;

    if (
      normalizedNote === selectedLog.note &&
      ((isManuallyOptionalSelected && selectedLog.isManuallyOptional) ||
        (!isManuallyOptionalSelected && !selectedLog.isManuallyOptional))
    )
      return;

    createOrUpdateHabitLog({
      habitId: habit._id,
      date: new Date(selectedLog.date).getTime(),
      percentageCompleted: selectedLog.percentageCompleted || 0,
      amount: selectedLog.amount || 0,
      amountTarget: habit.amountTarget || 1,
      note: normalizedNote,
      isManuallyOptional: isManuallyOptionalSelected,
    });
  };

  useEffect(() => {
    if (selectedLog) {
      setNote(selectedLog.note ?? "");
      setLogOptionalStatus(
        selectedLog.isManuallyOptional
          ? LogOptionalStatus.yes
          : LogOptionalStatus.no,
      );
    }
  }, [selectedLog]);

  return (
    <CustomModal
      isVisible={Boolean(selectedLog)}
      closeModal={onModalClose}
      height={modalHeight}
    >
      <Typography fontWeight="semibold" fontSize="lg" paddingBottom={8}>
        {formattedDate}
      </Typography>
      <OptionalSwitcherContainer>
        <Typography fontWeight="semibold" fontSize="lg">
          {t("habits.optional")}:
        </Typography>
        <Switcher
          options={LogOptionalStatusValues}
          selectedOption={logOptionalStatus}
          setSelectedOption={setSelectedOption}
          getLocalizedOption={getLocalizedOption}
        />
      </OptionalSwitcherContainer>
      <LogNoteContainer>
        <Typography paddingBottom={8} fontWeight="semibold" fontSize="lg">
          {t("note.Note")}:
        </Typography>
        <Input
          value={note}
          placeholder={t("note.Note") + "..."}
          isCentered
          multiline
          borderRadius={4}
          numberOfLines={isSmallScreen ? 5 : 6}
          maxLength={400}
          fontSize="lg"
          onChange={setNote}
          maxHeight={150}
        />
      </LogNoteContainer>
    </CustomModal>
  );
};

const OptionalSwitcherContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const LogNoteContainer = styled.View`
  width: 100%;
`;

export default HabitLogInfoModal;
