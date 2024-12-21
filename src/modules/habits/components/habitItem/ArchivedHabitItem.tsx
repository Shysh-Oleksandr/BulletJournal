import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Button from "components/Button";
import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  label: string;
  onPress: () => void;
  onUnarchive: () => void;
};

const ArchivedHabitItem = ({
  label,
  onPress,
  onUnarchive,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container onPress={onPress}>
      <Typography paddingRight={8} fontWeight="semibold">
        {label}
      </Typography>
      <Button
        onPress={onUnarchive}
        label={t("habits.unarchive")}
        width="45%"
        labelProps={{
          fontSize: "md",
          paddingVertical: 6,
        }}
        elevation={0}
        shouldReverseBgColor
        adjustsFontSizeToFit
      />
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  border-radius: 6px;
  background-color: ${theme.colors.white};
  padding: 8px 16px;
  width: 100%;
`;

export default React.memo(ArchivedHabitItem);
