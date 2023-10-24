import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

type Props = {
  isLocked: boolean;
  hasChanges: boolean;
  saveNoteHandler: (shouldLock: boolean, withAlert?: boolean) => void;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
};

const LockButton = ({
  isLocked,
  hasChanges,
  saveNoteHandler,
  setIsLocked,
}: Props): JSX.Element => {
  const onPress = () => {
    if (isLocked || !hasChanges) {
      setIsLocked((prev) => !prev);

      return;
    }
    setIsLocked(true);
    saveNoteHandler(true, false);
  };

  return (
    <Section onPress={onPress} hitSlop={SMALL_BUTTON_HIT_SLOP}>
      <FontAwesome
        name={isLocked ? "lock" : "unlock-alt"}
        size={24}
        color={isLocked ? theme.colors.cyan700 : theme.colors.gray}
      />
    </Section>
  );
};

const Section = styled.TouchableOpacity`
  margin-top: 1px;
  margin-left: 12px;
`;

export default LockButton;
