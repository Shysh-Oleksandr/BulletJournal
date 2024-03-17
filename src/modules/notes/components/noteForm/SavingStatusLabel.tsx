import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

const SavingIcon = (
  <MaterialCommunityIcons
    name="content-save"
    size={22}
    color={theme.colors.cyan600}
  />
);
const NotSavedIcon = (
  <MaterialCommunityIcons
    name="content-save-edit"
    size={22}
    color={theme.colors.cyan600}
  />
);

type Props = {
  isSaving: boolean;
  hasChanges: boolean;
  isLocked?: boolean;
};

const SavingStatusLabel = ({
  isSaving,
  hasChanges,
  isLocked,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const label = useMemo(() => {
    if (isSaving) return t("note.saving");

    if (hasChanges) return t("note.notSaved");

    return t("note.locked");
  }, [hasChanges, isSaving, t]);

  const Icon = useMemo(() => {
    if (isSaving) return SavingIcon;

    if (hasChanges) return NotSavedIcon;

    return null;
  }, [hasChanges, isSaving]);

  if (!hasChanges && !isSaving && !isLocked) return null;

  return (
    <Section>
      {Icon}
      <Typography paddingLeft={3}>{label}</Typography>
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default SavingStatusLabel;
