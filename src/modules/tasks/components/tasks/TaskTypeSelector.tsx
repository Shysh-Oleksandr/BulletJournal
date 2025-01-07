import React from "react";
import { useTranslation } from "react-i18next";

import Switcher from "components/Switcher";
import TargetAmountSelector from "modules/habits/components/habitForm/TargetAmountSelector";
import { TaskItem, TaskTypes } from "modules/tasks/types";
import styled from "styled-components/native";

import TaskCircularProgress from "./TaskCircularProgress";

const TASK_TYPES = Object.values(TaskTypes);

type Props = {
  task?: TaskItem;
  selectedType: TaskTypes;
  currentAmount: number | null;
  currentUnits: string;
  setSelectedType: (val: TaskTypes) => void;
  setCurrentAmount: (val: number) => void;
  setCurrentUnits: (val: string) => void;
};

const TaskTypeSelector = ({
  task,
  selectedType,
  currentAmount,
  currentUnits,
  setSelectedType,
  setCurrentAmount,
  setCurrentUnits,
}: Props) => {
  const { t } = useTranslation();

  const setSelectedOption = (option: string) => {
    setSelectedType(option as TaskTypes);
  };

  const getLocalizedOption = (option: string) => t(`habits.${option}`);

  return (
    <Container>
      <ContentContainer>
        <Row>
          {task && <TaskCircularProgress task={task} />}
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
            currentAmount={currentAmount}
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
