import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Animated, Modal, useWindowDimensions } from "react-native";
import style from "styled-components";

import styled from "styled-components/native";

type Props = {
  isVisible: boolean;
  modalAnimationTime?: number;
  statusBarTranslucent?: boolean;
  bgOpacity: number;
  closeTriggered?: boolean;
  setIsVisible: (arg: boolean) => void;
  setCloseTriggered?: (value: boolean) => void;
  onClose?: () => void;
};

const AnimatedModalContainer = ({
  modalAnimationTime,
  isVisible,
  bgOpacity,
  closeTriggered,
  children,
  setIsVisible,
  setCloseTriggered,
  onClose,
}: PropsWithChildren<Props>): JSX.Element => {
  const { height: screenHeight } = useWindowDimensions();

  const modalTransition = useRef(new Animated.Value(0)).current;

  const modalContainerStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: modalTransition.interpolate({
            outputRange: [screenHeight, 0],
            inputRange: [0, 1],
          }),
        },
      ],
    }),
    [modalTransition, screenHeight],
  );

  const modalTransitionDownAnimation = useMemo(
    () =>
      Animated.timing(modalTransition, {
        duration: modalAnimationTime,
        useNativeDriver: true,
        toValue: 0,
      }),
    [modalTransition, modalAnimationTime],
  );

  const modalTransitionUpAnimation = useMemo(
    () =>
      Animated.timing(modalTransition, {
        duration: modalAnimationTime,
        useNativeDriver: true,
        toValue: 1,
      }),
    [modalAnimationTime, modalTransition],
  );

  // Close modal animation
  const closeModal = useCallback(() => {
    modalTransitionDownAnimation.start(({ finished }) => {
      if (finished) {
        setIsVisible(false);

        onClose?.();
      }
    });
  }, [modalTransitionDownAnimation, setIsVisible, onClose]);

  const onRequestClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose, setIsVisible]);

  // Modal background Animation
  useEffect(() => {
    requestAnimationFrame(() => {
      isVisible && modalTransitionUpAnimation.start();
    });

    return () => {
      modalTransitionUpAnimation.stop();
    };
  }, [isVisible, modalTransitionUpAnimation]);

  // closing modal outside the component
  useEffect(() => {
    if (closeTriggered && setCloseTriggered) {
      closeModal();
      setCloseTriggered(false);
    }
  }, [closeModal, closeTriggered, setCloseTriggered]);

  return (
    <Modal
      onRequestClose={onRequestClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      animationType="fade"
      visible={isVisible}
      transparent
    >
      <SBackground bgOpacity={bgOpacity} />

      <SModalContainer style={modalContainerStyle}>
        <STopSpace onTouchEnd={closeModal} />

        {children}
      </SModalContainer>
    </Modal>
  );
};

const SModalContainer = style(Animated.View)`
  height: 100%;
  width: 100%;
  justify-content: flex-end;
`;

const SBackground = styled.View<{ bgOpacity: number }>`
  position: absolute;
  top: 0;
  bottom: -100px;
  z-index: -100;
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  opacity: ${({ bgOpacity }) => bgOpacity};
`;

const STopSpace = styled.View`
  flex: 1;
  width: 100%;
  background-color: transparent;
`;

export default AnimatedModalContainer;
