import React, { useMemo } from "react";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
import Checkbox from "components/Checkbox";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { HabitActions } from "modules/habits/types";
import styled from "styled-components/native";

type Props = {
  label: string;
  isSelected: boolean;
  action: HabitActions;
  onPress: () => void;
  onPressIn: () => void;
};

const HabitBulkEditItem = ({
  label,
  isSelected,
  action,
  onPress,
  onPressIn,
}: Props): JSX.Element => {
  const { bgColor, textColor, checkboxBgColor } = useMemo(() => {
    let bgColor = theme.colors.white;
    let checkboxBgColor = theme.colors.cyan300;
    let textColor = theme.colors.white;

    if (action === HabitActions.ARCHIVE) {
      bgColor = theme.colors.darkGray;
      checkboxBgColor = theme.colors.gray;
    } else if (action === HabitActions.DELETE) {
      bgColor = theme.colors.red600;
      checkboxBgColor = theme.colors.red500;
    } else {
      textColor = theme.colors.darkBlueText;
    }

    return { bgColor, textColor, checkboxBgColor };
  }, [action]);

  return (
    <Container onPress={onPress} bgColor={bgColor}>
      <Checkbox
        isActive={isSelected}
        borderRadius={3}
        size={28}
        iconSize={theme.fontSizes.md}
        iconColor={textColor}
        bgColor={checkboxBgColor}
      />
      <Typography paddingRight={8} fontWeight="semibold" color={textColor}>
        {label}
      </Typography>
      <DragIconContainer onPressIn={onPressIn} hitSlop={BUTTON_HIT_SLOP}>
        <Ionicons name="reorder-two-outline" size={30} color={textColor} />
      </DragIconContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity<{ bgColor: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  border-radius: 6px;
  background-color: ${({ bgColor }) => bgColor};
  padding: 8px 16px;
  width: 100%;
`;

const DragIconContainer = styled.TouchableOpacity``;

export default React.memo(HabitBulkEditItem);
