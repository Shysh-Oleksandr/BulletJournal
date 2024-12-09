import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  amount: number | string;
  label: string;
  textColor: string;
  secondaryTextColor: string;
};

const HabitStatItem = ({
  label,
  amount,
  textColor,
  secondaryTextColor,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <Typography fontWeight="bold" fontSize="xxl" color={textColor}>
        {amount}{" "}
        <Typography fontWeight="bold" fontSize="md" color={secondaryTextColor}>
          {t("habits.times")}
        </Typography>
      </Typography>
      <Typography fontWeight="bold" paddingTop={4} color={textColor}>
        {label}
      </Typography>
    </Container>
  );
};

const Container = styled.View`
  width: 47%;
`;

export default React.memo(HabitStatItem);
