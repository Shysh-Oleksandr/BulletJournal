import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  amount: number | string;
  label: string;
};

const HabitStatItem = ({ label, amount }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <Typography fontWeight="bold" fontSize="xxl">
        {amount}{" "}
        <Typography
          fontWeight="bold"
          fontSize="md"
          color={theme.colors.darkGray}
        >
          {t("habits.Days")}
        </Typography>
      </Typography>
      <Typography fontWeight="bold" paddingTop={4}>
        {label}
      </Typography>
    </Container>
  );
};

const Container = styled.View`
  width: 46%;
`;

export default React.memo(HabitStatItem);
