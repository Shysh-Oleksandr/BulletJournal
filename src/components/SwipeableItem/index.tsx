import React, {
  PropsWithChildren,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { Animated, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import style from "styled-components";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import styled from "styled-components/native";

import DeleteItemModal from "./DeleteItemModal";

type Props = {
  swipeEnabled?: boolean;
  isPressDisabled?: boolean;
  activeOpacity?: number;
  setIsSwiped?: (value: boolean) => void;
  onPress: () => void;
  onDelete?: () => void;
};

const SwipeableItem = ({
  swipeEnabled = true,
  isPressDisabled = false,
  activeOpacity,
  children,
  setIsSwiped,
  onPress,
  onDelete,
}: PropsWithChildren<Props>): JSX.Element => {
  const [isRightSideSwiped, setIsRightSideSwiped] = useState(false);
  const [isLeftSideSwiped, setIsLeftSwiped] = useState(false);

  const swipeRef = useRef<Swipeable | null>(null);

  const handleDeleteSubmit = useCallback(() => {
    onDelete?.();

    swipeRef.current?.close();
  }, [onDelete]);

  const RightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>) => {
      const opacity = progress.interpolate({
        inputRange: [0.8, 1],
        outputRange: [0, 1],
      });

      return (
        <DeleteWrapper style={{ opacity }}>
          <DeleteButton
            onPress={() => {
              setIsLeftSwiped(true);
              swipeRef.current?.openLeft();
            }}
          >
            <MaterialIcons name="delete" size={32} color={theme.colors.white} />
          </DeleteButton>
        </DeleteWrapper>
      );
    },
    [],
  );

  const LeftActions = useCallback(() => {
    if (!isRightSideSwiped) {
      return null;
    }

    if (!isLeftSideSwiped) {
      return <View style={{ flex: 1 }} />;
    }

    return (
      <DeleteItemModal
        warningMessage="Are you sure?"
        confirmMessage="Delete selected item?"
        yesHandler={handleDeleteSubmit}
        noHandler={() => swipeRef.current?.close()}
      />
    );
  }, [handleDeleteSubmit, isLeftSideSwiped, isRightSideSwiped]);

  return (
    <GestureHandlerRootView>
      <Container isRightSideSwiped={isRightSideSwiped}>
        <Swipeable
          ref={(ref) => {
            swipeRef.current = ref;
          }}
          friction={2}
          rightThreshold={10}
          overshootRight={false}
          overshootLeft={false}
          enabled={swipeEnabled}
          renderRightActions={RightActions}
          renderLeftActions={LeftActions}
          onSwipeableWillOpen={(direction) => {
            if (direction === "left") return;

            setIsRightSideSwiped(true);
            setIsSwiped?.(true);
          }}
          onSwipeableClose={() => {
            setIsRightSideSwiped(false);
            setIsSwiped?.(false);
            setIsLeftSwiped(false);
          }}
          containerStyle={{
            overflow: "visible",
          }}
        >
          <StyledDropShadow isRightSideSwiped={isRightSideSwiped}>
            <ChildrenContainer
              swipeEnabled={swipeEnabled}
              activeOpacity={activeOpacity}
              onPress={onPress}
              disabled={isPressDisabled}
            >
              {children}
            </ChildrenContainer>
          </StyledDropShadow>
        </Swipeable>
      </Container>
    </GestureHandlerRootView>
  );
};

const Container = styled.View<{
  isRightSideSwiped: boolean;
}>`
  border-radius: 4px;

  ${({ isRightSideSwiped }) =>
    isRightSideSwiped && `background-color: ${theme.colors.white};`}
`;

const StyledDropShadow = styled.View<{
  isRightSideSwiped: boolean;
}>`
  shadow-color: ${theme.colors.black};
  shadow-offset: 0 10px;
  shadow-radius: 20px;
  shadow-opacity: ${({ isRightSideSwiped }) => (isRightSideSwiped ? 0.25 : 0)};
`;

const ChildrenContainer = styled.TouchableOpacity<{
  swipeEnabled: boolean;
}>`
  flex-direction: row;
  justify-content: space-between;

  border-radius: 4px;

  ${({ swipeEnabled }) =>
    swipeEnabled &&
    `
      border: 2px solid ${theme.colors.darkBlueText};
    `}
`;

const DeleteWrapper = style(Animated.View)`
  width: 78px;
  height: 65px;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const DeleteButton = styled.TouchableOpacity`
  background: ${theme.colors.red600};
  width: 100%;
  height: 100%;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  align-items: center;
  justify-content: center;
`;

export default memo(SwipeableItem);
