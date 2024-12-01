import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "react-native-simple-dialogs";
import theme from "theme";

import Button from "components/Button";
import Divider from "components/Divider";
import Typography from "components/Typography";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

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
  title,
  isDeletion,
  setIsDialogVisible,
  onConfirm,
  onDeny,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const gradientColors = useMemo(() => {
    const relevantColor = isDeletion
      ? theme.colors.red600
      : theme.colors.cyan600;

    return [
      getDifferentColor(relevantColor, 10),
      getDifferentColor(relevantColor, -15),
    ] as const;
  }, [isDeletion]);

  return (
    <Dialog
      visible={isDialogVisible}
      onTouchOutside={() => setIsDialogVisible(false)}
      onRequestClose={() => setIsDialogVisible(false)}
      contentInsetAdjustmentBehavior="automatic"
      animationType="fade"
      statusBarTranslucent
      contentStyle={{
        padding: 0,
        paddingTop: 0,
      }}
      dialogStyle={{
        borderRadius: 6,
        elevation: 20,
      }}
    >
      <SLinearGradient colors={gradientColors}>
        <Typography
          align="center"
          fontSize="xxl"
          fontWeight="semibold"
          paddingBottom={10}
          color={theme.colors.white}
        >
          {title ?? t("general.confirm")}
        </Typography>
        <Typography align="center" fontSize="md" color={theme.colors.whitish}>
          {message}
        </Typography>
        <Divider marginTop={16} marginBottom={16} />
        <ButtonsContainer>
          <Button
            label={t("general.no")}
            width="46%"
            bgColor={isDeletion ? theme.colors.red500 : undefined}
            shouldReverseBgColor={!isDeletion}
            onPress={() => {
              setIsDialogVisible(false);
              onDeny?.();
            }}
          />
          <Button
            label={t("general.yes")}
            width="46%"
            bgColor={isDeletion ? theme.colors.red500 : undefined}
            shouldReverseBgColor={!isDeletion}
            onPress={() => {
              setIsDialogVisible(false);
              onConfirm();
            }}
          />
        </ButtonsContainer>
      </SLinearGradient>
    </Dialog>
  );
};

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SLinearGradient = styled(LinearGradient)`
  padding: 20px;
  border-radius: 6px;
`;

export default ConfirmAlert;
