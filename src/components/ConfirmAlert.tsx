import React from "react";
import { Dialog } from "react-native-simple-dialogs";
import theme from "theme";

import Button from "components/Button";
import Divider from "components/Divider";
import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  isDialogVisible: boolean;
  message: string;
  title?: string;
  isDeletion?: boolean;
  onConfirm: () => void;
  onDeny?: () => void;
  setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmAlert = ({
  isDialogVisible,
  message,
  title = "Confirm",
  isDeletion,
  setIsDialogVisible,
  onConfirm,
  onDeny,
}: Props): JSX.Element => (
  <Dialog
    visible={isDialogVisible}
    onTouchOutside={() => setIsDialogVisible(false)}
    animationType="fade"
    statusBarTranslucent
    dialogStyle={{
      borderRadius: 6,
      backgroundColor: isDeletion ? theme.colors.red600 : theme.colors.cyan600,
      elevation: 20,
    }}
  >
    <Typography
      align="center"
      fontSize="xxl"
      fontWeight="semibold"
      paddingBottom={10}
      color={theme.colors.white}
    >
      {title}
    </Typography>
    <Typography align="center" fontSize="md" color={theme.colors.whitish}>
      {message}
    </Typography>
    <Divider marginTop={16} marginBottom={16} />
    <ButtonsContainer>
      <Button
        label="No"
        width="46%"
        bgColor={isDeletion ? theme.colors.red500 : undefined}
        onPress={() => {
          setIsDialogVisible(false);
          onDeny?.();
        }}
      />
      <Button
        label="Yes"
        width="46%"
        bgColor={isDeletion ? theme.colors.red500 : undefined}
        onPress={() => {
          setIsDialogVisible(false);
          onConfirm();
        }}
      />
    </ButtonsContainer>
  </Dialog>
);

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default ConfirmAlert;
