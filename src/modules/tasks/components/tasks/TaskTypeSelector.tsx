import React from "react";
import { useTranslation } from "react-i18next";

import Switcher from "components/Switcher";
import TargetAmountSelector from "modules/habits/components/habitForm/TargetAmountSelector";
import { EMPTY_TASK } from "modules/tasks/data";
import { TaskItem, TaskTypes } from "modules/tasks/types";
import styled from "styled-components/native";

import TaskCircularProgress from "./TaskCircularProgress";

const TASK_TYPES = Object.values(TaskTypes);

type Props = {
  task?: TaskItem;
  selectedType: TaskTypes;
  currentTarget: number | null;
  currentUnits: string;
  currentCompletedAmount: number;
  setSelectedType: (val: TaskTypes) => void;
  setCurrentAmount: (val: number) => void;
  setCurrentUnits: (val: string) => void;
  setCurrentCompletedAmount: (val: number) => void;
  setCurrentCompletedAt: (val: number | null) => void;
};

const TaskTypeSelector = ({
  task,
  selectedType,
  currentTarget,
  currentUnits,
  currentCompletedAmount,
  setSelectedType,
  setCurrentAmount,
  setCurrentUnits,
  setCurrentCompletedAmount,
  setCurrentCompletedAt,
}: Props) => {
  const { t } = useTranslation();

  const setSelectedOption = (option: string) => {
    if (option === selectedType) return;

    if (option === TaskTypes.AMOUNT) {
      setCurrentCompletedAmount(0);
    } else {
      setCurrentCompletedAmount(
        currentTarget && currentCompletedAmount >= currentTarget ? 1 : 0,
      );
    }
    setSelectedType(option as TaskTypes);
  };

  const getLocalizedOption = (option: string) => t(`habits.${option}`);

  return (
    <Container>
      <ContentContainer>
        <Row>
          <TaskCircularProgress
            task={task ?? EMPTY_TASK}
            currentType={selectedType}
            currentCompletedAmount={currentCompletedAmount}
            setCurrentCompletedAmount={setCurrentCompletedAmount}
            currentTarget={currentTarget ?? 0}
            setCurrentCompletedAt={setCurrentCompletedAt}
          />
          <Switcher
            options={TASK_TYPES}
            selectedOption={selectedType}
            setSelectedOption={setSelectedOption}
            getLocalizedOption={getLocalizedOption}
            fullWidth
          />
        </Row>
        {selectedType !== TaskTypes.CHECK && (
          <TargetAmountSelector
            currentAmount={currentTarget}
            currentUnits={currentUnits}
            setCurrentAmount={setCurrentAmount}
            setCurrentUnits={setCurrentUnits}
            unitsPlaceholder={t("habits.unitsAmountPlaceholder")}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-top: 10px;
`;

const ContentContainer = styled.View``;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export default TaskTypeSelector;
