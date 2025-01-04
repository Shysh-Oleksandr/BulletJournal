import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import { useGetCustomColor } from "hooks/useGetCustomColor";
import { CustomUserEvents } from "modules/app/types";
import { EMPTY_HABIT } from "modules/habits/data";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";
import { logUserEvent } from "utils/logUserEvent";

import { getEmptyNote } from "../util/getEmptyNote";

const SIZE = 70;

export enum ContentItem {
  NOTE,
  HABIT,
  TASK,
}

type Props = {
  contentItem?: ContentItem;
  withEditIcon?: boolean;
  withTabBarOffset?: boolean;
  bgColor?: string;
  onPress?: () => void;
};

const AddButton = ({
  contentItem = ContentItem.NOTE,
  withEditIcon,
  withTabBarOffset = true,
  bgColor = theme.colors.cyan600,
  onPress,
}: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const isEditIcon = withEditIcon || contentItem === ContentItem.NOTE;

  const { textColor } = useGetCustomColor(bgColor);

  const gradientColors = useMemo(
    () =>
      [
        getDifferentColor(bgColor, 10),
        getDifferentColor(bgColor, -15),
      ] as const,
    [bgColor],
  );

  const onButtonPress = () => {
    logUserEvent(CustomUserEvents.ADD_ICON_PRESS);

    switch (contentItem) {
      case ContentItem.NOTE:
        navigation.navigate(Routes.EDIT_NOTE, {
          item: getEmptyNote(),
          isNewNote: true,
        });
        break;

      case ContentItem.HABIT:
        navigation.navigate(Routes.EDIT_HABIT, {
          item: EMPTY_HABIT,
          isNewHabit: true,
        });
        break;

      default:
        break;
    }
  };

  return (
    <Container withTabBarOffset={withTabBarOffset}>
      <IconContainer onPress={onPress ?? onButtonPress}>
        <SLinearGradient colors={gradientColors}>
          <Entypo
            name={isEditIcon ? "edit" : "plus"}
            size={isEditIcon ? 34 : 42}
            color={textColor}
          />
        </SLinearGradient>
      </IconContainer>
    </Container>
  );
};

const IconContainer = styled.TouchableOpacity`
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 999px;
  elevation: 12;
`;

const SLinearGradient = styled(LinearGradient)`
  width: ${SIZE}px;
  height: ${SIZE}px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
`;

const Container = styled.View<{ withTabBarOffset: boolean }>`
  z-index: 9999;
  position: absolute;
  bottom: ${({ withTabBarOffset }) => (withTabBarOffset ? 25 : 35)}px;
  right: 20px;
`;

export default React.memo(AddButton);
