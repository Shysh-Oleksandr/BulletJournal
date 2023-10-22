import React, { useMemo } from "react";
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
  isLocked: boolean;
};

const SavingStatusLabel = ({
  isSaving,
  hasChanges,
  isLocked,
}: Props): JSX.Element | null => {
  const label = useMemo(() => {
    if (isSaving) return "Saving...";

    if (hasChanges) return "Not saved";

    return "Locked";
  }, [hasChanges, isSaving]);

  const Icon = useMemo(() => {
    if (isSaving) return SavingIcon;

    if (hasChanges) return NotSavedIcon;

    return null;
  }, [hasChanges, isSaving]);

  if (!hasChanges && !isSaving && !isLocked) return null;

  return (
    <Section>
      {Icon}
      <Typography color={theme.colors.darkBlueText} paddingLeft={3}>
        {label}
      </Typography>
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default SavingStatusLabel;
