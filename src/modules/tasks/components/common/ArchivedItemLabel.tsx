import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Typography from "components/Typography";

import { TaskLabelContainer } from "./TaskLabelContainer";

type Props = {
  color: string;
  isArchived?: boolean;
};

const ArchivedItemLabel = ({
  isArchived,
  color,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  if (!isArchived) return null;

  return (
    <TaskLabelContainer>
      <Entypo name="archive" size={theme.fontSizes.xs} color={color} />
      <Typography fontSize="xs" color={color}>
        {t("habits.theArchive")}
      </Typography>
    </TaskLabelContainer>
  );
};

export default React.memo(ArchivedItemLabel);
