import { format, isSameDay } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";

import CustomModal from "components/CustomModal";
import Input from "components/Input";
import Switcher from "components/Switcher";
import Typography from "components/Typography";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import { habitsApi } from "modules/habits/HabitsApi";
import { Habit } from "modules/habits/types";
import styled from "styled-components/native";

const screenHeight = Dimensions.get("window").height;

const isSmallScreen = screenHeight < 700;
const isBigScreen = screenHeight > 800;

const regularModalHeight = isSmallScreen ? 0.57 : 0.47;
const modalHeight = screenHeight * (isBigScreen ? 0.42 : regularModalHeight);

enum LogOptionalStatus {
  no = "no",
  yes = "yes",
}

const LogOptionalStatusValues = Object.values(LogOptionalStatus);

type Props = {
  habit: Habit | null;
  selectedLogTimestamp: number | null;
  onClose: () => void;
};

const HabitLogInfoModal = ({
  habit,
  selectedLogTimestamp,
  onClose,
}: Props): JSX.Element => {
  const [updateHabit] = habitsApi.useUpdateHabitMutation();

  const { t } = useTranslation();

  const log = useMemo(
    () =>
      selectedLogTimestamp && habit
        ? habit.logs.find((log) => isSameDay(log.date, selectedLogTimestamp)) ||
          null
        : null,
    [habit, selectedLogTimestamp],
  );

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
      selectedLogTimestamp
        ? format(selectedLogTimestamp, "EEEE, dd MMMM yyyy", {
            locale: getDateFnsLocale(),
          })
        : "",
    [selectedLogTimestamp],
  );

  const onModalClose = () => {
    onClose();

    if (!selectedLogTimestamp || !habit) return;

    const normalizedNote = note.trim().length === 0 ? undefined : note.trim();

    const isManuallyOptionalSelected =
      logOptionalStatus === LogOptionalStatus.yes;

    if (
      normalizedNote === log?.note &&
      ((isManuallyOptionalSelected && log?.isManuallyOptional) ||
        (!isManuallyOptionalSelected && !log?.isManuallyOptional))
    )
      return;

    const updatedLogs = habit.logs
      .map((log) => {
        if (isSameDay(log.date, selectedLogTimestamp)) {
          return {
            ...log,
            isManuallyOptional: logOptionalStatus === LogOptionalStatus.yes,
            note: normalizedNote,
            isArtificial: false,
          };
        }

        return log;
      })
      .filter((log) => !log.isArtificial);

    updateHabit({
      _id: habit._id,
      author: habit.author,
      logs: updatedLogs,
    });
  };

  useEffect(() => {
    if (selectedLogTimestamp) {
      setNote(log?.note ?? "");
      setLogOptionalStatus(
        log?.isManuallyOptional ? LogOptionalStatus.yes : LogOptionalStatus.no,
      );
    }
  }, [log?.isManuallyOptional, log?.note, selectedLogTimestamp]);

  return (
    <CustomModal
      isVisible={Boolean(selectedLogTimestamp && habit)}
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
          maxHeight={isSmallScreen ? 150 : 174}
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
