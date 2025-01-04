import React from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

import EditTaskItemModal, { InputSubmitProps } from "./EditTaskItemModal";

type Props = {
  label: string;
  inputPlaceholder: string;
  withDueDatePicker?: boolean;
  isDark?: boolean;
  onInputSubmit: (props: InputSubmitProps) => void;
};

const AddTaskButton = ({
  label,
  inputPlaceholder,
  withDueDatePicker = true,
  isDark,
  onInputSubmit,
}: Props): JSX.Element => (
  <EditTaskItemModal
    onInputSubmit={onInputSubmit}
    inputPlaceholder={inputPlaceholder}
    withDueDatePicker={withDueDatePicker}
  >
    {(openModal) => (
      <ButtonContainer
        onPress={openModal}
        bgColor={isDark ? theme.colors.cyan500 : theme.colors.white}
      >
        <Typography
          fontWeight="semibold"
          fontSize="lg"
          color={isDark ? theme.colors.white : theme.colors.cyan600}
        >
          {label}
        </Typography>
        <Entypo
          name="plus"
          size={24}
          color={isDark ? theme.colors.white : theme.colors.cyan600}
        />
      </ButtonContainer>
    )}
  </EditTaskItemModal>
);

const ButtonContainer = styled.TouchableOpacity<{ bgColor: string }>`
  padding: 6px 12px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: row;
  gap: 6px;
`;

export default React.memo(AddTaskButton);
